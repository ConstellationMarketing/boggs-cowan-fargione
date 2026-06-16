// Type definitions for structured homepage content
import type { SharedHeroContent } from "./sharedHero";
import { defaultSharedHeroContent } from "./sharedHero";

// Each section maps directly to a static component's data needs

export type HeroContent = SharedHeroContent;

export interface PartnerLogo {
  src: string;
  alt: string;
}

export interface AboutBadge {
  src: string;
  alt: string;
  link?: string;
}

export interface AboutContent {
  sectionLabel: string;
  heading: string;
  description: string;
  phone: string;
  phoneLabel: string;
  contactLabel: string;
  contactText: string;
  attorneyImage: string;
  attorneyImageAlt: string;
  badges: AboutBadge[];
  credentialsTitle: string;
  admissionsTitle: string;
  admissionsItems: string[];
  membershipsTitle: string;
  membershipsItems: string[];
}

export interface PracticeAreaSubPractice {
  text: string;
  link: string;
}

export interface PracticeAreaItem {
  title: string;
  icon: string;
  subPractices: PracticeAreaSubPractice[];
  link: string;
}

export interface PracticeAreasIntroContent {
  sectionLabel: string;
  heading: string;
  description: string;
}

export interface HomeWhyChooseUsItem {
  icon: string;
  title: string;
  description: string;
}

export interface HomeWhyChooseUsContent {
  image: string;
  imageAlt: string;
  sectionLabel: string;
  heading: string;
  description: string;
  items: HomeWhyChooseUsItem[];
}

export interface TestimonialItem {
  text: string;
  author: string;
  ratingImage: string;
  ratingImageAlt?: string;
}

export interface TestimonialsContent {
  sectionLabel: string;
  heading: string;
  backgroundImage: string;
  backgroundImageAlt?: string;
  items: TestimonialItem[];
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface ProcessContent {
  sectionLabel: string;
  heading: string;
  description: string;
  steps: ProcessStep[];
}

export interface GoogleReviewItem {
  text: string;
  author: string;
  ratingImage: string;
  ratingImageAlt?: string;
}

export interface GoogleReviewsContent {
  sectionLabel: string;
  heading: string;
  description: string;
  reviews: GoogleReviewItem[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqContent {
  heading: string;
  description: string;
  videoThumbnail: string;
  videoThumbnailAlt?: string;
  videoUrl: string;
  items: FaqItem[];
}

export interface ContactContent {
  sectionLabel: string;
  heading: string;
  description: string;
  phone: string;
  phoneLabel: string;
  address: string;
  formHeading: string;
  availabilityText: string;
  image: string;
  imageAlt: string;
}

// Complete homepage content structure
export interface HomePageContent {
  hero: HeroContent;
  partnerLogos: PartnerLogo[];
  about: AboutContent;
  practiceAreasIntro: PracticeAreasIntroContent;
  practiceAreas: PracticeAreaItem[];
  whyChooseUs: HomeWhyChooseUsContent;
  testimonials: TestimonialsContent;
  process: ProcessContent;
  googleReviews: GoogleReviewsContent;
  faq: FaqContent;
  contact: ContactContent;
  /** Maps heading keys (e.g. "about.heading") to HTML tag names (e.g. "h2") */
  headingTags?: Record<string, string>;
}

// Default content - empty defaults, content comes exclusively from the CMS
export const defaultHomeContent: HomePageContent = {
  hero: {
    ...defaultSharedHeroContent,
  },
  partnerLogos: [],
  about: {
    sectionLabel: "",
    heading: "",
    description: "",
    phone: "",
    phoneLabel: "",
    contactLabel: "",
    contactText: "/about/",
    attorneyImage: "",
    attorneyImageAlt: "",
    badges: [],
    credentialsTitle: "Credentials & Affiliations",
    admissionsTitle: "Court Admissions",
    admissionsItems: [],
    membershipsTitle: "Memberships",
    membershipsItems: [],
  },
  practiceAreasIntro: {
    sectionLabel: "",
    heading: "",
    description: "",
  },
  practiceAreas: [],
  whyChooseUs: {
    image: "",
    imageAlt: "",
    sectionLabel: "",
    heading: "",
    description: "",
    items: [],
  },
  testimonials: {
    sectionLabel: "",
    heading: "",
    backgroundImage: "",
    backgroundImageAlt: "",
    items: [],
  },
  process: {
    sectionLabel: "",
    heading: "",
    description: "",
    steps: [],
  },
  googleReviews: {
    sectionLabel: "",
    heading: "",
    description: "",
    reviews: [],
  },
  faq: {
    heading: "",
    description: "",
    videoThumbnail: "",
    videoThumbnailAlt: "",
    videoUrl: "",
    items: [],
  },
  contact: {
    sectionLabel: "",
    heading: "",
    description: "",
    phone: "",
    phoneLabel: "",
    address: "",
    formHeading: "",
    availabilityText: "",
    image: "",
    imageAlt: "",
  },
};
