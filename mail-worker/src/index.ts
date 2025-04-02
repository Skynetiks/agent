import { Message } from "@aws-sdk/client-sqs";
import {
  EmailContentOptions,
  MailMethod,
  SESConfig,
  SMTPConfig,
} from "./types/mails.js";
import { SQSInputType } from "./types/sqs.js";
import { env } from "./utils/env.js";
import { Logger } from "./utils/logger.js";
import { sendMail } from "./utils/mail.js";
import { SQSConsumer } from "./utils/sqs.js";

async function processMessage(message: Message, body: SQSInputType) {
  const email = {
    replyToEmail: body.email.replyToEmail,
    from: body.email.from,
    to: [body.email.to],
    subject: body.email.subject,
    body: body.email.body,
    senderName: body.email.senderName,
  } satisfies EmailContentOptions;

  const sqsConfig = {
    region: env.SQS_REGION,
    accessKeyId: env.AWS_KEY,
    secretAccessKey: env.AWS_SECRET,
  } satisfies SESConfig;

  await sendMail({ email, method: MailMethod.SES, config: sqsConfig });
}

async function main() {
  Logger.debug("App Started In Debug Mode");
  if (env.NODE_ENV === "production") {
    Logger.info("App is In Production Environment");
  }

  const consumer = new SQSConsumer<SQSInputType>(
    env.MAIL_SENDER_QUEUE_URL,
    processMessage,
    {
      concurrencyLimit: env.CONCURRENCY,
      pollingInterval: 5000,
    }
  );

  consumer.start();
}

main();
