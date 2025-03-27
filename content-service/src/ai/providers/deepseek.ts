import OpenAISdk, { OpenAIError } from "openai";
import { env } from "../../utils/env";
import { BaseAI } from "./base";
import { AskAiChatProps, AskAiProps } from "./types";

export class DeepSeek extends BaseAI {
  private ai: OpenAISdk;
  private readonly model: string;

  constructor() {
    super();
    this.validateKeys();

    this.model = env.AI_MODEL;
    this.ai = new OpenAISdk({
      apiKey: env.AI_API_KEY,
      baseURL: env.AI_BASE_URL,
    });
  }

  validateKeys(): void {
    if (!env.AI_API_KEY) {
      throw new Error("AI_API_KEY is required for OpenAI.");
    }
    if (!env.AI_BASE_URL) {
      throw new Error("AI_BASE_URL is required for OpenAI.");
    }
    if (!env.AI_MODEL) {
      throw new Error("AI_MODEL is required for OpenAI.");
    }
  }

  async askAi({
    prompt,
    max_tokens,
    temperature,
  }: AskAiProps): Promise<string> {
    try {
      const { choices } = await this.ai.completions.create({
        model: this.model,
        prompt,
        max_tokens,
        temperature,
      });

      return choices?.[0]?.text?.trim() || "";
    } catch (error) {
      console.error("Error in OpenAI.askAi:", error);
      if (error instanceof OpenAIError) {
        throw error;
      }

      throw new Error("Failed to fetch response from OpenAI.");
    }
  }

  async chat({
    messages,
    max_tokens,
    temperature,
  }: AskAiChatProps): Promise<string> {
    try {
      const { choices } = await this.ai.chat.completions.create({
        model: this.model,
        messages,
        max_tokens,
        temperature,
      });

      return choices?.[0]?.message?.content?.trim() || "";
    } catch (error) {
      console.error("Error in OpenAI.chat:", error);
      if (error instanceof OpenAIError) {
        throw error;
      }

      throw new Error("Failed to fetch chat response from OpenAI.");
    }
  }
}
