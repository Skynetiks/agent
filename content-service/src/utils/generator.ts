import { ai } from "../ai";
import {
  getEmailContentPrompt,
  getEmailSubjectPrompt,
} from "../prompts/email-content";
import { env } from "./env";

export const generateMailContent = async () => {
  const emailContentPrompt = getEmailContentPrompt({
    senderCompanyInfo: {
      companyName: "Skyfunnel Ai",
      industry: "Saas for Marketing",
      websiteData: undefined,
      contact: {
        email: "aman@skyfunnel.ai",
        name: "Aman Gupta",
      },
      valueProposition: `SkyFunnel.ai – The Ultimate Marketing Platform to Boost Your Lead Generation & Conversions!
In today's fast-paced market, businesses struggle with managing multiple ad platforms and communication channels, leading to inefficiencies and missed opportunities. SkyFunnel.ai solves this by offering an all-in-one solution that seamlessly integrates Email :e-mail: and WhatsApp :iphone: marketing, helping you capture more leads and convert them into loyal customers.
Key Features:
Unified Marketing Hub – Streamline your campaigns across platforms, eliminating the need for multiple tools.
AI-Powered Lead Generation – Use artificial intelligence to identify and engage potential customers effectively.
Comprehensive Campaign Management – Design, execute, and monitor your marketing campaigns from a single dashboard.
      `,
    },
    length: "MEDIUM",
    personalizationLevel: "LOW",
    strategy: "EDUCATIONAL",
    tone: "WITTY",
    cta: {
      label: "REPLY_FOR_MORE_INFO",
      requirements: {},
    },
    objective: "Increase sales and revenue for our skyfunnel",
    receiverCompanyInfo: {
      companyName: "Sprint Digitech",
      industry: "Digital Marketing Agency",
      websiteData: `Digital Marketing Agency in Noida
Drive Growth |
With Sprint Digitech
Get Free Consultation
Our Clients
Our Founder’s Perspective
Devender Jain
Digital marketing has transformed marketing with technology, but we prioritize quality over quantity with our motto Delivering Digital Dreams. Our professionalism ensures excellence in every aspect of our efforts, staying true to our vision.
Devender Jain
Founder & CEO
Nancy Jain
Digital marketing relies on creativity, which is essential in our industry. Balancing creativity with professionalism, our expert team aims to deliver high-quality products while honoring our commitments.
Nancy Jain
Creative Head & Co-Founder
100
+
Projects
$
8
M+
Ad Spent
$
100
M+
Revenue
Our Services
01
Website Design
Forget websites that are just a digital brochure! We create modern, user-friendly websites that go beyond aesthetics to wow visitors and convert them into loyal customers. Our long checklists ensure your website is not only beautiful but also easy to navigate, with a clear path for visitors to take action…Read More
02
UI/UX Design
Are you struggling to get noticed online despite having a visually stunning website or software? We understand that aesthetics are important, but beauty without purpose is fleeting. Bridging the creativity gap, we craft UI/UX designs that are as visually stunning as they are user-friendly, ensuring your digital presence truly shines.… Read More
03
Graphic Design
Colour, art, and marketing – these aren’t words at Sprint Digitech, they’re the foundation of our graphic design philosophy. We understand that captivating visuals are the stone of effective marketing. That’s why we go beyond creating “pretty pictures….” Read More
04
Search Engine Optimisation (SEO)
As much as you don’t like those expensive ads, we hate them too! Our SEO mastery will bring organic traffic, and a steady stream of high-quality users actively searching for what you offer..Read More
05
Content Marketing
In today’s digital world, content is king, but engaging content is a brand’s secret weapon. Sprint Digitech writes content strategies that don’t just inform, they narrate brand stories and fuel conversions… Read More
06
Social Media Marketing
Forget the historic marketing tactics! In today’s social media world, engagement is everything. We’re the fastest-growing social media powerhouse. We create strategic campaigns…Read More
07
Paid Advertising
PPC Company in Noida, specialises in data-driven pay-per-click (PPC) advertising campaigns that drive targeted traffic and maximize return on investment (ROI)… Read More
08
Performance Marketing
Grow faster. Achieve more. Performance marketing is our key to achieving measurable results in record time. We don’t do the guesswork. Sprint Digitech focuses on data-driven strategies that deliver a clear return on investment (ROI)… Read More
Our Growth Partners
Our Latest Projects
All MarketingPaid AdsSEOWebsite
Dead Sour
Black Scale Media
Scoreplus
Kalaakriti
What Our Clients Say
"I cannot speak highly enough of the outstanding work done by Sprint Digitech. Their expertise and strategic insights have revolutionized our online presence. With their help, we have experienced a substantial increase in website traffic and conversions. The Sprint Digitech team is incredibly knowledgeable, professional, and proactive. They keep up with the latest industry trends and continuously optimize our digital marketing campaigns for optimal results. We are thrilled with the partnership and highly recommend Sprint Digitech Digital Marketing Agency to any business looking to thrive in the digital landscape."
Read more
Simran Kaur
Owner, Fashion Store
"Sprint Digitech provided end-to-end digital marketing solutions that transformed our e-commerce business. Their comprehensive approach, from SEO to social media, ensured a cohesive online strategy. They have proven expertise in navigating the digital landscape and driving success for our brand."
Read more
Pooja Mehra
Owner, Pooja Handicrafts
Since partnering with Sprint Digtech, we've seen a remarkable 300% increase in qualified leads and a 25% boost in sales. Their data-driven SEO strategies and targeted PPC campaigns have significantly improved our online presence and brand awareness in the B2B space.
Read more
John Smith
Black Scale Media Inc.
"Sprint Digitech provides the best digital marketing services in Noida. Their expert team is phenomenal at boosting business growth. I received outstanding services from them. Thank you, team Sprint Digitech!"
Shweta Verma
Owner, Suhanas Boutique
"Sprint Digitech maximizes digital potential. Their strategies are incredibly effective, and the team's dedication is evident in every interaction. A must-have for any business aiming to thrive online. Sprint Digitech rocks social media! Their creative content, strategic campaigns, and exceptional engagement have been game-changers for our brand."
Read more
Rajesh Kumar
VP of Marketing, Spar Supermarkets
"Sprint Digitech's Social Media Marketing service brilliantly engaged our audience. Their creative campaigns, consistent posting, and strategic approach significantly enhanced our brand presence. Highly recommended for impactful social media strategies."
Read more
Ankit Sharma
Owner, BluOrng
"As a B2B company, establishing a strong online presence was crucial for us. Sprint Digitech's SEO and content marketing proved invaluable. They optimised our website and developed high-quality content that attracted our target audience. We highly recommend Sprint DigiTech to any business looking for a top-notch marketing agency."
Read more
Jaim
Marketing Director, KTC Marbles
“ We partnered with Sprint Digitech for online marketing and the results were great. Their team developed a targeted campaign that not only increased brand awareness but also led to a significant boost in sales. We're incredibly impressed with their creativity and dedication to achieving our goals. Thank you, Sprint DigiTech!"
Read more
Rahul
CEO, Neyett
Frequently Asked Questions
How can Sprint Digitech help increase my business’s ROI?
We leverage data-driven approaches in SEO, content marketing, and performance marketing to drive organic traffic and boost conversions, ensuring a notable increase in ROI.
What is the importance of UI/UX design in digital marketing?
How can your SEO services benefit my business?
How does Sprint Digitech handle social media marketing?
What is performance marketing and how does it help my business?
How do you measure the success of your digital marketing campaigns?

`,
      contact: {
        email: "info@digitech.com",
        name: "Devendar",
      },
      valueProposition: undefined,
    },
  });

  //   const completion = await ai.chat.completions.create({
  //     messages: [
  //       {
  //         role: "system",
  //         content:
  //           "You are an expert email marketing assistant specializing in crafting personalized, conversion-focused email templates.",
  //       },
  //       {
  //         role: "user",
  //         content: emailContentPrompt,
  //       },
  //     ],
  //     model: env.AI_MODEL,
  //   });

  const completion = await ai.chat({
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
    body: completion || "",
    objective: "Increase sales and revenue for our skyfunnel",
  });

  console.log(completion);
};
