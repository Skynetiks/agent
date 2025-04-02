import { CtaOption } from "../prompts/options/cta";
import { LengthOption } from "../prompts/options/length";
import { PersonalizationLevelOption } from "../prompts/options/personalizedLevel";
import { StrategyOption } from "../prompts/options/statergy";
import { ToneOption } from "../prompts/options/tone";

export type FetchResult = {
  companyName: string;
  companyWebsite: string;
  companyDescription: string;
  linkedinUrl: string;
  otherContext: string;
};

export type SQSInputType = FetchResult & {
  email: string;
  agentId: string;
};

export type GetEmailContentPromptProps = {
  senderCompanyInfo: CompanyInfo<"sender">;
  objective: string;
  receiverCompanyInfo: CompanyInfo<"receiver">;
  personalizationLevel: PersonalizationLevelOption;
  length: LengthOption;
  strategy: StrategyOption;
  cta?: CTAType;
  tone: ToneOption;
};

export type CTAType = {
  label: CtaOption;
  requirements: Record<string, string>;
};

export type CompanyInfo<T extends "sender" | "receiver"> = {
  companyName: string;
  industry: string;
  websiteData: T extends "receiver" ? string : undefined;
  contact: {
    email: string;
    name?: string;
  };
  valueProposition: T extends "sender" ? string : undefined;
};
