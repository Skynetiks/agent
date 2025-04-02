import fs from "fs/promises";
import { ScrapeWebPage } from "../utils/scrapper";
import * as cheerio from "cheerio";
import {
  DiscussionFormPosting,
  JSONLDData,
  JSONLdPerson,
} from "../types/jsonld";
import { FetchResult } from "../types/scrapper";
import { Logger } from "../utils/logger";

// ============================ Linkedin For Person ===============================================
export const scrapeLinkedInPerson = async (url: string) => {
  const html = await ScrapeWebPage(url);
  if (!html) return;

  Logger.debug("Scraping Linkedin Person");

  const $ = cheerio.load(html);
  const jsonDataText = $('script[type="application/ld+json"]').html();
  if (!jsonDataText) return;

  const jsonData = JSON.parse(jsonDataText) as JSONLdPerson;
  const companyLinkedin =
    jsonData["@graph"]
      ?.find((item) => item["@type"] === "Person")
      ?.worksFor?.find((org) => org["@type"] === "Organization")?.url ?? null;

  Logger.debug("Linkedin Person Scraped");
  if (!companyLinkedin) {
    Logger.info(`Person ${url} works for no organization early returning....`);
    return;
  }
  return scrapeLinkedInCompany(companyLinkedin);
};

// ================================== Linkedin Company =============================================
export const scrapeLinkedInCompany = async (url: string) => {
  Logger.debug("Scraping Linkedin Company");
  const html = await ScrapeWebPage(url);
  if (!html) return;
  // Assuming you have the HTML content in a variable called `html`
  const $ = cheerio.load(html);

  const result: FetchResult = {
    companyDescription: "",
    companyName: "",
    companyWebsite: "",
    linkedinUrl: "",
    otherContext: "",
  };

  // Extract the JSON-LD data from the <script> tag
  const jsonData = $('script[type="application/ld+json"]').html();

  if (jsonData) {
    const posts: DiscussionFormPosting[] = [];
    const parsedData = JSON.parse(jsonData) as JSONLDData;
    parsedData["@graph"].forEach((element) => {
      if (element["@type"] === "Organization") {
        result.companyName = element.name;
        result.companyWebsite = element.sameAs;
        result.companyDescription = element.description;
        result.linkedinUrl = element.url;
      } else if (element["@type"] === "DiscussionForumPosting") {
        posts.push(element);
      }
    });

    result.otherContext = BuildPostData(posts);
    console.log(result);

    Logger.info(`Linkedin Company Scraped, ${url} `);
    return result;
  }
  return undefined;
};

export const BuildPostData = (posts: DiscussionFormPosting[]) => {
  return `<posts information="these are some post created by the organization">
    ${posts
      .slice(0, 2)
      .map(
        (post) =>
          `<post url="${post.url}" createdOn="${post.datePublished}">${post.text}</post>`
      )
      .join("\n")}
</posts>
    `;
};
