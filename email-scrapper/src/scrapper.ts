import dotenv from "dotenv";
import { env } from "./utils/env";
dotenv.config();

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
    return text;
  } catch (error) {
    console.error("Error in bright data api request", error);
    return undefined;
  }
};
