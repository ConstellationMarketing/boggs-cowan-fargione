import Seo from "@site/components/Seo";
import Layout from "@site/components/layout/Layout";
import WhyChooseUsSection from "@site/components/home/AwardsSection";
import PracticeAreasOverviewGrid from "@site/components/practice/PracticeAreasOverviewGrid";
import ApproachSection from "@site/components/shared/ApproachSection";
import PageHero from "@site/components/shared/PageHero";
import { Loader2 } from "lucide-react";
import { usePracticeAreasContent } from "@site/hooks/usePracticeAreasContent";
import { useHomeContent } from "@site/hooks/useHomeContent";

export default function PracticeAreas() {
  const { content, meta, title, publishedAt, updatedAt, isLoading } = usePracticeAreasContent();
  const { content: homeContent, isLoading: isHomeLoading } = useHomeContent();

  if (isLoading || isHomeLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Seo
        title={title || "Practice Areas"}
        meta={meta}
        pageContent={content}
        publishedTime={publishedAt}
        updatedTime={updatedAt}
      />

      <PageHero
        content={content.hero}
        headingTag={content.headingTags?.["hero.h1Title"] || content.headingTags?.["hero.sectionLabel"]}
      />

      <PracticeAreasOverviewGrid
        heading={content.grid.heading}
        description={content.grid.description}
        areas={content.grid.areas}
        headingTag={content.headingTags?.["grid.heading"]}
      />

      <WhyChooseUsSection
        content={homeContent.whyChooseUs}
        headingTag={homeContent.headingTags?.["whyChooseUs.sectionLabel"]}
      />

      <ApproachSection
        heading={content.approach.heading}
        description={content.approach.description}
        headingTag={content.headingTags?.["approach.heading"]}
      />
    </Layout>
  );
}
