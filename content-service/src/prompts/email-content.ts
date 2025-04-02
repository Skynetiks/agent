import { GetEmailContentPromptProps } from "../types";
import { getCtaPrompt } from "./options/cta";
import { getLengthPrompt } from "./options/length";
import { getPersonalizationLevelPrompt } from "./options/personalizedLevel";
import { getStrategyPrompt } from "./options/statergy";
import {
  getSubjectLineStylePrompt,
  SubjectLineStyle,
} from "./options/subjectTone";
import { getTonePrompt } from "./options/tone";

export const getEmailContentPrompt = ({
  objective,
  receiverCompanyInfo,
  senderCompanyInfo,
  length,
  personalizationLevel,
  strategy,
  cta,
  tone,
}: GetEmailContentPromptProps) => {
  // Generate prompts based on provided fields
  const lengthPrompt = getLengthPrompt(length || "MEDIUM");
  const personalizationLevelPrompt = getPersonalizationLevelPrompt(
    personalizationLevel || "MEDIUM"
  );
  const strategyPrompt = getStrategyPrompt(strategy || "INFORMATIONAL");
  const tonePrompt = getTonePrompt(tone || "FORMAL");
  //   const ctaPrompt = cta ?  : undefined;

  // Generate CTA requirements dynamically
  const ctaRequirements = cta
    ? Object.entries(cta.requirements)
        .map(([key, value]) => `<${key}>${value}</${key}>`)
        .join("\n")
    : "";

  const ctaPrompt = cta
    ? `
<cta>
${getCtaPrompt(cta.label)}
<ctaRequirements>
${ctaRequirements}
</ctaRequirements>
</cta>
    `
    : "";

  return `
  <prompt>
      <description>
          You are an expert email marketing assistant specializing in crafting personalized, conversion-focused email templates. Your task is to generate a professional, engaging, and customized email template using the provided inputs.
      </description>

      <inputs information="These are the inputs/context that the AI will use to generate the email content">
          <targetCompany information="This is the company that the email is being sent to">
              <name>${receiverCompanyInfo.companyName || "Not Specified"}</name>
              <industry>${
                receiverCompanyInfo.industry || "Not specified"
              }</industry>
              <websiteData information="This is the website data of the target company">
                  <mdx information="this is the markdown content of the website. converted from html of sender company">
                      ${
                        receiverCompanyInfo.websiteData ||
                        "No website data available"
                      }
                  </mdx>
              </websiteData>
              <contact>
                  ${
                    receiverCompanyInfo.contact?.name
                      ? `<name>${
                          receiverCompanyInfo.contact?.name || "No contact name"
                        }</name>`
                      : ""
                  }
                  <email>${
                    receiverCompanyInfo.contact?.email || "No contact email"
                  }</email>
              </contact>
          </targetCompany>

          <senderCompany information="This is the company that is sending the email">
              <name>${senderCompanyInfo.companyName}</name>
              <industry>${
                senderCompanyInfo.industry || "Not specified"
              }</industry>
              <valueProposition>${
                senderCompanyInfo.valueProposition
              }</valueProposition>

               <contact>
                  ${
                    senderCompanyInfo.contact?.name
                      ? `<name>${senderCompanyInfo.contact?.name}</name>`
                      : ""
                  }
                  <email>${
                    senderCompanyInfo.contact?.email || "No contact email"
                  }</email>
              </contact>
          </senderCompany>

          <objective>
              <goal>${objective || "lead generation"}</goal>
          </objective>
      </inputs>

      <requirements information="These are the rules that the AI will follow to generate the email content">
          <personalizationLevel>${personalizationLevelPrompt}</personalizationLevel>
          <length>${lengthPrompt}</length>
          <strategy>${strategyPrompt}</strategy>
          <tone>${tonePrompt}</tone>
          ${ctaPrompt}
          <introduction>✅ Reference the target company’s website details to show familiarity and why they need the service</introduction>
          <body>✅ Clearly explain how your service/product addresses their needs or benefits them</body>
          <callToAction>✅ Include a clear and compelling CTA</callToAction>
          <closing>✅ End with a polite sign-off, including sender details</closing>
          <variable>You will not give any variable in the content if information is missing, just skip it.</variable>
          <rule>You will not put anything inside square brackets if information is missing, just skip it.</rule>
          <return-type>You have to return the content as a string format without any extra information (JUST CONTENT) (no HTML tags)</return-type>
      </requirements>

      <rules information="These are the rules that the AI will follow to generate the email content. It is important to follow these rules to ensure the email content is relevant, engaging, and meets the target's needs.">
              <rule>Response should only contain the email content without any extra information. It should be in a string format.</rule>
              <rule>Response should be in a string format without any extra information (JUST CONTENT) (no HTML tags)</rule>
              <rule>Response should not give any variable in the content if information is missing, just skip it.</rule>
              <rule>Response should not put anything inside square brackets if information is missing, just skip it.</rule>
      </rules>

      <outputFormat information="Everything inside square brackets is a placeholder and should be replaced with the appropriate content">
              Dear [Contact Name or Title],
              [Customized introduction referencing target company details in the specified tone]
              [Personalized body text highlighting sender's value proposition in the specified tone]
              [Clear call-to-action with next steps in the specified tone]
              Best regards,
                  [Sender Name (if available else skip it)]
                  [Sender Company (if available else skip it)]
                  [Contact Information (if available else skip it)]
      </outputFormat>
  </prompt>
  `;
};

export const getEmailSubjectPrompt = ({
  body,
  objective,
  subjectTone,
}: {
  body: string;
  objective: string;
  subjectTone: SubjectLineStyle;
}) => {
  const style = getSubjectLineStylePrompt(subjectTone || "CURIOSITY_DRIVEN");
  return `
<prompt>
    <description>
        You are an expert email marketing assistant specializing in crafting personalized and engaging subject lines. Your task is to generate a compelling subject line based on the provided email content.
    </description>

    <inputs>
        <emailContent>${body}</emailContent>

        <objective>
            <goal>${objective}</goal>
        </objective>
    </inputs>

    <requirements>
        <tone>✅ Professional yet attention-grabbing</tone>
        <clarity>✅ Clearly reflect the objective of the email</clarity>
        <relevance>✅ Reference key benefits or pain points mentioned in the email</relevance>
        <length>✅ Keep it concise (5-10 words)</length>
        <style>${style}</style>
        <return-type>You have to return the subject line as a string format (no HTML tags)</return-type>
    </requirements>

    <rules>
        <rule>Follow the specified style and tone</rule>
        <rule>Keep it concise (5-10 words)</rule>
        <rule>Don't Include anything other than subject. just return subject as plain text</rule>
        <rule>Don't include any variables or placeholders. the subject line should be a simple string</rule>
    </rules>

    <outputFormat>
        <subjectLine>
            [Generated subject line based on the email content in the specified tone]
        </subjectLine>
    </outputFormat>
</prompt>
`;
};
