// Type definitions for structured Practice Areas page content
import type { SharedHeroContent } from "./sharedHero";
import { defaultSharedHeroContent } from "./sharedHero";

// Each section maps directly to a static component's data needs

export type PracticeAreasHeroContent = SharedHeroContent;

export interface PracticeAreaSubItem {
  icon: string; // Lucide icon name for the sub-practice
  title: string;
  description: string;
  link: string;
}

export interface PracticeAreaGridItem {
  icon: string; // Lucide icon name
  image: string; // Background image URL for the main practice card
  title: string; // "Personal Injury"
  description: string; // Rich text description for the main practice
  link: string; // Link to main practice page
  linkText: string;
  /** Title for the sub-practices section below the main cards, e.g. "Personal Injury Services" */
  subgroupTitle: string;
  subPractices: PracticeAreaSubItem[];
}

export interface PracticeAreasGridCta {
  label: string;
  link: string;
  variant: "primary" | "outline"; // primary = filled accent, outline = bordered
}

export interface PracticeAreasGridContent {
  heading: string; // "Our Areas of Practice"
  description: string; // Intro paragraph
  areas: PracticeAreaGridItem[];
  footerTitle: string; // Centered title below all cards/subpractices
  footerSubtitle: string; // Centered subtitle/description below the title
  footerButtons: PracticeAreasGridCta[]; // Up to 2 CTA buttons
}

export interface WhyChooseItem {
  number: string;
  title: string;
  description: string;
}

export interface WhyChooseContent {
  sectionLabel: string; // "– Why Choose Us"
  heading: string; // "Experience Across All Practice Areas"
  subtitle: string; // Subtitle text
  description: string; // Description paragraph
  image: string; // Section image (shared from About page)
  imageAlt: string; // Image alt text
  items: WhyChooseItem[];
}

export interface PracticeAreasApproachContent {
  heading: string;
  description: string;
}

export interface CTAContent {
  heading: string; // "Ready to Discuss Your Case?"
  description: string; // Subtitle text
  primaryButton: {
    label: string; // "Call Us 24/7"
    phone: string; // Phone number
  };
  secondaryButton: {
    label: string; // "Schedule Now"
    sublabel: string; // "Free Consultation"
    link: string; // Link URL
  };
}

// Complete Practice Areas page content structure
export interface PracticeAreasPageContent {
  hero: PracticeAreasHeroContent;
  grid: PracticeAreasGridContent;
  whyChoose: WhyChooseContent;
  approach: PracticeAreasApproachContent;
  cta: CTAContent;
  /** Maps heading keys (e.g. "grid.heading") to HTML tag names (e.g. "h2") */
  headingTags?: Record<string, string>;
}

// Default content - empty defaults, content comes exclusively from the CMS
export const defaultPracticeAreasContent: PracticeAreasPageContent = {
  hero: {
    ...defaultSharedHeroContent,
  },
  grid: {
    heading: "",
    description: "",
    areas: [],
    footerTitle: "",
    footerSubtitle: "",
    footerButtons: [],
  },
  whyChoose: {
    sectionLabel: "",
    heading: "",
    subtitle: "",
    image: "",
    imageAlt: "",
    description: "",
    items: [],
  },
  approach: {
    heading: "",
    description: "",
  },
  cta: {
    heading: "",
    description: "",
    primaryButton: {
      label: "",
      phone: "",
    },
    secondaryButton: {
      label: "",
      sublabel: "",
      link: "",
    },
  },
};
