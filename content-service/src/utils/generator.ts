import { ai } from "../ai";
import {
  getEmailContentPrompt,
  getEmailSubjectPrompt,
} from "../prompts/email-content";
import { GetEmailContentPromptProps } from "../types";

export const generateMailContent = async (
  props: GetEmailContentPromptProps
) => {
  const {
    senderCompanyInfo,
    length,
    personalizationLevel,
    strategy,
    objective,
    receiverCompanyInfo,
    tone,
    cta,
  } = props;
  const emailContentPrompt = getEmailContentPrompt({
    senderCompanyInfo: {
      companyName: senderCompanyInfo.companyName,
      industry: senderCompanyInfo.industry,
      websiteData: undefined,
      contact: {
        email: senderCompanyInfo.contact.email,
        name: senderCompanyInfo.contact.name,
      },
      valueProposition: senderCompanyInfo.valueProposition,
    },
    length: length || "MEDIUM",
    personalizationLevel: personalizationLevel || "MEDIUM",
    strategy: strategy || "INFORMATIONAL",
    tone: tone || "FORMAL",
    cta: cta,
    objective: objective,
    receiverCompanyInfo: receiverCompanyInfo,
  });

  const body = await ai.chat({
    messages: [
      {
        role: "system",
        content:
          "You are an expert email marketing assistant specializing in crafting personalized, conversion-focused email templates.",
      },
      {
        role: "user",
        content: emailContentPrompt,
      },
    ],
    temperature: 0.5,
  });

  const subjectPrompt = getEmailSubjectPrompt({
    subjectTone: "CURIOSITY_DRIVEN",
    body: body || "",
    objective: "Increase sales and revenue for our skyfunnel",
  });

  const subjectCompletion = await ai.chat({
    messages: [
      {
        role: "system",
        content:
          "You are an expert email marketing assistant specializing in crafting personalized and engaging subject lines. Your task is to generate a compelling subject line based on the provided email content.",
      },
      {
        role: "user",
        content: subjectPrompt,
      },
    ],
  });

  return { body, subject: subjectCompletion };
};
