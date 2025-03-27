import { AskAiChatProps, AskAiProps } from "./types";

/**
 * Abstract base class for AI service providers.
 * Defines common interface for AI interactions.
 */
export abstract class BaseAI {
  /**
   * Validates the API keys and credentials required for the AI service.
   * Should throw an error if validation fails.
   */
  abstract validateKeys(): void;

  /**
   * Makes a single query to the AI service.
   * @param options - Configuration options for the AI query
   * @returns Promise that resolves to the AI response string, or undefined if no response
   */
  abstract askAi(options: AskAiProps): Promise<string | undefined>;

  /**
   * Initiates a chat-style interaction with the AI service.
   * @param options - Configuration options for the chat interaction
   * @returns Promise that resolves to the AI response string, or undefined if no response
   */
  abstract chat(options: AskAiChatProps): Promise<string | undefined>;
}
