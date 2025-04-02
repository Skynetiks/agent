import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

// Define schema using Zod
export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .describe("On which environment the app is running"),
  DATABASE_URL: z.string().url().min(1).describe("A Postgres database URL"),
  DEBUG: z
    .string()
    .default("false")
    .transform((val) => val === "true")
    .describe(
      "Must be true to enable debug mode. in debug mode, the app will log more information"
    ),
  ENCRYPTION_SECRET: z
    .string()
    .min(1)
    .describe("Same encryption secret used in the server"),
  SES_CONFIG_SET: z.string().optional().describe("Configuration Set for ses."),
  SKIP_MAIL_SEND: z
    .string()
    .default("false")
    .transform((val) => val === "true")
    .describe(
      "If true, app will not send emails. it is used for testing and development. true | false. default: false"
    ),

  SQS_REGION: z.string().describe("SQS Region"),
  MAIL_SENDER_QUEUE_URL: z
    .string()
    .url()
    .min(1)
    .describe("SQS Mail sender Queue URL"),
  AWS_KEY: z.string().min(1).describe("AWS Key"),
  AWS_SECRET: z.string().min(1).describe("AWS Secret"),
  CONCURRENCY: z.coerce.number().default(1).describe("Concurrency"),
});

// Parse and validate environment variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables", parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
