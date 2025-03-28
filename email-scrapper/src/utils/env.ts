import dotenv from "dotenv";
import { z } from "zod";
import { SQSRegion } from "../types";

dotenv.config();

// Define schema using Zod
export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .describe("On which environment the app is running"),
  BRIGHTDATA_API_KEY: z.string().min(1).describe("A Brightdata API key"),
  MAX_PAGES_TO_SCRAPE: z.coerce
    .number()
    .min(1)
    .describe("Maximum number of pages to scrape from google"),

  SQS_REGION: z.nativeEnum(SQSRegion).describe("SQS Region"),
  LEAD_GENERATOR_QUEUE_URL: z.string().url().min(1).describe("SQS Queue URL"),
  AWS_KEY: z.string().min(1).describe("AWS Key"),
  AWS_SECRET: z.string().min(1).describe("AWS Secret"),
  CONCURRENCY_LIMIT: z.coerce
    .number()
    .min(1)
    .describe("Concurrency limit for SQS consumer"),
});

// Parse and validate environment variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables", parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
