import type { ContactContent } from "./homePageTypes";
import type { SharedHeroContent } from "./sharedHero";
import { defaultSharedHeroContent } from "./sharedHero";

export type ContactHeroContent = SharedHeroContent;

export type ContactFormContent = Pick<ContactContent, "sectionLabel" | "heading" | "description">;

export interface ContactPageContent {
  hero: ContactHeroContent;
  form: ContactFormContent;
  /** Maps heading keys (e.g. "form.sectionLabel") to HTML tag names (e.g. "h2") */
  headingTags?: Record<string, string>;
}

export const defaultContactContent: ContactPageContent = {
  hero: {
    ...defaultSharedHeroContent,
  },
  form: {
    sectionLabel: "",
    heading: "",
    description: "",
  },
};
