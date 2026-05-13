import Layout from "@site/components/layout/Layout";
import Seo from "@site/components/Seo";
import PracticeAreaContentSection from "@site/components/practice/PracticeAreaContentSection";
import PracticeAreaFaq from "@site/components/practice/PracticeAreaFaq";
import PracticeAreaHero from "@site/components/practice/PracticeAreaHero";
import PracticeAreaSocialProof from "@site/components/practice/PracticeAreaSocialProof";
import SectionTransition from "@site/components/shared/SectionTransition";
import type { PageMeta } from "@site/lib/cms/pageMeta";
import type { PracticeAreaPageContent } from "@site/lib/cms/practiceAreaPageTypes";

interface PracticePageViewProps {
  content: PracticeAreaPageContent;
  meta: PageMeta;
  title?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
}

// Content sections alternate: even index = white, odd index = black
function sectionBg(index: number): "dark" | "light" {
  return index % 2 === 0 ? "light" : "dark";
}

export default function PracticePageView({
  content,
  meta,
  title,
  publishedAt,
  updatedAt,
}: PracticePageViewProps) {
  const hasTestimonials = content.socialProof.mode === "testimonials";
  const sections = content.contentSections;
  const lastSectionBg = sections.length > 0 ? sectionBg(sections.length - 1) : "light";

  return (
    <Layout>
      <Seo
        title={title || undefined}
        meta={meta}
        image={content.hero.backgroundImage || undefined}
        pageContent={content}
        publishedTime={publishedAt}
        updatedTime={updatedAt}
      />

      <PracticeAreaHero
        content={content.hero}
        headingTags={content.headingTags}
        awards={
          content.socialProof.mode === "awards"
            ? content.socialProof.awards.logos
            : undefined
        }
      />

      {hasTestimonials ? (
        <PracticeAreaSocialProof
          content={content.socialProof}
          headingTags={content.headingTags}
        />
      ) : null}

      {sections.map((section, index) => {
        const currentBg = sectionBg(index);
        const prevBg = index === 0
          ? (hasTestimonials ? "light" : "light") // after hero transition or testimonials
          : sectionBg(index - 1);
        const needsTransition = index > 0 && currentBg !== prevBg;

        return (
          <div key={index}>
            {needsTransition && (
              <SectionTransition
                direction={currentBg === "dark" ? "light-to-dark" : "dark-to-light"}
              />
            )}
            <PracticeAreaContentSection section={section} index={index} />
          </div>
        );
      })}

      {/* last content section → faq (white) */}
      {lastSectionBg === "dark" && <SectionTransition direction="dark-to-light" />}

      <PracticeAreaFaq
        content={content.faq}
        headingTags={content.headingTags}
      />
    </Layout>
  );
}
