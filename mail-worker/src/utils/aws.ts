import { SendEmailCommand } from "@aws-sdk/client-ses";
import { env } from "./env";

export const getSendEmailCommand = (
  senderEmail: string,
  senderName: string,
  recipients: string[],
  subject: string,
  body: string,
  replyToEmail?: string
) => {
  const configSet = env.SES_CONFIG_SET
    ? {
        ConfigurationSetName: env.SES_CONFIG_SET,
      }
    : {};

  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: recipients,
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: body,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: `${senderName} <${senderEmail}>`,
    ReplyToAddresses: [replyToEmail || senderEmail],
    ...configSet,
  });
};
