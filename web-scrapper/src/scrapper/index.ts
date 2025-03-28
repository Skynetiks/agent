import { detectWebPageType } from "./detect";
import { WebPageType } from "../types/scrapper";
import { scrapeLinkedInCompany, scrapeLinkedInPerson } from "./linkedin";

export const ScrapeCompanyDetails = async (url: string) => {
  const webPageType = await detectWebPageType(url);

  if (!webPageType || webPageType === null) {
    console.log("No web page type detected");
    return null;
  }

  // TODO: Implement other web page types
  switch (webPageType as unknown as WebPageType) {
    case WebPageType.LINKEDIN:
      return scrapeLinkedInPerson(url);

    case WebPageType.LINKEDIN_COMPANY:
      return scrapeLinkedInCompany(url);

    case WebPageType.TWITTER:
      console.log("Twitter Not Supported Yet");
      break;

    case WebPageType.FACEBOOK:
      console.log("Facebook Not Supported Yet");
      break;

    case WebPageType.COMPANY_WEBSITE:
      console.log("COMPANY WEBSITE NOT SUPPORTED YET");
      break;

    default:
      console.log("Unknown type");
      break;
  }
};
