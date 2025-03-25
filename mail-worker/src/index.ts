import { EmailContentOptions, MailMethod, SMTPConfig } from "./types/mails.js";
import { env } from "./utils/env.js";
import { Logger } from "./utils/logger.js";
import { sendMail } from "./utils/mail.js";

async function main() {
  Logger.debug("App Started In Debug Mode");
  if (env.NODE_ENV === "production") {
    Logger.info("App is In Production Environment");
  }

  const email = {
    replyToEmail: "test@test.com",
    from: "test@test.com",
    to: ["test@test.com"],
    subject: "Test Subject",
    body: "Test Body",
    senderName: "Test Sender",
  } satisfies EmailContentOptions;

  const config = {
    user: "test@test.com",
    encryptedPass: "test",
    port: 465,
    host: "smtp.gmail.com",
  } satisfies SMTPConfig;

  await sendMail({ email, method: MailMethod.SMTP, config });
}
main();
