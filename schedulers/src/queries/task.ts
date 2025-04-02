import { AgentTask } from "../types/task";
import { query } from "../utils/db";

const fetchTasksQuery = `
SELECT
    a.*
FROM "public"."AgentTask" AS a
WHERE
    "status" = 'PENDING'
    AND CURRENT_TIME >= "startTime"::TIME
    AND CURRENT_TIME <= "endTime"::TIME
    AND TRIM(to_char(NOW(), 'Day')) IN (SELECT unnest("ActiveDays"))
    AND (
        "lastCheckedAt" IS NULL
        OR "lastCheckedAt" <= NOW() - INTERVAL '1 hour'
    )
ORDER BY a."createdAt" ASC
LIMIT 10;
`;

export const fetchTopTasks = async () => {
  try {
    return await query<AgentTask>(fetchTasksQuery);
  } catch (error) {
    return [];
  }
};
