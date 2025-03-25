import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import nodemailer from "nodemailer";
import {
  EmailContentOptions,
  MailMethod,
  SendMailProps,
  SendMailResponse,
  SESConfig,
  SMTPConfig,
} from "../types/mails.js";
import { EmailSendError, Severity } from "./errors.js";
import { htmlToText } from "html-to-text";
import Mail from "nodemailer/lib/mailer/index.js";
import { decryptToken } from "./decrypt.js";
import { getSendEmailCommand } from "./aws.js";
import { env } from "./env.js";
import { Logger } from "./logger.js";

// Public function (only this is exported)
export async function sendMail<T extends MailMethod>({
  config,
  email,
  method,
}: SendMailProps<T>): Promise<SendMailResponse> {
  let messageId: string | undefined;

  if (env.SKIP_MAIL_SEND) {
    Logger.info(
      `Skipping Mail to ${email.to[0]} Because SKIP_MAIL_SEND is set`,
      { email }
    );
    return { MessageId: "SKIPPED" };
  }

  if (method === MailMethod.SES) {
    messageId = await sendViaSES(email, config as SESConfig);
  } else if (method === MailMethod.SMTP) {
    messageId = await sendViaSMTP(email, config as SMTPConfig);
  } else {
    throw new EmailSendError(
      "Got an invalid mail method while sending an email",
      Severity.CRITICAL,
      { method: method, allowedMethods: MailMethod, email: email }
    );
  }

  return { MessageId: messageId };
}

// Private functions (not exported)
async function sendViaSES(email: EmailContentOptions, config: SESConfig) {
  const sesClient = new SESClient({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  const params = getSendEmailCommand(
    email.from,
    email.senderName,
    email.to,
    email.subject,
    email.body,
    email.replyToEmail
  );

  Logger.info(`Sending Email via SES ${email.to[0]}`);
  const data = await sesClient.send(params);

  return data.MessageId;
}

async function sendViaSMTP(email: EmailContentOptions, config: SMTPConfig) {
  const plainBody = htmlToText(email.body);
  const decryptedPass = decryptToken(config.encryptedPass);

  const mailOptions = {
    from: `${email.senderName} <${email.from}>`,
    sender: process.env.ADMIN_SMTP_EMAIL,
    to: email.to.join(", "),
    subject: email.subject,
    text: plainBody,
    html: email.body,
    replyTo: email.replyToEmail || email.from,
    attachDataUrls: true,
  } satisfies Mail.Options;

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: decryptedPass,
    },
  });

  Logger.info(`Sending Email via SMTP ${email.to[0]}`);
  const response = await transporter.sendMail(mailOptions);
  return response.messageId;
}
