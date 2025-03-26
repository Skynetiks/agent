export type SubjectLineStyle =
  | "STRAIGHTFORWARD"
  | "CURIOSITY_DRIVEN"
  | "QUESTION_BASED"
  | "BENEFIT_FOCUSED"
  | "URGENCY_BASED"
  | "INTRIGUING"
  | "EXCLUSIVE"
  | "PERSONALIZED"
  | "STATISTIC_BASED"
  | "TEASER";

// Function to get subject line style prompt
export const getSubjectLineStylePrompt = (style: SubjectLineStyle): string => {
  switch (style) {
    case "STRAIGHTFORWARD":
      return "Use a simple and clear subject line that directly states the purpose of the email.";
    case "CURIOSITY_DRIVEN":
      return "Make the subject line intriguing and thought-provoking to entice the recipient to open the email.";
    case "QUESTION_BASED":
      return "Frame the subject line as a direct question to engage the recipient.";
    case "BENEFIT_FOCUSED":
      return "Highlight the benefit or value the recipient will gain from opening the email.";
    case "URGENCY_BASED":
      return "Create a sense of urgency to drive immediate action.";
    case "INTRIGUING":
      return "Use a mysterious or suspenseful subject line to spark interest.";
    case "EXCLUSIVE":
      return "Use words that make the recipient feel they have access to something special or limited.";
    case "PERSONALIZED":
      return "Include the recipient's name, company, or other relevant details to make the subject line feel tailored.";
    case "STATISTIC_BASED":
      return "Include a compelling statistic or data point to draw attention.";
    case "TEASER":
      return "Give a sneak peek or hint at the content inside the email, sparking curiosity.";
    default:
      return "Use a clear, concise, and relevant subject line.";
  }
};
