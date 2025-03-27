import { env } from "../../utils/env";
import { BaseAI } from "./base";
import { AskAiChatProps, AskAiProps } from "./types";
import { Content, GoogleGenAI } from "@google/genai";

export class Gemini extends BaseAI {
  private readonly model: string;
  private ai: GoogleGenAI;

  constructor() {
    super();
    this.validateKeys();
    this.ai = new GoogleGenAI({ apiKey: env.AI_API_KEY });
    this.model = env.AI_MODEL;
  }

  validateKeys(): void {
    if (!env.AI_API_KEY) {
      throw new Error("AI_API_KEY is required for Gemini.");
    }

    if (!env.AI_MODEL) {
      throw new Error("AI_MODEL is required for Gemini.");
    }
  }

  async askAi(options: AskAiProps): Promise<string | undefined> {
    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: options.prompt,
      config: {
        temperature: options.temperature,
        maxOutputTokens: options.max_tokens,
      },
    });

    return response.text;
  }
  async chat(options: AskAiChatProps): Promise<string | undefined> {
    let systemInstructions = "";
    let geminiMessages: Content[] = [];

    const messages = [...options.messages];
    const userMsg = messages.pop();
    const history = messages;
    if (userMsg?.role !== "user") {
      throw new Error("last message must be a user message");
    }

    history.forEach((message) => {
      if (message.role === "system") {
        systemInstructions = message.content;
      }

      if (message.role === "user") {
        geminiMessages.push({
          role: "user",
          parts: [{ text: message.content }],
        });
      }

      if (message.role === "assistant") {
        geminiMessages.push({
          role: "model",
          parts: [{ text: message.content }],
        });
      }
    });

    const chat = await this.ai.chats.create({
      model: this.model,
      history: geminiMessages,
      config: {
        systemInstruction: systemInstructions,
        temperature: options.temperature,
        maxOutputTokens: options.max_tokens,
      },
    });

    const response = await chat.sendMessage({
      message: userMsg.content,
    });

    return response.text;
  }
}
