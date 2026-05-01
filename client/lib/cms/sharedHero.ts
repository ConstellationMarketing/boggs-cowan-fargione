export interface SharedHeroContent {
  h1Title: string;
  headline: string;
  highlightedText: string;
  description: string;
  backgroundImage: string;
  heroImage: string;
  heroImageAlt: string;
  consultationButtonText: string;
  consultationButtonLink: string;
  /** Legacy fields preserved for backwards-compatible reads of older CMS content. */
  sectionLabel?: string;
  tagline?: string;
  backgroundImageAlt?: string;
}

export const defaultSharedHeroContent: SharedHeroContent = {
  h1Title: "",
  headline: "",
  highlightedText: "",
  description: "",
  backgroundImage: "",
  heroImage: "",
  heroImageAlt: "",
  consultationButtonText: "",
  consultationButtonLink: "",
  sectionLabel: "",
  tagline: "",
  backgroundImageAlt: "",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function normalizeSharedHeroContent(content: unknown): SharedHeroContent {
  if (!isRecord(content)) {
    return { ...defaultSharedHeroContent };
  }

  const h1Title = readString(content.h1Title, readString(content.sectionLabel));
  const headline = readString(content.headline, readString(content.tagline));
  const highlightedText = readString(content.highlightedText);
  const description = readString(content.description);
  const backgroundImage = readString(content.backgroundImage);
  const heroImage = readString(content.heroImage);
  const heroImageAlt = readString(content.heroImageAlt, readString(content.backgroundImageAlt));
  const consultationButtonText = readString(content.consultationButtonText);
  const consultationButtonLink = readString(content.consultationButtonLink);

  return {
    h1Title,
    headline,
    highlightedText,
    description,
    backgroundImage,
    heroImage,
    heroImageAlt,
    consultationButtonText,
    consultationButtonLink,
    sectionLabel: h1Title,
    tagline: headline,
    backgroundImageAlt: readString(content.backgroundImageAlt),
  };
}
