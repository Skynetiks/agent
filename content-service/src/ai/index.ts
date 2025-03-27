import { env } from "../utils/env";
import { BaseAI } from "./providers/base";
import { DeepSeek } from "./providers/deepseek";
import { Gemini } from "./providers/gemini";
import { OpenAI } from "./providers/openai";
import { Providers } from "./providers/types";

/**
 * Object mapping provider names to their corresponding AI provider classes.
 * Each provider must extend the BaseAI class.
 *
 * To add a new provider:
 * 1. Create a new class that extends BaseAI
 * 2. Implement all required abstract methods from BaseAI
 * 3. Add the provider name to the Providers type
 * 4. Add the mapping here with the format: providerName: ProviderClass
 *
 * @example
 * ```typescript
 * // Creating a new provider
 * class NewProvider extends BaseAI {
 *   // Implement required methods
 * }
 *
 * // Add to providers
 * const providers = {
 *   existing: ExistingProvider,
 *   new: NewProvider
 * }
 * ```
 *
 * @satisfies Record<Providers, new () => BaseAI> - Ensures all providers extend BaseAI
 * @readonly - Object is treated as a constant with readonly properties
 */
const providers = {
  openai: OpenAI,
  deepseek: DeepSeek,
  gemini: Gemini,
} as const satisfies Record<Providers, new () => BaseAI>;

/**
 * Returns an instance of the AI provider class based on the provider name.
 * @param provider - The name of the AI provider.
 * @returns An instance of the AI provider class.
 * @throws Error if the provider is not supported.
 */
const getAi = (provider: Providers): BaseAI => {
  if (!providers[provider]) {
    throw new Error(
      `Unsupported AI provider: "${provider}". Valid options: ${Object.keys(
        providers
      ).join(", ")}`
    );
  }

  return new providers[provider]();
};

export const ai = getAi(env.AI_PROVIDER);
