import { Message } from "@aws-sdk/client-sqs";
import { env } from "./utils/env";
import { SQSConsumer, SQSPublisher } from "./utils/sqs";
import { ScrapeCompanyDetails } from "./scrapper";
import { Lead } from "./types/sqs";
import { SQSOutputType } from "./types/scrapper";

const contentServicePublisher = new SQSPublisher<SQSOutputType>({
  queueUrl: env.CONTENT_GENERATOR_QUEUE_URL,
  region: env.SQS_REGION,
});

const processMessage = async (message: Message, body: Lead) => {
  console.log(message, body);
  const companyDetails = await ScrapeCompanyDetails(body.url);
  if (!companyDetails) return;
  contentServicePublisher.sendMessage({
    ...companyDetails,
    email: body.email,
    agentId: body.agentId,
  });
};

async function main() {
  const consumer = new SQSConsumer<Lead>(
    env.WEB_SCRAPPER_QUEUE_URL,
    processMessage
  );
  consumer.start();
}

main();
