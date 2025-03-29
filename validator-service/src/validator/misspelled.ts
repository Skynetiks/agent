import emailMisspelled, { top100 } from "email-misspelled";
import { Logger } from "../utils/logger";
import { EmailStatus } from "../types";

export async function misspelledCheck(email: string) {
  Logger.info(`Checking email ${email} for misspelled words`);
  const emailChecker = emailMisspelled({ maxMisspelled: 1, domains: top100 });
  const result = emailChecker(email);
  if (result.length > 0) {
    Logger.info(`Email ${email} is misspelled: ${JSON.stringify(result[0])}`);
    return EmailStatus.INVALID;
  } else {
    Logger.info(`Email ${email} passed the misspelled check`);
    return EmailStatus.VALID;
  }
}
