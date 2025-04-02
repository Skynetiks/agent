import { Message } from "@aws-sdk/client-sqs";
import { generateMailContent } from "./utils/generator";
import { CompanyInfo, SQSInputType } from "./types";
import { NonRetriableError, SQSConsumer } from "./utils/sqs";
import { cache__getAgentDetails } from "./utils/agent";
import { StrategyOption } from "./prompts/options/statergy";
import { createAgentTask } from "./queries/agent";
import { env } from "./utils/env";

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
};

async function main() {
  //   const consumer = new SQSConsumer<SQSInputType>(
  //     env.CONTENT_GENERATOR_QUEUE_URL,
  //     processMessage
  //   );

  //   consumer.start();

  processMessage(
    {},
    {
      agentId: "ckv8y1x9g0001abcd1234xyz",
      companyDescription:
        "Insight AI Solutions is a cutting-edge technology firm specializing in AI-driven analytics, predictive modeling, and automation. With a focus on transforming raw data into actionable insights, the company serves industries such as finance, healthcare, and e-commerce. Founded in 2015, Insight AI Solutions has become a leader in leveraging artificial intelligence to optimize decision-making processes.",
      companyName: "Insight AI Solutions",
      email: "hello@insightai.com",
      companyWebsite: "https://www.insightai.com",
      linkedinUrl: "https://www.linkedin.com/company/insight-ai-solutions",
      otherContext:
        "Recent posts: '5 Ways AI is Revolutionizing Finance', 'How Machine Learning Can Improve Customer Retention', 'The Future of AI in Healthcare'. The company frequently shares insights on emerging trends in artificial intelligence, data science, and automation, offering thought leadership on AI ethics, deep learning advancements, and the impact of AI on global industries.",
    }
  );
}

main();
