const lengthOptions = [
  {
    label: "CONCISE",
    prompt:
      "Keep the email content concise and to the point. Focus on the most important information and avoid unnecessary details.",
  },
  {
    label: "ELABORATE",
    prompt:
      "Provide more detailed and elaborate information in the email content. Include additional details and context to make it more informative and engaging.",
  },
  {
    label: "MEDIUM",
    prompt:
      "Medium length email content. This is a good balance between concise and detailed content.",
  },
  {
    label: "ULTRA_CONCISE",
    prompt:
      "Ultra concise email content. Keep the email content brief and to the point. Focus on the most important information and avoid unnecessary details.",
  },
  {
    label: "DEFAULT",
    prompt:
      "Keep the email content concise and to the point. Focus on the most important information and avoid unnecessary details.",
  },
] as const;

export type LengthOption = (typeof lengthOptions)[number]["label"];

export const getLengthPrompt = (length: LengthOption) => {
  const selectedOption = lengthOptions.find(
    (option) => option.label === length
  );

  if (!selectedOption) {
    return lengthOptions.find((option) => option.label === "DEFAULT")
      ?.prompt as string;
  }

  return selectedOption.prompt as string;
};

export const LengthMeaning =
  "Control how detailed or brief the email content should be, from ultra-concise to elaborate explanations";
