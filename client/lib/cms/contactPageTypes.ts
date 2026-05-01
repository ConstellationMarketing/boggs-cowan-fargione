import type { SharedHeroContent } from "./sharedHero";
import { defaultSharedHeroContent } from "./sharedHero";

export type ContactHeroContent = SharedHeroContent;

export interface ContactFormContent {
  heading: string;
  subtext: string;
}

export interface ContactPageContent {
  hero: ContactHeroContent;
  form: ContactFormContent;
  /** Maps heading keys (e.g. "form.heading") to HTML tag names (e.g. "h2") */
  headingTags?: Record<string, string>;
}

export const defaultContactContent: ContactPageContent = {
  hero: {
    ...defaultSharedHeroContent,
  },
  form: {
    heading: "",
    subtext: "",
  },
};
