export type JSONLDData = {
  "@context": string;
  "@graph": (JSONLdOrganization | DiscussionFormPosting)[];
};

export type DiscussionFormPosting = {
  "@context": string;
  "@type": "DiscussionForumPosting";
  author: {
    "@type": "Organization";
    name: string;
    url: string;
  };
  datePublished: string;
  text: string;
  url: string;
};

type JSONLdOrganization = {
  "@context": string;
  "@type": "Organization";
  name: string;
  url: string;
  address: {
    "@type": "PostalAddress";
    addressCountry: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    streetAddress: string;
  };
  description: string;
  numberOfEmployees: { value: number; "@type": string };
  slogan: string;
  sameAs: string;
};

// Address type
export interface PostalAddress {
  "@type": "PostalAddress";
  addressCountry: string;
  addressLocality: string;
}

// Organization role type
export interface OrganizationRole {
  "@type": "OrganizationRole";
  startDate?: string;
  endDate?: string;
  description?: string;
}

// Organization type
export interface Organization {
  "@type": "Organization";
  name: string;
  url: string;
  location?: string;
  member?: OrganizationRole;
}

// Educational organization type
export interface EducationalOrganization {
  "@type": "EducationalOrganization";
  name: string;
  url: string;
  member?: OrganizationRole;
}

// Image type
export interface ImageObject {
  "@type": "ImageObject";
  contentUrl: string;
}

// Language type
export interface Language {
  "@type": "Language";
  name: string;
}

// Interaction statistics
export interface InteractionCounter {
  "@type": "InteractionCounter";
  interactionType: string;
  name: string;
  userInteractionCount: number;
}

// Person type
export interface Person {
  "@context"?: string;
  "@type": "Person";
  name: string;
  address: PostalAddress;
  alumniOf: (Organization | EducationalOrganization)[];
  awards?: string[];
  disambiguatingDescription?: string;
  image: ImageObject;
  jobTitle: string[];
  knowsLanguage: Language[];
  memberOf?: Organization[];
  sameAs: string;
  url: string;
  worksFor: Organization[];
  interactionStatistic?: InteractionCounter;
  description?: string;
}

// WebPage type
export interface WebPage {
  "@type": "WebPage";
  reviewedBy: {
    "@type": "Person";
    name: string;
  };
  url: string;
}

// Main schema containing multiple entities
export interface JSONLdPerson {
  "@context": string;
  "@graph": (WebPage | Person)[];
}
