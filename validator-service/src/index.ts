import { Message } from "@aws-sdk/client-sqs";
import { env } from "./utils/env";
import { SQSConsumer, SQSPublisher } from "./utils/sqs";
import { EmailStatus, Lead } from "./types";
import { validateEmail } from "./utils/validateEmail";
import { Logger } from "./utils/logger";

const VALID_STATUSES = [EmailStatus.VALID, EmailStatus.CATCHALL];
const scrapperPublisher = new SQSPublisher<Lead>({
  queueUrl: env.WEB_SCRAPPER_QUEUE_URL,
  region: env.SQS_REGION,
});

async function processMessage(message: Message, body: Lead) {
  const status = await validateEmail(body.email);
  if (VALID_STATUSES.includes(status)) {
    Logger.info(`Sending lead to web scrapper: ${body.email}`);
    await scrapperPublisher.sendMessage(body);
  } else {
    Logger.info(`Skipping lead: ${body.email} because of status ${status}`);
  }
}

async function main() {
  const consumer = new SQSConsumer<Lead>(
    env.LEAD_VERIFICATION_QUEUE_URL,
    processMessage,
    {
      concurrencyLimit: env.CONCURRENCY_LIMIT,
    }
  );

  consumer.start();
}

main();
