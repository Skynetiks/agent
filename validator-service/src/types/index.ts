export enum EmailStatus {
  VALID = "VALID",
  CATCHALL = "CATCHALL",
  INVALID = "INVALID",
  UNKNOWN = "UNKNOWN",
}

export type Lead = {
  email: string;
  url: string;
  agentId: string;
};
