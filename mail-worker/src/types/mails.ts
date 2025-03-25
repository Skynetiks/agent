import { EmailSendError } from "../utils/errors.js";

export interface EmailContentOptions {
  from: string;
  to: string[];
  subject: string;
  body: string;
  senderName: string;
  replyToEmail?: string;
}

export interface SMTPConfig {
  host: string;
  port: number;
  user: string;
  encryptedPass: string;
}

export interface SESConfig {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

type SuccessResponseData = {
  MessageId: string | undefined;
};

export enum MailMethod {
  SES = "ses",
  SMTP = "smtp",
}

export type getConfig<T extends MailMethod> = T extends MailMethod.SES
  ? SESConfig
  : T extends MailMethod.SMTP
  ? SMTPConfig
  : never;

export type SendMailProps<T extends MailMethod> = {
  email: EmailContentOptions;
  method: T;
  config: getConfig<T>;
};

export type SendMailResponse = EmailSendError | SuccessResponseData;
