import { EmailStatus } from "../types";
import { env } from "../utils/env";
import { Logger } from "../utils/logger";

interface Syntax {
  username: string;
  domain: string;
  valid: boolean;
}

interface Smtp {
  host_exists: boolean;
  full_inbox: boolean;
  catch_all: boolean;
  deliverable: boolean;
  disabled: boolean;
}

interface EmailVerificationResponse {
  email: string;
  reachable: string;
  syntax: Syntax;
  smtp: Smtp;
  gravatar: string | null;
  suggestion: string;
  disposable: boolean;
  role_account: boolean;
  free: boolean;
  has_mx_records: boolean;
  error: string;
}

export async function validatorApi(email: string) {
  try {
    const response = await fetch(
      `${env.VALIDATOR_API_ENDPOINT}/${email}/verification`,
      {
        method: "GET",
        headers: {
          Authorization: `${env.AUTH_TOKEN}`,
        },
      }
    );

    Logger.debug(`Response from validator API: ${response.status}`);

    const data = (await response.json()) as EmailVerificationResponse;

    Logger.debug(`Data from validator API: ${JSON.stringify(data)}`);

    if (response.ok) {
      if (data.reachable === "yes") {
        Logger.info(`Email ${email} is Valid`);
        return EmailStatus.VALID;
      } else if (data.smtp.catch_all) {
        Logger.info(`Email ${email} is Catchall`);
        return EmailStatus.CATCHALL;
      } else {
        Logger.info(`Email ${email} is Invalid`);
        return EmailStatus.INVALID;
      }
    } else {
      Logger.error(`Error verifying email via API: ${data.error}`);
      return EmailStatus.UNKNOWN;
    }
  } catch (error) {
    Logger.error(`Error verifying email via API: ${error}`);
    return EmailStatus.UNKNOWN;
  }
}
