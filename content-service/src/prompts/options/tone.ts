export type ToneOption =
  | "PROFESSIONAL"
  | "FRIENDLY"
  | "CONFIDENT"
  | "ENTHUSIASTIC"
  | "INFORMATIVE"
  | "CASUAL"
  | "FORMAL"
  | "INSPIRATIONAL"
  | "WITTY"
  | "EMPATHETIC";

// Function to generate tone prompt
export const getTonePrompt = (tone: ToneOption): string => {
  switch (tone) {
    case "PROFESSIONAL":
      return "Maintain a clear, concise, and respectful tone suitable for business communication.";
    case "FRIENDLY":
      return "Use a warm, conversational, and approachable tone to build rapport.";
    case "CONFIDENT":
      return "Convey assurance and credibility, emphasizing trustworthiness.";
    case "ENTHUSIASTIC":
      return "Use an energetic, passionate, and positive tone to express excitement.";
    case "INFORMATIVE":
      return "Provide clear, factual, and educational information in a straightforward manner.";
    case "CASUAL":
      return "Make the tone of the email content casual and human like";
    case "FORMAL":
      return "Use a traditional, polite, and highly professional tone.";
    case "INSPIRATIONAL":
      return "Use a motivational and uplifting tone to inspire the reader.";
    case "WITTY":
      return "Include clever and humorous language to make the content memorable.";
    case "EMPATHETIC":
      return "Show compassion and understanding of the reader's challenges.";
    default:
      return "Maintain a clear, concise, and professional tone.";
  }
};
