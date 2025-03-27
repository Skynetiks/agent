import dotenv from "dotenv";
import { z } from "zod";
import { Providers } from "../ai/providers/types";

dotenv.config();

// Define schema using Zod
export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .describe("On which environment the app is running"),
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
});

// Parse and validate environment variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables", parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
