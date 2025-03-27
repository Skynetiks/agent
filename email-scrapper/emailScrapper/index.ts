import * as cheerio from "cheerio";
import { ScrapeWebPage } from "./scrapper";

const GOOGLE_SEARCH_URL = "https://www.google.com/search?q=";
const MAX_PAGES = 100; // Maximum number of pages to scrape

// Function to fetch Google Search Results
const getGoogleSearchResults = async (query: string, page: number): Promise<{ 
    results: { link: string; snippet: string }[],
    hasNextPage: boolean 
}> => {
    const start = page * 10; // Google paginates by increments of 10
    const searchUrl = `${GOOGLE_SEARCH_URL}${encodeURIComponent(query)}&start=${start}`;

    try {
        const html = await ScrapeWebPage(searchUrl);
        if (!html) throw new Error("No HTML content retrieved");

        const $ = cheerio.load(html);
        const results: { link: string; snippet: string }[] = [];

        // Check for next page link
        const hasNextPage = $('a#pnnext').length > 0;

        $("h3").each((_, el) => {
            const titleElement = $(el);
            const secondDiv = titleElement.closest('div').parent().parent().parent().parent().next();
    
            const linkElement = titleElement?.parent("a"); // Find the nearest anchor tag
    
            if (linkElement?.attr("href")) {
                results.push({
                    link: decodeURIComponent(linkElement.attr("href")!.replace("/url?q=", "").split("&")[0]), // Extract clean URL
                    snippet: secondDiv?.text().trim() || "",
                });
            }
        });

        return { results, hasNextPage };
    } catch (error) {
        console.error("❌ Error fetching Google search results:", error);
        return { results: [], hasNextPage: false };
    }
};

// Function to scrape emails directly from Google search results
const scrapeGoogleEmails = async (query: string) => {
    let emailResults: { email: string; source: string }[] = [];
    let currentPage = 30;
    let hasNextPage = true;

    while (hasNextPage && currentPage < MAX_PAGES) {
        console.log(`🔍 Scraping Google page ${currentPage + 1}...`);
        
        // Fetch search results
        const { results: searchResults, hasNextPage: nextPageExists } = await getGoogleSearchResults(query, currentPage);

        for (const { link, snippet } of searchResults) {
            // Regex to find emails in the snippet
            const emails = snippet.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g) || [];

            // Store emails with their respective source links
            emails.forEach(email => {
                emailResults.push({ email, source: link });
            });
        }

        // Update pagination variables
        hasNextPage = nextPageExists;
        currentPage++;
    }

    console.log("📩 Extracted Emails with Sources:", emailResults);
    return emailResults;
};

// Run the scraper
scrapeGoogleEmails('real estate site:linkedin.com/in "@gmail.com"');

export { scrapeGoogleEmails, getGoogleSearchResults };