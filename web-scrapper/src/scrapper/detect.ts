const restrictedDomains = new Set([
  "linkedin.com",
  "twitter.com",
  "facebook.com",
  "instagram.com",
  "youtube.com",
  "twitch.tv",
  "discord.com",
  "reddit.com",
  "tiktok.com",
  "snapchat.com",
  "pinterest.com",
  "tumblr.com",
  "soundcloud.com",
  "spotify.com",
  "medium.com",
  "behance.net",
  "vimeo.com",
  "flickr.com",
  "dribbble.com",
  "github.com",
  "bit.ly",
  "youtu.be",
  "t.co",
  "x.com",
]);

enum WebPageType {
  LINKEDIN = "LINKEDIN",
  LINKEDIN_COMPANY = "LINKEDIN_COMPANY",
  TWITTER = "TWITTER",
  FACEBOOK = "FACEBOOK",
  COMPANY_WEBSITE = "COMPANY_WEBSITE",
}

const getWebPageType = (
  hostname: string,
  pathname: string
): WebPageType | null => {
  switch (true) {
    case hostname.includes("linkedin.com") && pathname.startsWith("/in/"):
      return WebPageType.LINKEDIN;

    case hostname.includes("linkedin.com") && pathname.startsWith("/company/"):
      return WebPageType.LINKEDIN_COMPANY;

    case hostname.includes("twitter.com"):
      return WebPageType.TWITTER;

    case hostname.includes("facebook.com"):
      return WebPageType.FACEBOOK;

    case !restrictedDomains.has(hostname):
      return WebPageType.COMPANY_WEBSITE;

    default:
      return null;
  }
};

export const detectWebPageType = async (
  url: string
): Promise<WebPageType | null> => {
  try {
    const { hostname, pathname } = new URL(url);
    return getWebPageType(hostname, pathname);
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
};
