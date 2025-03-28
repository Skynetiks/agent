import { Message } from "@aws-sdk/client-sqs";
import { env } from "./utils/env";
import { scrapeGoogleEmails } from "./utils/extractor";
import { SQSConsumer } from "./utils/sqs";
import { SQSAgentData } from "./types";
import { Email } from "./types/emails";

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
  console.log({ validate: validEmails.length });
  console.log({ orignal: emails.length });
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
