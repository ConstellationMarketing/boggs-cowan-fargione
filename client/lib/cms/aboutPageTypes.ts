// Type definitions for structured About page content
import type { AboutContent as StoryContent } from "./homePageTypes";
import { defaultHomeContent } from "./homePageTypes";
import type { SharedHeroContent } from "./sharedHero";
import { defaultSharedHeroContent } from "./sharedHero";

// Each section maps directly to a static component's data needs

export type AboutHeroContent = SharedHeroContent;

export type TeamCategory = "attorney" | "paralegal" | "staff";

export const TEAM_CATEGORY_OPTIONS: { value: TeamCategory; label: string }[] = [
  { value: "attorney", label: "Attorney" },
  { value: "paralegal", label: "Paralegal" },
  { value: "staff", label: "Office Staff" },
];

export interface TeamMember {
  name: string;
  title: string;
  bio: string;
  image: string;
  imageAlt: string;
  credentials: string[];
  category?: TeamCategory; // Missing on older content; see resolveTeamCategory
}

export interface TeamContent {
  sectionLabel: string; // Attorneys group label, "MEET OUR ATTORNEYS"
  heading: string; // Main heading, "Our Legal Team"
  paralegalsLabel: string; // "MEET OUR PARALEGALS"
  staffLabel: string; // "MEET OUR OFFICE STAFF"
  members: TeamMember[];
}

export interface TeamGroup<T extends TeamMember = TeamMember> {
  category: TeamCategory;
  label: string;
  members: T[];
}

// Members saved before categories existed have no category, so fall back to the title
export function resolveTeamCategory(member: Pick<TeamMember, "category" | "title">): TeamCategory {
  if (member.category && TEAM_CATEGORY_OPTIONS.some((option) => option.value === member.category)) {
    return member.category;
  }
  return /paralegal/i.test(member.title || "") ? "paralegal" : "attorney";
}

// Groups members in display order (attorneys, paralegals, office staff), dropping empty groups
export function groupTeamMembers<T extends TeamMember>(
  team: Pick<TeamContent, "sectionLabel" | "paralegalsLabel" | "staffLabel">,
  members: T[],
): TeamGroup<T>[] {
  const labels: Record<TeamCategory, string> = {
    attorney: team.sectionLabel,
    paralegal: team.paralegalsLabel,
    staff: team.staffLabel,
  };

  return TEAM_CATEGORY_OPTIONS.map(({ value }) => ({
    category: value,
    label: labels[value] || "",
    members: members.filter((member) => resolveTeamCategory(member) === value),
  })).filter((group) => group.members.length > 0);
}

export interface ApproachContent {
  heading: string;
  description: string;
}

export interface ValueItem {
  icon: string; // Lucide icon name
  title: string;
  description: string;
}

export interface ValuesContent {
  sectionLabel: string; // "– Our Values"
  heading: string; // "Principles That Guide Our Practice"
  subtitle: string; // Subtitle text (NEW)
  items: ValueItem[];
}

export interface StatItem {
  value: string;
  label: string;
}

export interface StatsContent {
  stats: StatItem[];
}

export interface WhyChooseUsItem {
  number: string;
  title: string;
  description: string;
}

export interface WhyChooseUsContent {
  sectionLabel: string; // "– Why Choose Us"
  heading: string; // "What Sets Us Apart"
  description: string; // Intro paragraph
  image: string; // Section image
  imageAlt: string; // Image alt text
  items: WhyChooseUsItem[];
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

// Complete About page content structure
export interface AboutPageContent {
  hero: AboutHeroContent;
  story: StoryContent;
  team: TeamContent;
  approach: ApproachContent;
  values: ValuesContent;
  stats: StatsContent;
  whyChooseUs: WhyChooseUsContent;
  cta: CTAContent;
  /** Maps heading keys (e.g. "story.heading") to HTML tag names (e.g. "h2") */
  headingTags?: Record<string, string>;
}

// Default content - empty defaults, content comes exclusively from the CMS
export const defaultAboutContent: AboutPageContent = {
  hero: {
    ...defaultSharedHeroContent,
  },
  story: {
    ...defaultHomeContent.about,
  },
  team: {
    sectionLabel: "",
    heading: "",
    paralegalsLabel: "MEET OUR PARALEGALS",
    staffLabel: "MEET OUR OFFICE STAFF",
    members: [],
  },
  approach: {
    heading: "Our Approach",
    description: `<p>At Boggs, Cowan, & Fargione, we handle every case with intention. We take the time to understand how an injury, family law matter, or civil dispute affects our client's life — and we build our legal strategy around that reality.</p><p>Clients work directly with their attorney and receive straightforward communication about their case, potential challenges, and realistic expectations. Our goal is not to rush cases to resolution, but to position them for the strongest possible outcome — whether through negotiation or at trial.</p><p>We take pride in preparation, honest counsel, and representing our clients with care and respect at every stage of the process.</p>`,
  },
  values: {
    sectionLabel: "",
    heading: "",
    subtitle: "",
    items: [],
  },
  stats: {
    stats: [],
  },
  whyChooseUs: {
    sectionLabel: "",
    heading: "",
    description: "",
    image: "",
    imageAlt: "",
    items: [],
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
