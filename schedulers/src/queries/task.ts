import { SQSAgentData } from "../types";
import { AgentTask } from "../types/task";
import { query } from "../utils/db";
import { Logger } from "../utils/logger";
import { redis } from "../utils/redis";

const fetchTasksQuery = `
WITH updated_rows AS (
    UPDATE "public"."AgentTask" AS a
    SET "lastCheckedAt" = NOW()
    WHERE
        a."status" = 'PENDING'
        AND CURRENT_TIME >= a."startTime"::TIME
        AND CURRENT_TIME <= a."endTime"::TIME
        AND TRIM(to_char(NOW(), 'FMDay')) = ANY("ActiveDays")
        AND (
            a."lastCheckedAt" IS NULL
            OR a."lastCheckedAt" <= NOW() - INTERVAL '1 hour'
        )
    ORDER BY a."createdAt" ASC
    LIMIT 10
    RETURNING a.*
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

    await redis.incr(`${agentId}:currentCount`);
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
