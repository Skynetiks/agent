import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

// Define schema using Zod
export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .describe("On which environment the app is running"),
  DEBUG: z.coerce.boolean().default(false).describe("Enable debug mode"),
  VALIDATOR_API_ENDPOINT: z
    .string()
    .url()
    .describe(
      "URL of the validator API endpoint without trailing slash exp: https://api.validator.com/v1"
    ),
  AUTH_TOKEN: z.string().describe("Auth token for the validator API"),
  LEAD_VERIFICATION_QUEUE_URL: z
    .string()
    .url()
    .min(1)
    .describe("SQS Queue URL"),
  WEB_SCRAPPER_QUEUE_URL: z.string().url().min(1).describe("SQS Queue URL"),
  SQS_REGION: z.string().min(1).describe("SQS Region"),
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
