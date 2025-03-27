export const personalizationLevelOptions = [
  {
    label: "HIGH",
    prompt:
      "Deeply personalize the email by addressing the target company's specific needs, challenges, and interests. Use details from their website or recent activities to make the content highly relevant and compelling.",
  },
  {
    label: "MEDIUM",
    prompt:
      "Moderately personalize the email by referencing the target company's industry, services, or general needs. Keep the content relevant and engaging without being overly specific.",
  },
  {
    label: "LOW",
    prompt:
      "Lightly personalize the email with a general reference to the target company's industry or sector. Keep the content broad and adaptable for multiple recipients.",
  },
];

export type PersonalizationLevelOption =
  (typeof personalizationLevelOptions)[number]["label"];

export const getPersonalizationLevelPrompt = (
  personalizationLevel: PersonalizationLevelOption
) => {
  const selectedOption = personalizationLevelOptions.find(
    (option) => option.label === personalizationLevel
  );

  if (!selectedOption) {
    return personalizationLevelOptions.find(
      (option) => option.label === "MEDIUM"
    )?.prompt as string;
  }

  return selectedOption.prompt as string;
};

export const PersonalizationLevelMeaning =
  "Control how personalized the email content should be, from highly personalized to lightly personalized";
