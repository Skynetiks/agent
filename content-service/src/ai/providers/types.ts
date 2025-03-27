export enum Providers {
  OPENAI = "openai",
  DEEPSEEK = "deepseek",
  GEMINI = "gemini",
}

export type AskAiProps = {
  temperature?: number;
  prompt: string;
  max_tokens?: number;
};

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AskAiChatProps = {
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
};
