import { AgentData } from "../types";
import { query } from "../utils/db";
import { Logger } from "../utils/logger";

/**
 * SQL query to fetch and update active agents with their next keyword.
 *
 * The query performs the following operations:
 * 1. Creates a CTE (Common Table Expression) to select active agents
 * 2. Gets the next keyword from the keywords array based on lastKeywordIndex
 * 3. Updates the lastKeywordIndex for matched agents
 * 4. Returns both the agent data and updated lastKeywordIndex
 *
 * Query conditions:
 * - Agent must be active (activeTill >= current time)
 * - Agent must have remaining keywords (lastKeywordIndex < array length)
 *
 * @limit 10
 * @order by updatedAt ASC Oldest to Newest
 * @remarks
 * This query uses PostgreSQL specific array functions and syntax
 *
 */
export const ActiveAgentsQuery = `
WITH next_keyword AS (
  SELECT
      a.id,
      a.name,
      a.description,
      a.keywords[a."lastKeywordIndex" + 1] AS keyword,
      a."activeTill",
      a.timezone,
      a."sendLimitDay",
      a.objective,
      a."valueProposition",
      a."personalizationLevel",
      a.length,
      a.strategy,
      a.tone,
      a."createdAt",
      a."updatedAt",
      a."lastKeywordIndex"
  FROM "Agent" a
  WHERE
      a."activeTill" IS NOT NULL
      AND a."activeTill" >= NOW()
      AND a."lastKeywordIndex" < array_length(a.keywords, 1)
  ORDER BY a."updatedAt" ASC
  LIMIT 10
)
UPDATE "Agent" AS a
SET "lastKeywordIndex" = nk."lastKeywordIndex" + 1
FROM next_keyword nk
WHERE a.id = nk.id
RETURNING nk.*, a."lastKeywordIndex";
`;

export const getActiveAgents = async () => {
  try {
    return await query<AgentData>(ActiveAgentsQuery);
  } catch {
    return [];
  }
};

export const DecreaseIndexUpdate = `
UPDATE "Agent"
SET "lastKeywordIndex" = GREATEST("lastKeywordIndex" - 1, 0)
WHERE id = ANY($1::text[]) AND "lastKeywordIndex" > 0
RETURNING id, "lastKeywordIndex";
`;

export const decreaseLastKeywordIndex = async (agentIds: string[]) => {
  try {
    if (!agentIds.length) {
      Logger.error("No agent ids provided");
      return null;
    }

    await query(DecreaseIndexUpdate, [agentIds]);
  } catch (error) {
    Logger.error(
      `Something Went wrong while deducting index count from db ${error}`
    );
    return null;
  }
};
