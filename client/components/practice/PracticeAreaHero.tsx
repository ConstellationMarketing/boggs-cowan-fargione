import type { PracticeAreaHeroContent } from "@site/lib/cms/practiceAreaPageTypes";
import PageHero from "@site/components/shared/PageHero";

interface PracticeAreaHeroProps {
  content: PracticeAreaHeroContent;
  headingTags?: Record<string, string>;
  awards?: Array<{ src: string; alt: string }>;
}

export default function PracticeAreaHero({
  content,
  headingTags,
  awards,
}: PracticeAreaHeroProps) {
  return (
    <PageHero
      content={content}
      headingTag={headingTags?.["hero.h1Title"] || headingTags?.["hero.sectionLabel"]}
      awardLogos={awards}
    />
  );
}
