import type { PracticeAreaHeroContent } from "@site/lib/cms/practiceAreaPageTypes";
import PageHero from "@site/components/shared/PageHero";

interface PracticeAreaHeroProps {
  content: PracticeAreaHeroContent;
  headingTags?: Record<string, string>;
}

export default function PracticeAreaHero({
  content,
  headingTags,
}: PracticeAreaHeroProps) {
  return (
    <PageHero
      content={content}
      headingTag={headingTags?.["hero.h1Title"] || headingTags?.["hero.sectionLabel"]}
    />
  );
}
