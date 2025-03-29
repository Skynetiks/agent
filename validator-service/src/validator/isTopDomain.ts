import { top100 } from "email-misspelled";
import { EmailStatus } from "../types";
import { Logger } from "../utils/logger";

export const topDomainCheck = (email: string) => {
  Logger.info(`Checking email ${email} for top domain`);
  const inputDomain = email.split("@")[1];
  for (const domain of top100) {
    if (inputDomain === domain) {
      Logger.info(`Email ${email} is in top domain ${domain}`);
      return EmailStatus.VALID;
    }
  }

  Logger.info(`Email ${email} is not in top domain`);
  return EmailStatus.INVALID;
};
