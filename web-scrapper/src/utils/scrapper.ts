import { env } from "./env";
import { Logger } from "./logger";

export const ScrapeWebPage = async (
  searchUrl: string
): Promise<string | undefined> => {
  try {
    const response = await fetch("https://api.brightdata.com/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.BRIGHTDATA_API_KEY}`,
      },
      body: JSON.stringify({
        zone: "prospect",
        url: searchUrl,
        format: "raw",
      }),
    });

    if (!response.ok) {
      console.error(
        "Error fetching page",
        response.status,
        response.statusText
      );
      return undefined;
    }

    const text = await response.text();
    Logger.debug(`Success in bright data api request`);
    return text;
  } catch (error) {
    Logger.error(`Error in bright data api request ${error}`);
    return undefined;
  }
};
