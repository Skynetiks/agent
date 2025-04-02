import { EmailStatus } from "../types";
import { topDomainCheck } from "../validator/isTopDomain";
import { misspelledCheck } from "../validator/misspelled";
import { validatorApi } from "../validator/validator-api";

export async function validateEmail(email: string) {
  const trimEmail = email.trim();
  const misspelledResult = await misspelledCheck(trimEmail);

  if (misspelledResult === EmailStatus.INVALID) {
    return misspelledResult;
  }

  const isInTopDomain = await topDomainCheck(trimEmail);
  if (isInTopDomain === EmailStatus.INVALID) {
    return isInTopDomain;
  }

  const apiResult = await validatorApi(trimEmail);
  return apiResult;
}
