import { Message } from "@aws-sdk/client-sqs";
import { EmailContentOptions, MailMethod, SESConfig } from "./types/mails.js";
import { SQSInputType } from "./types/sqs.js";
import { env } from "./utils/env.js";
import { Logger } from "./utils/logger.js";
import { sendMail } from "./utils/mail.js";
import { SQSConsumer } from "./utils/sqs.js";
import { redis } from "./utils/redis.js";
import {
  AgentStatus,
  DBLogger,
  incrementAgentMailUsedCount,
  updateTaskStatus,
} from "./queries/agent.js";

async function processMessage(message: Message, body: SQSInputType) {
  try {
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
    await Promise.all([
      updateTaskStatus(body.taskId, AgentStatus.COMPLETED),
      new DBLogger(body.agentId).log(
        "Email delivery successful",
        `Email sent to ${body.email.to} with subject: ${body.email.subject}`
      ),
      incrementAgentMailUsedCount(body.agentId),
    ]);
  } catch (error) {
    Logger.error("Failed to send email", {
      error,
      messageId: message.MessageId,
      body: JSON.stringify(body),
    });

    await Promise.all([
      new DBLogger(body.agentId).error(
        "Email delivery failed",
        `Email failed to send to ${body.email.to} with subject: ${body.email.subject} will be retried`
      ),
      updateTaskStatus(body.taskId, AgentStatus.COMPLETED),
    ]);

    throw error;
  }
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
