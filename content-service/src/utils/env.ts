import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

// Define schema using Zod
export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .describe("On which environment the app is running"),
  DEEPSEEK_API_KEY: z.string().min(1).describe("Deepseek API Key"),
  DEEPSEEK_BASE_URL: z.string().url().min(1).describe("Deepseek API Base URL"),
  DEEPSEEK_MODEL: z
    .string()
    .min(1)
    .describe("Deepseek Model use: 'deepseek-chat'"),
});

// Parse and validate environment variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables", parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
