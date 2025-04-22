import { query } from "../utils/db";
import { Logger } from "../utils/logger";

export enum AgentStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  ERROR = "ERROR",
}
export async function updateTaskStatus(taskId: string, status: AgentStatus) {
  const q = `
    UPDATE "AgentTask"
    SET status = $1, "updatedAt" = now()
    WHERE id = $2
  `;

  try {
    await query(q, [status, taskId]);
  } catch (error) {
    Logger.error("Failed to update task status", { error, taskId });
    throw error;
  }
}

export async function incrementAgentMailUsedCount(agentId: string) {
  const q = `UPDATE "Organization" o
SET "agentMailUsedCount" = o."agentMailUsedCount" + 1
FROM "Agent" a
WHERE a.id = $1
AND a."organizationId" = o.id`;

  try {
    await query(q, [agentId]);
  } catch (error) {
    Logger.error("Failed to increment agent mail used count", {
      error,
      agentId,
    });
    throw error;
  }
}

export enum AgentLogType {
  INFO = "INFO",
  ERROR = "ERROR",
}

export enum AgentLogService {
  EMAIL_SENDER = "EMAIL_SENDER",
  CONTENT_GENERATOR = "CONTENT_GENERATOR",
  WEBSITE_SCRAPPER = "WEBSITE_SCRAPPER",
  LEAD_FINDER = "LEAD_FINDER",
}

const queryString = `
INSERT INTO "AgentLog" (
  "id",
  "agentId",
  "title",
  "message",
  "type",
  "service",
  "createdAt"
) VALUES (
  gen_random_uuid(),
  $1,
  $2,
  $3,
  $3,
  $4,
  NOW()
);
`;

export class DBLogger {
  private agentId: string;
  private service: AgentLogService = AgentLogService.EMAIL_SENDER;
  constructor(agentId: string) {
    if (!agentId) {
      throw new Error("AgentId is not set");
    }
    this.agentId = agentId;
  }

  public async log(title: string, message: string) {
    if (!this.agentId) {
      throw new Error("AgentId is not set");
    }

    try {
      await query(queryString, [
        this.agentId,
        title,
        message,
        AgentLogType.INFO,
        this.service,
      ]);
    } catch (error) {
      Logger.error("Failed to log agent event", {
        error,
        agentId: this.agentId,
      });
    }
  }

  public async error(title: string, message: string) {
    if (!this.agentId) {
      throw new Error("AgentId is not set");
    }

    try {
      await query(queryString, [
        this.agentId,
        title,
        message,
        AgentLogType.ERROR,
        this.service,
      ]);
    } catch (error) {
      Logger.error("Failed to log agent event", {
        error,
        agentId: this.agentId,
      });
    }
  }
}
