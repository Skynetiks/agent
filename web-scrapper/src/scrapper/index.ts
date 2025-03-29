import { detectWebPageType } from "./detect";
import { WebPageType } from "../types/scrapper";
import { scrapeLinkedInCompany, scrapeLinkedInPerson } from "./linkedin";
import { Logger } from "../utils/logger";

export const ScrapeCompanyDetails = async (url: string) => {
  const webPageType = await detectWebPageType(url);

  Logger.debug(`Web page type detected: ${webPageType}`);
  if (!webPageType || webPageType === null) {
    Logger.error(`Failed to detect web page type for ${url}`);
    return null;
  }

  Logger.info(`${url} detected as ${webPageType}`);
  // TODO: Implement other web page types
  switch (webPageType) {
    case "LINKEDIN":
      return scrapeLinkedInPerson(url);

    case "LINKEDIN_COMPANY":
      return scrapeLinkedInCompany(url);

    case "TWITTER":
      console.log("Twitter Not Supported Yet");
      return null;

    case "FACEBOOK":
      console.log("Facebook Not Supported Yet");
      return null;

    case "COMPANY_WEBSITE":
      console.log("COMPANY WEBSITE NOT SUPPORTED YET");
      return null;

    default:
      console.log("Unknown type");
      return null;
  }
};
