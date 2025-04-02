import { fetchTopTasks } from "./queries/task";
import { SQSOutputType } from "./types/task";
import { env } from "./utils/env";
import { Logger } from "./utils/logger";
import { SQSService } from "./utils/sqs";
import cron from "node-cron";

const publisher = new SQSService<SQSOutputType>({
  queueUrl: env.MAIL_SENDER_QUEUE_URL,
  region: env.SQS_REGION,
});

async function pushLeadsToQueue() {
  const agentTasks = await fetchTopTasks();

  const jobs = agentTasks.map((task) => ({
    agentId: task.agentId,
    email: {
      from: task.from,
      to: task.to,
      subject: task.subject,
      body: task.bodyHtml,
      senderName: task.senderName,
      replyToEmail: task.replyTo,
    },
  })) satisfies SQSOutputType[];

  publisher.sendBatchMessages(jobs, 10);
}

function startScheduler() {
  cron.schedule(env.MAIL_SENDER_CRON, async () => {
    Logger.info("Running SQS Scheduler...");
    await pushLeadsToQueue();
  });

  Logger.info(
    `Scheduler started: Running according to the ${env.MAIL_SENDER_CRON} cron expression`
  );
}

Logger.info(`Starting the App in ${env.NODE_ENV} mode...`);
Logger.debug(`Debug mode is on`);
startScheduler();

process.on("SIGINT", async () => {
  Logger.info("🛑 Shutting down scheduler...");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  Logger.info("🛑 Shutting down scheduler...");
  process.exit(0);
});
