import { Message } from "@aws-sdk/client-sqs";
import { EmailContentOptions, MailMethod, SMTPConfig } from "./types/mails.js";
import { SQSInputType } from "./types/sqs.js";
import { env } from "./utils/env.js";
import { Logger } from "./utils/logger.js";
import { sendMail } from "./utils/mail.js";
import { SQSConsumer } from "./utils/sqs.js";

async function processMessage(message: Message, body: SQSInputType) {
  const email = {
    replyToEmail: "test@test.com",
    from: "test@test.com",
    to: ["test@test.com"],
    subject: "Test Subject",
    body: "Test Body",
    senderName: "Test Sender",
  } satisfies EmailContentOptions;

  const config = {
    user: "test@test.com",
    encryptedPass: "test",
    port: 465,
    host: "smtp.gmail.com",
  } satisfies SMTPConfig;

  //   TODO: Implement the body
  await sendMail({ email, method: MailMethod.SMTP, config });
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
