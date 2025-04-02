import {
  AgentWithSenderIdentityDto,
  ContentLength,
  PersonalizationLevel,
  SenderIdentityType,
  Tone,
} from "../types/agent";
import { query } from "../utils/db";

const getAgentByIdWithSenderIdentitiesQuery = `
SELECT
      a.id,
      a.name,
      a.description,
      a.keywords[a."lastKeywordIndex"] AS "keyword",
      a."startTime",
      a."activeDays",
      a."endTime",
      a."senderName",
      a.timezone,
      a."sendLimitDay",
      a.objective,
      a."valueProposition",
      a."personalizationLevel",
      a.length AS "contentLength",
      a.strategy,
      a.tone,
      a."lastKeywordIndex",
      a."createdAt",
      a."updatedAt",
      si.id AS "senderIdentityId",
      si.email AS "senderEmail",
      si.type AS "senderType",
      si."isActive" AS "senderIsActive",
      si."createdAt" AS "senderCreatedAt",
      si."organizationId" AS "organizationId",
      o.name AS "organizationName",
      o.industry AS "organizationIndustry"
    FROM
      "Agent" a
    JOIN
      "_AgentToSenderIdentities" aj ON a.id = aj."A"
    JOIN
      "SenderIdentities" si ON si.id = aj."B"
    JOIN
      "Organization" o ON a."organizationId" = o.id
    WHERE
      a.id = $1
`;

export async function getAgentByIdWithSenderIdentities(
  agentId: string
): Promise<AgentWithSenderIdentityDto[]> {
  try {
    const result = await query<AgentWithSenderIdentityDto>(
      getAgentByIdWithSenderIdentitiesQuery,
      [agentId]
    );

    if (result.length === 0) {
      return [];
    }

    // Transform the raw results to properly typed objects
    return result.map((row) => ({
      ...row,
      // Convert string enums to proper enum types
      personalizationLevel: row.personalizationLevel as PersonalizationLevel,
      contentLength: row.contentLength as ContentLength,
      tone: row.tone as Tone,
      senderType: row.senderType as SenderIdentityType,
      // Ensure dates are properly parsed
      activeTill: row.activeTill ? new Date(row.activeTill) : null,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
      senderCreatedAt: new Date(row.senderCreatedAt),
    }));
  } catch (error) {
    console.error(`Error fetching agent with ID ${agentId}:`, error);
    throw error;
  }
}

export const createAgentTask = async (taskData: {
  agentId: string;
  bodyHtml: string;
  subject: string;
  from: string;
  to: string;
  replyTo?: string;
  startTime: string | null;
  endTime: string | null;
  timezone: string | null;
  activeDays: string[];
  status: string;
  errMsg?: string | null;
  senderName?: string;
}) => {
  const queryString = `
      INSERT INTO "AgentTask" (
        "id", "agentId", "bodyHtml", "subject", "from", "to", "replyTo",
        "startTime", "endTime", "timezone", "ActiveDays", "status", "errMsg",
        "createdAt", "updatedAt", "lastCheckedAt", "senderName"
      ) VALUES (
        gen_random_uuid(),
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        NOW(), NOW(), NULL, $13
      ) RETURNING *;
    `;

  const values = [
    taskData.agentId,
    taskData.bodyHtml,
    taskData.subject,
    taskData.from,
    taskData.to,
    taskData.replyTo || null,
    taskData.startTime,
    taskData.endTime,
    taskData.timezone,
    taskData.activeDays,
    taskData.status,
    taskData.errMsg || null,
    taskData.senderName || null,
  ];

  try {
    const [agentTask] = await query(queryString, values);
    return agentTask;
  } catch (error) {
    console.error("Error inserting AgentTask:", error);
    throw error;
  }
};
