export const ctaOptions = {
  BOOK_MEETING: {
    label: "BOOK_MEETING",
    prompt:
      "Encourage the recipient to schedule a call or demo. Use clear, action-oriented language.",
    requirements: [
      {
        key: "meetingLink",
        description:
          "URL for booking the meeting (e.g., Calendly or Zoom link)",
      },
      {
        key: "availability",
        description: "Optional time slots or preferred meeting times",
      },
    ],
  },
  REPLY_FOR_MORE_INFO: {
    label: "REPLY_FOR_MORE_INFO",
    prompt:
      "Ask the recipient to respond with questions or request additional information. Use a conversational tone.",
    requirements: [],
  },
  SIGN_UP_NOW: {
    label: "SIGN_UP_NOW",
    prompt:
      "Push the recipient toward immediate action with a direct, persuasive CTA. Use urgency or exclusivity.",
    requirements: [
      { key: "signupLink", description: "URL for the signup page" },
      {
        key: "offerDetails",
        description: "Optional offer details (e.g., discount, free trial)",
      },
    ],
  },
  DOWNLOAD_RESOURCE: {
    label: "DOWNLOAD_RESOURCE",
    prompt:
      "Offer a lead magnet such as a PDF, eBook, or case study. Emphasize the value of the resource.",
    requirements: [
      { key: "resourceLink", description: "URL for downloading the resource" },
      {
        key: "resourceName",
        description: "Name of the resource (e.g., 'AI Marketing Guide')",
      },
    ],
  },
  VISIT_WEBSITE: {
    label: "VISIT_WEBSITE",
    prompt:
      "Direct the recipient to a landing page or your website. Use a benefit-driven CTA.",
    requirements: [
      { key: "websiteLink", description: "URL of the website or landing page" },
      {
        key: "pagePurpose",
        description: "Purpose of the page (e.g., pricing, product info)",
      },
    ],
  },
  LEARN_MORE: {
    label: "LEARN_MORE",
    prompt:
      "Encourage the recipient to explore more details. Use curiosity-driven language.",
    requirements: [
      {
        key: "learnMoreLink",
        description: "URL to the page with detailed information",
      },
      {
        key: "topic",
        description: "Specify the topic or subject of the additional info",
      },
    ],
  },
} as const;

export type CtaOption = keyof typeof ctaOptions;

export const getCtaPrompt = (cta: CtaOption) => {
  const selectedOption = ctaOptions[cta];

  if (!selectedOption) {
    return ctaOptions["REPLY_FOR_MORE_INFO"].prompt as string;
  }

  return selectedOption.prompt as string;
};

export type GetRequirement<T extends keyof typeof ctaOptions> = {
  [K in (typeof ctaOptions)[T]["requirements"][number]["key"]]: string;
};
