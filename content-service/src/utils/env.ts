import dotenv from "dotenv";
import { z } from "zod";
import { Providers } from "../ai/providers/types";

dotenv.config();

// Define schema using Zod
export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .describe("On which environment the app is running"),
  DEBUG: z.coerce.boolean().default(false).describe("Enable debug mode"),
  AI_API_KEY: z.string().min(1).describe("API Key according to the provider"),
  AI_BASE_URL: z
    .string()
    .url()
    .min(1)
    .describe(
      "API Base URL according to the provider. only for openai and deepseek"
    ),
  AI_MODEL: z.string().min(1).describe("Model according to the provider"),
  AI_PROVIDER: z.nativeEnum(Providers).describe("What provider to use"),
  SQS_REGION: z.string().min(1).describe("SQS Region"),
  CONTENT_GENERATOR_QUEUE_URL: z
    .string()
    .url()
    .min(1)
    .describe("SQS ai content/email generator Queue URL"),
  AWS_KEY: z.string().min(1).describe("AWS Key"),
  AWS_SECRET: z.string().min(1).describe("AWS Secret"),

  PG_HOST: z.string().default("localhost").describe("Postgres Host"),
  PG_PORT: z.coerce.number().default(5432).describe("Postgres Port"),
  PG_USER: z.string().default("postgres").describe("Postgres User"),
  PG_PASSWORD: z.string().default("password").describe("Postgres Password"),
  PG_DATABASE: z.string().optional().describe("Postgres Database"),
  PG_SSL: z.string().default("false").describe("Postgres SSL"),

  REDIS_HOST: z.string().default("localhost").describe("Redis Host"),
  REDIS_PORT: z.coerce.number().default(6379).describe("Redis Port"),
  REDIS_PASSWORD: z.string().optional().describe("Redis Password"),
  REDIS_DB: z.coerce.number().default(0).describe("Redis Database"),
});

// Parse and validate environment variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables", parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
