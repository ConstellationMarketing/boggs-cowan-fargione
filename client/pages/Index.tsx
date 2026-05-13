import Seo from "@site/components/Seo";
import Layout from "@site/components/layout/Layout";
import AboutSection from "@site/components/home/AboutSection";
import PracticeAreasSection from "@site/components/home/PracticeAreasSection";
import PracticeAreasGrid from "@site/components/home/PracticeAreasGrid";
import WhyChooseUsSection from "@site/components/home/AwardsSection";
import ProcessSection from "@site/components/home/ProcessSection";
import GoogleReviewsSection from "@site/components/home/GoogleReviewsSection";
import FaqSection from "@site/components/home/FaqSection";
import ContactUsSection from "@site/components/home/ContactUsSection";
import PageHero from "@site/components/shared/PageHero";
import SectionTransition from "@site/components/shared/SectionTransition";
import { useHomeContent } from "@site/hooks/useHomeContent";
import { Loader2 } from "lucide-react";

export default function Index() {
  const { content, meta, title, publishedAt, updatedAt, isLoading } = useHomeContent();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
        </div>
      </Layout>
    );
  }

  // Use CMS content for hero and partner logos
  const heroContent = content.hero;
  const partnerLogos = content.partnerLogos;

  return (
    <Layout>
      <Seo
        title={title || "Home"}
        meta={meta}
        pageContent={content}
        publishedTime={publishedAt}
        updatedTime={updatedAt}
      />

      <PageHero
        content={heroContent}
        headingTag={content.headingTags?.["hero.h1Title"]}
      />

      {/* Partner Badges Section - Bottom of Hero */}
      {partnerLogos.length > 0 && (
        <>
          <div className="bg-brand-dark py-[20px] md:py-[30px]">
            <div className="max-w-[2560px] mx-auto w-[95%]">
              <div className="bg-brand-card border border-brand-border py-[10px] px-0 flex flex-nowrap justify-center overflow-hidden">
                {partnerLogos.map((logo, index) => (
                  <div
                    key={index}
                    className="px-[8px] sm:px-[15px] md:px-[30px] py-2 flex items-center justify-center flex-shrink"
                  >
                    <div className="text-center">
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        className="w-[80px] sm:w-[100px] md:w-[120px] lg:w-[190px] max-w-full inline-block"
                        width={190}
                        height={123}
                        loading="lazy"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* dark → light: badges (dark, no bg-image) → about (white) */}
          <SectionTransition direction="dark-to-light" />
        </>
      )}

      {/* About Us Section */}
      <AboutSection content={content.about} />

      {/* light → dark: about (white) → practice areas (dark) */}
      <SectionTransition direction="light-to-dark" />

      {/* Practice Areas Section */}
      <PracticeAreasSection content={content.practiceAreasIntro} />

      {/* Practice Areas Grid */}
      <PracticeAreasGrid areas={content.practiceAreas} />

      {/* dark → light: practice areas grid (dark) → awards (white) */}
      <SectionTransition direction="dark-to-light" />

      {/* Why Choose Us Section */}
      <WhyChooseUsSection content={content.whyChooseUs} headingTag={content.headingTags?.["whyChooseUs.sectionLabel"]} />

      {/* light → dark: awards (white) → process (dark) */}
      <SectionTransition direction="light-to-dark" />

      {/* Process Section */}
      <ProcessSection content={content.process} headingTags={content.headingTags} />

      {/* dark → light: process (dark) → reviews (white) */}
      <SectionTransition direction="dark-to-light" />

      {/* Google Reviews Section */}
      <GoogleReviewsSection content={content.googleReviews} headingTag={content.headingTags?.["googleReviews.sectionLabel"]} />

      {/* FAQ Section */}
      <FaqSection content={content.faq} />

      {/* light → dark: faq (white) → contact (dark) */}
      <SectionTransition direction="light-to-dark" />

      {/* Contact Us Section */}
      <ContactUsSection content={content.contact} headingTag={content.headingTags?.["contact.sectionLabel"]} />
    </Layout>
  );
}
