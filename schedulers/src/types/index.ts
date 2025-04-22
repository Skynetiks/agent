export enum SQSRegion {
  USEast1 = "us-east-1", // US East (N. Virginia)
  USEast2 = "us-east-2", // US East (Ohio)
  USWest1 = "us-west-1", // US West (N. California)
  USWest2 = "us-west-2", // US West (Oregon)
  AFSouth1 = "af-south-1", // Africa (Cape Town)
  APEast1 = "ap-east-1", // Asia Pacific (Hong Kong)
  APSouth1 = "ap-south-1", // Asia Pacific (Mumbai)
  APSouth2 = "ap-south-2", // Asia Pacific (Hyderabad)
  APSoutheast1 = "ap-southeast-1", // Asia Pacific (Singapore)
  APSoutheast2 = "ap-southeast-2", // Asia Pacific (Sydney)
  APSoutheast3 = "ap-southeast-3", // Asia Pacific (Jakarta)
  APSoutheast4 = "ap-southeast-4", // Asia Pacific (Melbourne)
  APNortheast1 = "ap-northeast-1", // Asia Pacific (Tokyo)
  APNortheast2 = "ap-northeast-2", // Asia Pacific (Seoul)
  APNortheast3 = "ap-northeast-3", // Asia Pacific (Osaka)
  CACentral1 = "ca-central-1", // Canada (Central)
  CAWest1 = "ca-west-1", // Canada West (Calgary)
  EUCentral1 = "eu-central-1", // Europe (Frankfurt)
  EUCentral2 = "eu-central-2", // Europe (Zurich)
  EUWest1 = "eu-west-1", // Europe (Ireland)
  EUWest2 = "eu-west-2", // Europe (London)
  EUWest3 = "eu-west-3", // Europe (Paris)
  EUNorth1 = "eu-north-1", // Europe (Stockholm)
  EUSouth1 = "eu-south-1", // Europe (Milan)
  EUSouth2 = "eu-south-2", // Europe (Spain)
  MECentral1 = "me-central-1", // Middle East (UAE)
  MESouth1 = "me-south-1", // Middle East (Bahrain)
  SAEast1 = "sa-east-1", // South America (São Paulo)
}

// export type DbAgentData = {
//   id: string;
//   name: string;
//   description?: string;
//   keywords: string[];
//   activeTill: Date;
//   startTime?: string;
//   activeDays?: string[];
//   endTime?: string;
//   timezone?: string;
//   sendLimitDay?: number;
//   objective?: string;
//   valueProposition?: string;
//   personalizationLevel: string;
//   length: string;
//   strategy?: string;
//   tone: string;
//   createdAt: Date;
//   updatedAt: Date;
// };

// In case you change agent type here also change it in other services as well
export type SQSAgentData = {
  id: string;
  name: string;
  description: string;
  keyword: string | null;
  activeTill: string;
  timezone: string;
  sendLimitDay: number;
  objective: string;
  valueProposition: string;
  personalizationLevel: string;
  length: string;
  strategy: string;
  tone: string;
  createdAt: string;
  updatedAt: string;
  lastKeywordIndex: number;
  agentMailUsedCount: number;
};
