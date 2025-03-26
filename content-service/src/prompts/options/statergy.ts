export const strategyOptions = [
  {
    label: "AGGRESSIVE_SELLING",
    prompt:
      "Use a direct, persuasive, and action-driven tone. Emphasize urgency, strong CTAs, and compelling offers to drive immediate conversions.",
  },
  {
    label: "INFORMATIONAL",
    prompt:
      "Adopt a value-driven and insightful tone. Share relevant information, industry trends, or benefits without being too sales-oriented.",
  },
  {
    label: "DEMO_BOOKING",
    prompt:
      "Focus on scheduling a call or demo. Use clear CTAs, highlight key benefits, and create a sense of curiosity or FOMO (fear of missing out).",
  },
  {
    label: "STORYTELLING",
    prompt:
      "Craft a narrative-driven email with a relatable story or scenario. Engage the reader emotionally while subtly introducing your solution.",
  },
  {
    label: "PROBLEM_SOLUTION",
    prompt:
      "Clearly outline a pain point the recipient might face and offer your product or service as the ideal solution. Use a benefit-driven tone.",
  },
  {
    label: "SOCIAL_PROOF",
    prompt:
      "Leverage testimonials, case studies, or client success stories to build trust and credibility. Use real metrics or quotes where possible.",
  },
  {
    label: "EDUCATIONAL",
    prompt:
      "Share practical tips, insights, or industry knowledge. Provide value by teaching something useful and positioning yourself as an expert.",
  },
  {
    label: "COLLABORATIVE",
    prompt:
      "Use a partnership-driven tone. Emphasize collaboration, mutual benefits, and long-term value to foster business relationships.",
  },
  {
    label: "INQUISITIVE",
    prompt:
      "Ask thought-provoking questions or use curiosity-driven statements. Spark interest and encourage the recipient to engage or respond.",
  },
] as const;

export type StrategyOption = (typeof strategyOptions)[number]["label"];

export const getStrategyPrompt = (strategy: StrategyOption) => {
  const selectedOption = strategyOptions.find(
    (option) => option.label === strategy
  );

  if (!selectedOption) {
    return strategyOptions.find(
      (option) => option.label === "AGGRESSIVE_SELLING"
    )?.prompt as string;
  }

  return selectedOption.prompt as string;
};

export const StrategyMeaning =
  "Defines the tone and structure of the email content, ranging from narrative-driven storytelling to direct problem-solving or value-focused approaches.";
