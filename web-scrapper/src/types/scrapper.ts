export enum WebPageType {
  LINKEDIN = "linkedin",
  TWITTER = "twitter",
  FACEBOOK = "facebook",
  LINKEDIN_COMPANY = "linkedin-company",
  COMPANY_WEBSITE = "company-website",
}

export type FetchResult = {
  companyName: string;
  companyWebsite: string;
  companyDescription: string;
  linkedinUrl: string;
  otherContext: string;
};

export type SQSOutputType = FetchResult & {
  email: string;
};
