export type AgentTask = {
  id: string;
  agentId: string;
  bodyHtml: string;
  subject: string;
  from: string;
  to: string;
  replyTo: string;
  startTime: string; // Format: HH:mm
  endTime: string; // Format: HH:mm
  timezone: string;
  ActiveDays: string[]; // Array of weekdays
  status: "PENDING" | "COMPLETED" | "FAILED"; // Extend with other possible statuses
  errMsg: string | null;
  createdAt: Date;
  updatedAt: Date;
  lastCheckedAt: Date | null;
  senderName: string;
};

export type SQSOutputType = {
  agentId: string;
  email: {
    from: string;
    to: string;
    subject: string;
    body: string;
    senderName: string;
    replyToEmail?: string;
  };
};
