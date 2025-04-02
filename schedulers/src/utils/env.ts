import dotenv from "dotenv";
import { z } from "zod";
import { SQSRegion } from "../types";

dotenv.config();

// Define schema using Zod
export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .describe("On which environment the app is running"),
  DEBUG: z
    .string()
    .default("false")
    .transform((val) => val === "true")
    .describe(
      "Must be true to enable debug mode. in debug mode, the app will log more information"
    ),
  SQS_REGION: z.nativeEnum(SQSRegion).describe("SQS Region"),
  LEAD_GENERATOR_QUEUE_URL: z.string().url().min(1).describe("SQS Queue URL"),
  MAIL_SENDER_QUEUE_URL: z.string().url().min(1).describe("SQS Queue URL"),
  AWS_KEY: z.string().min(1).describe("AWS Key"),
  AWS_SECRET: z.string().min(1).describe("AWS Secret"),
  AGENT_SCHEDULER_CRON: z
    .string()
    .default("*/5 * * * *")
    .describe("Cron expression for agent scheduler"),

  PG_HOST: z.string().default("localhost").describe("Postgres Host"),
  PG_PORT: z.coerce.number().default(5432).describe("Postgres Port"),
  PG_USER: z.string().default("postgres").describe("Postgres User"),
  PG_PASSWORD: z.string().default("password").describe("Postgres Password"),
  PG_DATABASE: z.string().optional().describe("Postgres Database"),
  PG_SSL: z.string().default("false").describe("Postgres SSL"),
});

// Parse and validate environment variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables", parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
