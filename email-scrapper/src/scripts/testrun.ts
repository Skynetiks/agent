import { scrapeGoogleEmails } from "../utils/extractor";

async function main() {
  const data = await scrapeGoogleEmails(
    "email marketing",
    "linkedin.com/in",
    "gmail.com"
  );

  console.log("======================= Result ========================");
  console.log(`Fetched Count: ${data.length}`);
  console.table(data);
  console.log("=====================================================");
}

main();
