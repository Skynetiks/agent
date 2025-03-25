import dotenv from "dotenv";
dotenv.config();

const {BRIGHTDATA_API_KEY} = process.env
if(!BRIGHTDATA_API_KEY){
	throw new Error("BRIGHTDATA_API_KEY is not defined in the environment variables");
}

export const ScrapeWebPage = async (searchUrl: string): Promise<string | undefined> => {
	try {
		const response = await fetch("https://api.brightdata.com/request", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${BRIGHTDATA_API_KEY}`,
			},
			body: JSON.stringify({
				zone: "prospect",
				url: searchUrl,
				format: "raw",
			}),
		});

		if (!response.ok) {
			console.error("Error fetching page", response.status, response.statusText);
			return undefined;
		}

		const text = await response.text();
		return text;
	} catch (error) {
		console.error("Error in bright data api request", error);
		return undefined;
	}
};
