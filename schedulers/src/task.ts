import { fetchTopTasks } from "./queries/task";
import { SQSOutputType } from "./types/task";
import { env } from "./utils/env";
import { SQSService } from "./utils/sqs";

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

// TODO: Add a cron job to run this function every hour
pushLeadsToQueue();
