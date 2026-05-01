import Seo from "@site/components/Seo";
import Layout from "@site/components/layout/Layout";
import AboutSection from "@site/components/home/AboutSection";
import CallBox from "@site/components/shared/CallBox";
import PageHero from "@site/components/shared/PageHero";
import StatsGrid from "@site/components/shared/StatsGrid";
import TeamMemberCard from "@site/components/about/TeamMemberCard";
import ValueCard from "@site/components/about/ValueCard";
import {
  Phone as PhoneIcon,
  Calendar,
  Scale,
  Award,
  Users,
  Heart,
  type LucideIcon,
  Loader2,
} from "lucide-react";
import { useAboutContent } from "@site/hooks/useAboutContent";
import { useGlobalPhone } from "@site/contexts/SiteSettingsContext";
import RichText from "@site/components/shared/RichText";

// Icon mapping for values section
const iconMap: Record<string, LucideIcon> = {
  Scale,
  Award,
  Users,
  Heart,
};

export default function AboutUs() {
  const { content, meta, title, publishedAt, updatedAt, isLoading } = useAboutContent();
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

  // Map team members from CMS content
  const teamMembers = content.team.members;

  // Map core values from CMS content with icon components
  const coreValues = content.values.items.map((item) => ({
    icon: iconMap[item.icon] || Scale,
    title: item.title,
    description: item.description,
  }));

  // Map stats from CMS content
  const stats = content.stats.stats;

  // Map why choose us from CMS content
  const whyChooseUs = content.whyChooseUs.items;

  return (
    <Layout>
      <Seo
        title={title || "About Us"}
        meta={meta}
        pageContent={content}
        publishedTime={publishedAt}
        updatedTime={updatedAt}
      />

      <PageHero
        content={content.hero}
        headingTag={content.headingTags?.["hero.h1Title"] || content.headingTags?.["hero.sectionLabel"]}
      />

      <AboutSection
        content={content.story}
        headingTag={content.headingTags?.["story.heading"]}
        credentialsPlacement="below"
      />


      {/* Team Section */}
      {teamMembers.length > 0 && (
      <div className="bg-white pt-[40px] md:pt-[60px] pb-[30px] md:pb-[54px]">
        <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%] lg:w-[85%]">
          <div className="text-center mb-[30px] md:mb-[50px]">
            <div className="mb-[10px]">
              <p className="font-outfit text-[18px] md:text-[24px] leading-tight md:leading-[36px] text-brand-accent">
                {content.team.sectionLabel}
              </p>
            </div>
            <h2 className="font-playfair text-[32px] md:text-[48px] lg:text-[54px] leading-tight md:leading-[54px] text-black">
              {content.team.heading.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  {i < content.team.heading.split("\n").length - 1 && (
                    <br className="hidden md:block" />
                  )}
                </span>
              ))}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={index} {...member} />
            ))}
          </div>
        </div>
      </div>

      )}

      {/* Core Values Section */}
      {coreValues.length > 0 && (
      <div className="bg-brand-dark py-[40px] md:py-[60px]">
        <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%] lg:w-[85%]">
          <div className="text-center mb-[30px] md:mb-[50px]">
            <div className="mb-[10px]">
              <p className="font-outfit text-[18px] md:text-[24px] leading-tight md:leading-[36px] text-brand-accent">
                {content.values.sectionLabel}
              </p>
            </div>
            <h2 className="font-playfair text-[32px] md:text-[48px] lg:text-[54px] leading-tight md:leading-[54px] text-white">
              {content.values.heading}
            </h2>
            {content.values.subtitle && (
              <p className="font-outfit text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] text-white/80 mt-[15px]">
                {content.values.subtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-[5%]">
            {coreValues.map((value, index) => (
              <ValueCard key={index} {...value} />
            ))}
          </div>
        </div>
      </div>

      )}

      {/* Stats Section */}
      {stats.length > 0 && (
      <div className="bg-white py-[30px] md:py-[40px]">
        <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%]">
          <StatsGrid stats={stats} />
        </div>
      </div>

      )}

      {/* Why Choose Us Section */}
      {whyChooseUs.length > 0 && (
      <div className="bg-white pt-[30px] md:pt-[40px] pb-[40px] md:pb-[60px]">
        <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%] lg:w-[80%]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-[8%]">
            {/* Left Side - Heading + Image */}
            <div>
              <div className="mb-[10px]">
                <p className="font-outfit text-[18px] md:text-[24px] leading-tight md:leading-[36px] text-brand-accent">
                  {content.whyChooseUs.sectionLabel}
                </p>
              </div>
              <h2 className="font-playfair text-[32px] md:text-[48px] lg:text-[54px] leading-tight md:leading-[54px] text-black pb-[20px]">
                {content.whyChooseUs.heading}
              </h2>
              <RichText
                html={content.whyChooseUs.description}
                className="font-outfit text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] text-black mb-[30px]"
              />
              {/* Stock image */}
              {content.whyChooseUs.image && (
                <div className="hidden lg:block">
                  <img
                    src={content.whyChooseUs.image}
                    alt={content.whyChooseUs.imageAlt || "Why Choose Us"}
                    className="w-full max-w-[400px] h-auto object-cover"
                    width={400}
                    height={300}
                    loading="lazy"
                  />
                </div>
              )}
            </div>

            {/* Right Side - Features List */}
            <div className="space-y-[20px] md:space-y-[30px]">
              {whyChooseUs.map((feature, index) => (
                <div key={index}>
                  <div className="mb-[15px] md:mb-[20px]">
                    <h3 className="font-outfit text-[22px] md:text-[28px] leading-tight md:leading-[28px] text-black pb-[10px]">
                      {feature.number}. {feature.title}
                    </h3>
                    <RichText
                      html={feature.description}
                      className="font-outfit text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] text-black"
                    />
                  </div>
                  {index < whyChooseUs.length - 1 && (
                    <div className="h-[1px] bg-brand-border/30"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      )}

      {/* Call to Action Section */}
      {content.cta.heading && (
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
              icon={PhoneIcon}
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
      )}
    </Layout>
  );
}
