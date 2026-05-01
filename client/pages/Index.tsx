import Seo from "@site/components/Seo";
import Layout from "@site/components/layout/Layout";
import AboutSection from "@site/components/home/AboutSection";
import PracticeAreasSection from "@site/components/home/PracticeAreasSection";
import PracticeAreasGrid from "@site/components/home/PracticeAreasGrid";
import WhyChooseUsSection from "@site/components/home/AwardsSection";
import TestimonialsSection from "@site/components/home/TestimonialsSection";
import ProcessSection from "@site/components/home/ProcessSection";
import GoogleReviewsSection from "@site/components/home/GoogleReviewsSection";
import FaqSection from "@site/components/home/FaqSection";
import ContactUsSection from "@site/components/home/ContactUsSection";
import { useHomeContent } from "@site/hooks/useHomeContent";
import { useGlobalPhone } from "@site/contexts/SiteSettingsContext";
import { Loader2, Phone, MessageSquare } from "lucide-react";
import RichText from "@site/components/shared/RichText";

export default function Index() {
  const { content, meta, title, publishedAt, updatedAt, isLoading } = useHomeContent();
  const { phoneNumber, phoneDisplay, phoneLabel } = useGlobalPhone();

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

      {/* Hero Section – negative top margin extends it under the transparent sticky header */}
      <div className="relative overflow-hidden bg-brand-dark -mt-[7rem] mb-[20px] md:mb-[40px] min-h-[80vh] flex flex-col">
        {heroContent.backgroundImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.95) 40%, rgba(0,0,0,0.85) 65%, rgba(0,0,0,0.60) 100%), url(${heroContent.backgroundImage})`,
            }}
          />
        ) : null}
        <div className="relative z-10 max-w-[2560px] mx-auto w-[95%] flex-1 flex flex-col">
          <div className="flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-[3%] flex-1">
            {/* Left Side: H1, Headline and CTAs */}
            <div className="lg:w-[65.667%] flex flex-col justify-end pt-[9.5rem] md:pt-[10.5rem] pb-[36px] md:pb-[48px]">
              <div className="mb-[20px] md:mb-[24px]">
              {/* H1 Title - All caps, green, positioned ABOVE headline */}
              {heroContent.h1Title && (
                <h1 className="font-outfit text-[18px] md:text-[20px] font-medium tracking-wider uppercase text-accent mb-0 leading-none">
                  {heroContent.h1Title}
                </h1>
              )}

              <div className="relative">
                <p className="font-playfair text-[clamp(2.5rem,7vw,68.8px)] font-light leading-[1.2] text-white text-left" style={{ marginTop: '-0.44em' }}>
                  {heroContent.highlightedText && heroContent.headline.includes(heroContent.highlightedText)
                    ? (() => {
                        const idx = heroContent.headline.indexOf(heroContent.highlightedText);
                        const before = heroContent.headline.slice(0, idx);
                        const match = heroContent.highlightedText;
                        const after = heroContent.headline.slice(idx + match.length);
                        return (
                          <>
                            {before}
                            <span className="text-brand-accent">{match}</span>
                            {after}
                          </>
                        );
                      })()
                    : (
                      <>
                        <span className="text-brand-accent">{heroContent.highlightedText}</span>
                        <br />
                        {heroContent.headline}
                      </>
                    )
                  }
                </p>
              </div>
              {heroContent.description ? (
                <RichText
                  html={heroContent.description}
                  className="mt-[12px] max-w-[720px] font-inter text-[15px] md:text-[18px] leading-[24px] md:leading-[30px] text-white/85"
                />
              ) : null}
            </div>

            {/* CTA Buttons */}
            <div className="grid w-full max-w-[720px] grid-cols-2 gap-3">
              {/* Phone Button - Green background with white text */}
              <a
                href={`tel:${phoneNumber.replace(/\D/g, "")}`}
                className="bg-accent hover:bg-accent/90 transition-all duration-300 p-[6px] group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white p-[10px] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 md:w-6 md:h-6 text-accent" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-inter text-[12px] md:text-[14px] leading-tight text-white pb-[4px] font-normal truncate">
                      {phoneLabel}
                    </h4>
                    <p className="font-inter text-[16px] md:text-[24px] text-white leading-tight font-semibold truncate">
                      {phoneDisplay}
                    </p>
                  </div>
                </div>
              </a>

              {/* Free Consultation Button - White background with green text */}
              {heroContent.consultationButtonText && (
                <a
                  href={heroContent.consultationButtonLink || "/contact"}
                  className="bg-white hover:bg-gray-100 transition-all duration-300 p-[6px] group"
                >
                  <div className="flex items-center gap-3 h-full">
                    <div className="bg-accent p-[10px] flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1 flex items-center">
                      <p className="font-inter text-[14px] md:text-[22px] text-accent leading-tight font-semibold">
                        {heroContent.consultationButtonText}
                      </p>
                    </div>
                  </div>
                </a>
              )}
            </div>
          </div>

            {/* Right Side: Hero Image — self-stretch fills hero height; pt-[7rem] blocks the header zone */}
            <div className="hidden lg:block lg:w-[31.3333%] self-stretch pt-[7rem]">
              {heroContent.heroImage && (
                <img
                  src={heroContent.heroImage}
                  alt={heroContent.heroImageAlt || "Hero"}
                  className="block w-full h-full object-cover object-top"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Partner Badges Section - Bottom of Hero */}
      {partnerLogos.length > 0 && (
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
      )}

      {/* About Us Section */}
      <AboutSection content={content.about} />

      {/* Practice Areas Section */}
      <PracticeAreasSection content={content.practiceAreasIntro} />

      {/* Practice Areas Grid */}
      <PracticeAreasGrid areas={content.practiceAreas} />

      {/* Why Choose Us Section */}
      <WhyChooseUsSection content={content.whyChooseUs} headingTag={content.headingTags?.["whyChooseUs.sectionLabel"]} />

      {/* Testimonials Section */}
      <TestimonialsSection content={content.testimonials} headingTag={content.headingTags?.["testimonials.sectionLabel"]} />

      {/* Process Section */}
      <ProcessSection content={content.process} headingTags={content.headingTags} />

      {/* Google Reviews Section */}
      <GoogleReviewsSection content={content.googleReviews} headingTag={content.headingTags?.["googleReviews.sectionLabel"]} />

      {/* FAQ Section */}
      <FaqSection content={content.faq} />

      {/* Contact Us Section */}
      <ContactUsSection content={content.contact} headingTag={content.headingTags?.["contact.sectionLabel"]} />
    </Layout>
  );
}
