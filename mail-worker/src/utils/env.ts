import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

// Define schema using Zod
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  DATABASE_URL: z.string().url(),
  DEBUG: z
    .string()
    .default("false")
    .transform((val) => val === "true"),
  ENCRYPTION_SECRET: z.string(),
  SES_CONFIG_SET: z.string().optional(),
  SKIP_MAIL_SEND: z
    .string()
    .default("false")
    .transform((val) => val === "true"),
});

// Parse and validate environment variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables", parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
