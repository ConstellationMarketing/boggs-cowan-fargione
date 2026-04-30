import Seo from "@site/components/Seo";
import Layout from "@site/components/layout/Layout";
import ContactForm from "@site/components/home/ContactForm";
import AboutSection from "@site/components/home/AboutSection";
import PracticeAreasSection from "@site/components/home/PracticeAreasSection";
import PracticeAreasGrid from "@site/components/home/PracticeAreasGrid";
import AwardsSection from "@site/components/home/AwardsSection";
import TestimonialsSection from "@site/components/home/TestimonialsSection";
import ProcessSection from "@site/components/home/ProcessSection";
import GoogleReviewsSection from "@site/components/home/GoogleReviewsSection";
import FaqSection from "@site/components/home/FaqSection";
import ContactUsSection from "@site/components/home/ContactUsSection";
import { useHomeContent } from "@site/hooks/useHomeContent";
import { useGlobalPhone } from "@site/contexts/SiteSettingsContext";
import { Loader2, Phone, MessageSquare } from "lucide-react";

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

      {/* Hero Section */}
      <div className="max-w-[2560px] mx-auto w-[95%] py-[27px] my-[20px] md:my-[40px]">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[3%]">
          {/* Left Side: H1, Headline and CTAs */}
          <div className="lg:w-[65.667%] flex flex-col justify-center">
            <div className="mb-[30px] md:mb-[40px]">
              {/* H1 Title - All caps, green, positioned ABOVE headline */}
              {heroContent.h1Title && (
                <h1 className="font-outfit text-[18px] md:text-[20px] font-medium tracking-wider uppercase text-accent mb-[15px] md:mb-[20px]">
                  {heroContent.h1Title}
                </h1>
              )}

              <div className="relative">
                <p className="font-playfair text-[clamp(2.5rem,7vw,68.8px)] font-light leading-[1.2] text-white text-left">
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
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Phone Button - Green background with white text */}
              <a
                href={`tel:${phoneNumber.replace(/\D/g, "")}`}
                className="bg-accent hover:bg-accent/90 transition-all duration-300 p-[8px] flex-1 max-w-[400px] group"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-white p-[15px] mt-1 flex items-center justify-center">
                    <Phone className="w-8 h-8 text-accent" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-inter text-[16px] md:text-[18px] leading-tight text-white pb-[10px] font-normal">
                      {phoneLabel}
                    </h4>
                    <p className="font-inter text-[clamp(1.75rem,5vw,40px)] text-white leading-tight">
                      {phoneDisplay}
                    </p>
                  </div>
                </div>
              </a>

              {/* Free Consultation Button - White background with green text */}
              {heroContent.consultationButtonText && (
                <a
                  href={heroContent.consultationButtonLink || "/contact"}
                  className="bg-white hover:bg-gray-100 transition-all duration-300 p-[8px] flex-1 max-w-[400px] group"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-accent p-[15px] mt-1 flex items-center justify-center">
                      <MessageSquare className="w-8 h-8 text-white" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 flex items-center">
                      <p className="font-inter text-[clamp(1.5rem,4vw,32px)] text-accent leading-tight font-semibold">
                        {heroContent.consultationButtonText}
                      </p>
                    </div>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Right Side: Hero Image */}
          <div className="lg:w-[31.3333%] flex items-end">
            {heroContent.heroImage && (
              <img
                src={heroContent.heroImage}
                alt={heroContent.heroImageAlt || "Hero"}
                className="w-full h-auto object-cover object-bottom"
              />
            )}
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

      {/* Awards & Membership Section */}
      <AwardsSection content={content.awards} headingTag={content.headingTags?.["awards.sectionLabel"]} />

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
