import Seo from "@site/components/Seo";
import Layout from "@site/components/layout/Layout";
import WhyChooseUsSection from "@site/components/home/AwardsSection";
import PracticeAreasOverviewGrid from "@site/components/practice/PracticeAreasOverviewGrid";
import CallBox from "@site/components/shared/CallBox";
import PageHero from "@site/components/shared/PageHero";
import { Phone, Calendar, Loader2 } from "lucide-react";
import { usePracticeAreasContent } from "@site/hooks/usePracticeAreasContent";
import { useHomeContent } from "@site/hooks/useHomeContent";
import { useGlobalPhone } from "@site/contexts/SiteSettingsContext";
import RichText from "@site/components/shared/RichText";

export default function PracticeAreas() {
  const { content, meta, title, publishedAt, updatedAt, isLoading } = usePracticeAreasContent();
  const { content: homeContent, isLoading: isHomeLoading } = useHomeContent();
  const { phoneNumber, phoneDisplay, phoneLabel } = useGlobalPhone();

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

      {/* Call to Action Section */}
      <div className="bg-brand-accent py-[40px] md:py-[60px]">
        <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%] lg:w-[80%]">
          <div className="text-center mb-[30px] md:mb-[40px]">
            <h2 className="font-playfair text-[36px] md:text-[48px] lg:text-[60px] leading-tight text-black pb-[15px]">
              {content.cta.heading}
            </h2>
            <RichText
              html={content.cta.description}
              className="font-outfit text-[18px] md:text-[22px] leading-[26px] md:leading-[32px] text-black/80"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-center md:items-start">
            <CallBox
              icon={Phone}
              title={phoneLabel}
              subtitle={phoneDisplay}
              phone={phoneNumber}
              className="bg-brand-accent-dark hover:bg-black"
              variant="dark"
            />
            <CallBox
              icon={Calendar}
              title={content.cta.secondaryButton.label}
              subtitle={content.cta.secondaryButton.sublabel}
              link={content.cta.secondaryButton.link}
              className="bg-brand-accent-dark hover:bg-black"
              variant="dark"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
