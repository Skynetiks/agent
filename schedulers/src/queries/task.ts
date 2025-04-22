import { SQSAgentData } from "../types";
import { AgentTask } from "../types/task";
import { query } from "../utils/db";
import { Logger } from "../utils/logger";
import { redis } from "../utils/redis";

// FIX: Currently this can cause overflow in case if some process are still processing
const fetchTasksQuery = `
WITH locked_tasks AS (
    SELECT at.*
    FROM "AgentTask" at
    INNER JOIN "Agent" a ON at."agentId" = a.id
    INNER JOIN "Organization" org ON a."organizationId" = org.id
    INNER JOIN "OrgSubscription" sub ON org."orgSubscriptionId" = sub.id
    WHERE
        at."status" = 'PENDING'
        AND CURRENT_TIME >= at."startTime"::TIME
        AND CURRENT_TIME <= at."endTime"::TIME
        AND TRIM(to_char(NOW(), 'FMDay')) = ANY(at."ActiveDays")
        AND (
            at."lastCheckedAt" IS NULL
            OR at."lastCheckedAt" <= NOW() - INTERVAL '1 hour'
        )
        AND org."agentMailUsedCount" < sub."allowedAgentMails"
    ORDER BY at."createdAt" ASC
    LIMIT 10
    FOR UPDATE SKIP LOCKED
),
updated_rows AS (
    UPDATE "AgentTask" at
    SET "lastCheckedAt" = NOW()
    FROM locked_tasks lt
    WHERE at.id = lt.id
    RETURNING at.*
)
SELECT * FROM updated_rows;
`;

export const fetchTopTasks = async () => {
  try {
    const tasks = await query<AgentTask>(fetchTasksQuery);

    const rateLimitedResults = await Promise.all(
      tasks.map(async (task) => {
        const isLimited = await isRateLimited(task.agentId);
        return isLimited ? null : task;
      })
    );

    return rateLimitedResults.filter(
      (task): task is AgentTask => task !== null
    );
  } catch (error) {
    console.error("Error fetching top tasks:", error);
    return [];
  }
};

export const isRateLimited = async (agentId: string): Promise<boolean> => {
  try {
    const [maxCountStr, currentCountStr] = await redis.mget(
      `${agentId}:maxCount`,
      `${agentId}:currentCount`
    );

    const max = parseInt(maxCountStr || "0");
    const current = parseInt(currentCountStr || "0");

    if (current > max) {
      return true;
    }

    await redis.increment(`${agentId}:currentCount`);
    return false;
  } catch (error) {
    Logger.error(`Rate limit check failed for agent ${agentId}: ${error}`);
    return true;
  }
};

export async function initializeRateLimiter(agent: SQSAgentData) {
  try {
    await redis.connect();

    const maxCountKey = `${agent.id}:maxCount`;
    const currentCountKey = `${agent.id}:currentCount`;

    await redis.mset({
      maxCountKey: agent.sendLimitDay.toString(),
      currentCountKey: "0",
    });

    Logger.info(
      `Initialized rate limiter for agent ${agent.id} with maxCount ${agent.sendLimitDay} and currentCount 0`
    );
  } catch (error) {
    Logger.error(
      `Failed to initialize rate limiter for agent ${agent.id}: ${error}`
    );
  }
}
