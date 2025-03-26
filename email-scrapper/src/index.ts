import * as cheerio from "cheerio";
import { ScrapeWebPage } from "./scrapper";

const GOOGLE_SEARCH_URL = "https://www.google.com/search?q=";
const MAX_PAGES = 1; // Number of pages to scrape

// Function to fetch Google Search Results
const getGoogleSearchResults = async (
  query: string,
  page: number
): Promise<{ link: string; snippet: string }[]> => {
  const start = page * 10; // Google paginates by increments of 10
  const searchUrl = `${GOOGLE_SEARCH_URL}${encodeURIComponent(
    query
  )}&start=${start}`;

  try {
    const html = await ScrapeWebPage(searchUrl);
    if (!html) throw new Error("No HTML content retrieved");

    const $ = cheerio.load(html);
    const results: { link: string; snippet: string }[] = [];

    $("h3").each((_, el) => {
      const titleElement = $(el);
      const secondDiv = titleElement
        .closest("div")
        .parent()
        .parent()
        .parent()
        .parent()
        .next();

      const linkElement = titleElement?.parent("a"); // Find the nearest anchor tag

      if (linkElement?.attr("href")) {
        results.push({
          link: decodeURIComponent(
            linkElement.attr("href")!.replace("/url?q=", "").split("&")[0]
          ), // Extract clean URL
          snippet: secondDiv?.text().trim() || "",
        });
      }
    });

    return results;
  } catch (error) {
    console.error("❌ Error fetching Google search results:", error);
    return [];
  }
};

// Function to scrape emails directly from Google search results
const scrapeGoogleEmails = async (
  keyword: string,
  site: string,
  domain: string
) => {
  let emailResults: { email: string; source: string }[] = [];

  const query = `${keyword} site:${site} "@${domain}"`;

  for (let page = 0; page < MAX_PAGES; page++) {
    console.log(`🔍 Scraping Google page ${page + 1}...`);

    // Fetch search results
    const searchResults = await getGoogleSearchResults(query, page);

    for (const { link, snippet } of searchResults) {
      // Regex to find emails in the snippet
      const emails =
        snippet.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g) ||
        [];

      // Store emails with their respective source links
      emails.forEach((email) => {
        emailResults.push({ email, source: link });
      });
    }
  }

  console.log("📩 Extracted Emails with Sources:", emailResults);
  return emailResults;
};

// Run the scraper
scrapeGoogleEmails("real estate", "linkedin.com", "gmail.com");
