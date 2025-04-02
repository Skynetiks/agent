// Use PascalCase for enums
export enum PersonalizationLevel {
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW",
}

export enum ContentLength {
  CONCISE = "CONCISE",
  ELABORATE = "ELABORATE",
  MEDIUM = "MEDIUM",
  ULTRA_CONCISE = "ULTRA_CONCISE",
}

export enum Tone {
  PROFESSIONAL = "PROFESSIONAL",
  FRIENDLY = "FRIENDLY",
  CONFIDENT = "CONFIDENT",
  ENTHUSIASTIC = "ENTHUSIASTIC",
  INFORMATIVE = "INFORMATIVE",
  CASUAL = "CASUAL",
  FORMAL = "FORMAL",
  INSPIRATIONAL = "INSPIRATIONAL",
  WITTY = "WITTY",
  EMPATHETIC = "EMPATHETIC",
}

export enum SenderIdentityType {
  SKYFUNNEL = "SKYFUNNEL",
  // Add other types if they exist
}

// Use interfaces for entity models
export interface IAgent {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  activeTill: Date | null;
  startTime: string | null;
  activeDays: string[];
  endTime: string | null;
  timezone: string | null;
  sendLimitDay: number;
  objective: string | null;
  valueProposition: string | null;
  personalizationLevel: PersonalizationLevel;
  length: ContentLength;
  strategy: string | null;
  tone: Tone;
  lastKeywordIndex: number;
  createdAt: Date;
  updatedAt: Date;
  senderIdentities?: ISenderIdentity[];
}

export interface ISenderIdentity {
  id: string;
  email: string;
  type: SenderIdentityType;
  isActive: boolean;
  createdAt: Date;
  organizationId: string;
  agents?: IAgent[];
}

// Define an explicit type for the query response
export interface AgentWithSenderIdentityDto {
  // Agent fields
  id: string;
  name: string;
  description: string;
  keywords: string[];
  activeTill: Date | null;
  startTime: string | null;
  activeDays: string[];
  endTime: string | null;
  timezone: string | null;
  sendLimitDay: number;
  objective: string | null;
  valueProposition: string | null;
  personalizationLevel: PersonalizationLevel;
  contentLength: ContentLength;
  strategy: string | null;
  tone: Tone;
  lastKeywordIndex: number;
  createdAt: Date;
  updatedAt: Date;
  senderName: string;

  // SenderIdentity fields
  senderIdentityId: string;
  senderEmail: string;
  senderType: SenderIdentityType;
  senderIsActive: boolean;
  senderCreatedAt: Date;
  organizationId: string;
  organizationName: string;
  organizationIndustry: string;
}
