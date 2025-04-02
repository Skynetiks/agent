export type SQSInputType = {
  agentId: string;
  email: {
    to: string;
    subject: string;
    body: string;
    senderName: string;
    replyToEmail?: string;
    from: string;
  };
};
