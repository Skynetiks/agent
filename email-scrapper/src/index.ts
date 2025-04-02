import { Message } from "@aws-sdk/client-sqs";
import { env } from "./utils/env";
import { scrapeGoogleEmails } from "./utils/extractor";
import { SQSConsumer, SQSPublisher } from "./utils/sqs";
import { Lead, SQSAgentData } from "./types";
import { Email } from "./types/emails";

const verificationPublisher = new SQSPublisher<Lead>({
  queueUrl: env.LEAD_VERIFICATION_QUEUE_URL,
  region: env.SQS_REGION,
});

const handleMessage = async (message: Message, body: SQSAgentData) => {
  const { keywordName, keywordSite } = extractKeywordAndSite(
    body.keyword,
    "::"
  );

  console.log(keywordName, keywordSite);

  const emails = await scrapeGoogleEmails(
    keywordName,
    keywordSite,
    "gmail.com"
  );

  const validEmails = validateEmails(emails);
  await verificationPublisher.sendBatchMessages(
    validEmails.map((email) => ({
      email: email.email,
      url: email.source,
      agentId: body.id,
    }))
  );
};

const extractKeywordAndSite = (keyword: string, separator: string) => {
  const siteMap = {
    linkedin: "linkedin.com/in",
    default: "linkedin.com/in",
  };

  const [keywordName, keywordSite] = keyword.split(separator);
  return {
    keywordName,
    keywordSite: siteMap[keywordSite] || siteMap["default"],
  };
};

const validateEmails = (emails: Email[]): Email[] => {
  const commonDomains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "aol.com",
  ];
  const domainRegex = new RegExp(`@(${commonDomains.join("|")})$`, "i");

  const uniqueEmails = new Map<string, Email>();

  for (const emailObj of emails) {
    const { email } = emailObj;
    if (
      /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email) &&
      domainRegex.test(email) &&
      !uniqueEmails.has(email)
    ) {
      uniqueEmails.set(email, emailObj);
    }
  }

  return Array.from(uniqueEmails.values());
};

const main = async () => {
  //   scrapeGoogleEmails("email marketing", "linkedin.com/in", "gmail.com");

  const consumer = new SQSConsumer<SQSAgentData>(
    env.LEAD_GENERATOR_QUEUE_URL,
    handleMessage,
    { concurrencyLimit: env.CONCURRENCY_LIMIT }
  );

  consumer.start();
};

main();
