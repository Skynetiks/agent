import OpenAI from "openai";
import { env } from "./env";

const ai = new OpenAI({
  baseURL: env.DEEPSEEK_BASE_URL,
  apiKey: env.DEEPSEEK_API_KEY,
});

export default ai;
