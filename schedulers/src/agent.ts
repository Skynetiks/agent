import cron from "node-cron";
import { SQSService } from "./utils/sqs";
import { SQSAgentData, SQSRegion } from "./types";
import { env } from "./utils/env";
import { Logger } from "./utils/logger";
import { decreaseLastKeywordIndex, getActiveAgents } from "./queries/agent";

// Initialize SQS service
const leadGeneratorQueue = new SQSService<SQSAgentData>({
  region: env.SQS_REGION,
  queueUrl: env.LEAD_GENERATOR_QUEUE_URL,
});

async function pushAgentsToQueue() {
  let agents: SQSAgentData[] | undefined;
  try {
    Logger.info(`⏱️ Fetching active agents`);

    agents = await getActiveAgents();

    if (agents.length === 0) {
      Logger.info("No active agents found.");
      return;
    }

    Logger.info(`🚀 Pushing ${agents.length} agents to SQS...`);

    Logger.debug(
      `Got ${agents.length} Agents from db. with names [${agents
        .map((a) => a.name)
        .join(",")}]`
    );

    await leadGeneratorQueue.sendBatchMessages(agents, 10);

    Logger.info(`Successfully pushed ${agents.length} agents to SQS.`);
  } catch (error) {
    Logger.error(`Failed to push agents: ${error}`);
    if (agents?.length) {
      decreaseLastKeywordIndex(agents.map((agent) => agent.id));
    }
  }
}

pushAgentsToQueue();

// TODO: Uncomment this
// function startScheduler() {
//   cron.schedule(env.AGENT_SCHEDULER_CRON, async () => {
//     Logger.info("Running SQS Scheduler...");
//     await pushAgentsToQueue();
//   });

//   Logger.info(
//     `Scheduler started: Running according to the ${env.AGENT_SCHEDULER_CRON} cron expression`
//   );
// }

// Logger.info(`Starting the App in ${env.NODE_ENV} mode...`);
// Logger.debug(`Debug mode is on`);
// startScheduler();

// process.on("SIGINT", async () => {
//   Logger.info("🛑 Shutting down scheduler...");
//   process.exit(0);
// });

// process.on("SIGTERM", async () => {
//   Logger.info("🛑 Shutting down scheduler...");
//   process.exit(0);
// });
