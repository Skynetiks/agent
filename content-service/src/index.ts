import { Message } from "@aws-sdk/client-sqs";
import { generateMailContent } from "./utils/generator";
import { CompanyInfo, SQSInputType } from "./types";
import { NonRetriableError, SQSConsumer } from "./utils/sqs";
import { cache__getAgentDetails } from "./utils/agent";
import { StrategyOption } from "./prompts/options/statergy";
import { createAgentTask } from "./queries/agent";
import { env } from "./utils/env";
import { DBLogger } from "./queries/log";

const processMessage = async (message: Message, body: SQSInputType) => {
  const receiverCompanyInfo = {
    companyName: body.companyName,
    industry: "",
    contact: {
      email: body.email,
    },
    websiteData: `
<company-details information="this is the company details/description of the target company">
    ${body.companyDescription}
</company-details>
<other-context information="this is the other context such as posts, articles, etc. (should not affect the email too much)">
    ${body.otherContext}
</other-context>
    `,
    valueProposition: undefined,
  } satisfies CompanyInfo<"receiver">;

  const agents = await cache__getAgentDetails(body.agentId);

  if (!agents.length) {
    throw new NonRetriableError("Agent not found");
  }

  const agent = agents[Math.floor(Math.random() * agents.length)];

  const senderCompanyInfo = {
    companyName: agent.organizationName,
    industry: agent.organizationIndustry,
    contact: {
      email: agent.senderEmail,
      name: agent.senderName,
    },
    websiteData: undefined,
    valueProposition: agent.valueProposition || "",
  } satisfies CompanyInfo<"sender">;

  //   TODO: Implement CTA
  const content = await generateMailContent({
    senderCompanyInfo,
    objective: agent.objective || "",
    receiverCompanyInfo,
    personalizationLevel: agent.personalizationLevel || "",
    length: agent.contentLength || "",
    strategy: (agent.strategy as StrategyOption) || "",
    cta: undefined,
    tone: agent.tone || "",
  });

  // TODO: Implement replyTo
  await createAgentTask({
    activeDays: agent.activeDays,
    agentId: agent.id,
    bodyHtml: content.body || "",
    endTime: agent.endTime,
    from: agent.senderEmail,
    startTime: agent.startTime,
    status: "PENDING",
    subject: content.subject || "",
    timezone: agent.timezone,
    to: body.email,
    replyTo: agent.senderEmail,
    senderName: agent.senderName,
  });

  await new DBLogger(agent.id).log(
    "Email Prepared",
    `An email has been prepared with subject: ${content.subject}`
  );
};

async function main() {
  const consumer = new SQSConsumer<SQSInputType>(
    env.CONTENT_GENERATOR_QUEUE_URL,
    processMessage
  );

  consumer.start();
}

main();
