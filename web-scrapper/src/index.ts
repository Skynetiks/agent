import { Message } from "@aws-sdk/client-sqs";
import { env } from "./utils/env";
import { SQSConsumer } from "./utils/sqs";
import { ScrapeCompanyDetails } from "./scrapper";
import { Lead } from "./types/sqs";

const processMessage = async (message: Message, body: Lead) => {
  console.log(message, body);
  const companyDetails = await ScrapeCompanyDetails(body.url);
  console.log(companyDetails);
};

async function main() {
  const consumer = new SQSConsumer<Lead>(
    env.WEB_SCRAPPER_QUEUE_URL,
    processMessage
  );
  consumer.start();
}

main();
