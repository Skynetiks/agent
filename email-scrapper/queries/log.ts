import { query } from "../src/utils/db";
import { Logger } from "../src/utils/logger";

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
  private service: AgentLogService = AgentLogService.LEAD_FINDER;
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
