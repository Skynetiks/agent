import * as cheerio from "cheerio";
import { ScrapeWebPage } from "./scrapper";

const GOOGLE_SEARCH_URL = "https://www.google.com/search?q=";
const MAX_PAGES = 1; // Number of pages to scrape

// Function to fetch Google Search Results
const getGoogleSearchResults = async (query: string, page: number): Promise<{ link: string; snippet: string }[]> => {
    const start = page * 10; // Google paginates by increments of 10
    const searchUrl = `${GOOGLE_SEARCH_URL}${encodeURIComponent(query)}&start=${start}`;

    try {
        const html = await ScrapeWebPage(searchUrl);
        if (!html) throw new Error("No HTML content retrieved");

        const $ = cheerio.load(html);
        const results: { link: string; snippet: string }[] = [];

        $("div.tF2Cxc").each((_, element) => {
            const rawLink = $(element).find("a").attr("href");
            const snippet = $(element).find(".VwiC3b").text().trim(); // Extract snippet text

            if (rawLink) {
                results.push({ link: decodeURIComponent(rawLink), snippet });
            }
        });

        return results;
    } catch (error) {
        console.error("❌ Error fetching Google search results:", error);
        return [];
    }
};

// Function to scrape emails directly from Google search results
const scrapeGoogleEmails = async (query: string) => {
    let emailResults: { email: string; source: string }[] = [];

    for (let page = 0; page < MAX_PAGES; page++) {
        console.log(`🔍 Scraping Google page ${page + 1}...`);
        
        // Fetch search results
        const searchResults = await getGoogleSearchResults(query, page);

        for (const { link, snippet } of searchResults) {
            // Regex to find emails in the snippet
            const emails = snippet.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g) || [];

            // Store emails with their respective source links
            emails.forEach(email => {
                emailResults.push({ email, source: link });
            });
        }
    }

    console.log("📩 Extracted Emails with Sources:", emailResults);
    return emailResults;
};

// Run the scraper
scrapeGoogleEmails('real estate site:linkedin.com/in "@gmail.com"');
