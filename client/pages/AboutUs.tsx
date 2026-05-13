import Seo from "@site/components/Seo";
import Layout from "@site/components/layout/Layout";
import AboutSection from "@site/components/home/AboutSection";
import WhyChooseUsSection from "@site/components/home/AwardsSection";
import ApproachSection from "@site/components/shared/ApproachSection";
import CallBox from "@site/components/shared/CallBox";
import PageHero from "@site/components/shared/PageHero";
import SectionTransition from "@site/components/shared/SectionTransition";
import TeamMemberCard from "@site/components/about/TeamMemberCard";
import {
  Phone as PhoneIcon,
  Calendar,
  Loader2,
} from "lucide-react";
import { useAboutContent } from "@site/hooks/useAboutContent";
import { useHomeContent } from "@site/hooks/useHomeContent";
import { useGlobalPhone } from "@site/contexts/SiteSettingsContext";
import RichText from "@site/components/shared/RichText";

const TEAM_AVATAR_BACKGROUNDS = ["#E7E0D3", "#D9E4EC", "#E8D9E6"];

function createBlankAvatar(index: number) {
  const background = TEAM_AVATAR_BACKGROUNDS[index % TEAM_AVATAR_BACKGROUNDS.length];
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" fill="none">
      <rect width="400" height="500" fill="${background}" />
      <circle cx="200" cy="170" r="74" fill="#F7F4EE" />
      <path d="M110 500V420C110 356 150 320 200 320C250 320 290 356 290 420V500H110Z" fill="#F7F4EE" />
      <circle cx="200" cy="170" r="74" stroke="#D1C7B7" stroke-width="8" />
      <path d="M110 500V420C110 356 150 320 200 320C250 320 290 356 290 420V500H110Z" stroke="#D1C7B7" stroke-width="8" />
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export default function AboutUs() {
  const { content, meta, title, publishedAt, updatedAt, isLoading } = useAboutContent();
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

  // Use temporary placeholder avatars on the About page until real team photos are available
  const teamMembers = content.team.members.map((member, index) => ({
    ...member,
    image: createBlankAvatar(index),
    imageAlt: member.imageAlt || `${member.name} placeholder avatar`,
  }));

  const hasApproachSection = Boolean(
    content.approach.heading.trim() || content.approach.description.trim(),
  );


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
        contentAlignment="center"
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={index} {...member} />
            ))}
          </div>
        </div>
      </div>

      )}

      {/* Our Approach Section */}
      {hasApproachSection && (
        <>
          {/* light → dark: team (white) → approach (black) */}
          <SectionTransition direction="light-to-dark" />
          <ApproachSection
            heading={content.approach.heading}
            description={content.approach.description}
            headingTag={content.headingTags?.["approach.heading"]}
          />
          {/* dark → light: approach (black) → awards (white) */}
          <SectionTransition direction="dark-to-light" />
        </>
      )}

      <WhyChooseUsSection
        content={homeContent.whyChooseUs}
        headingTag={homeContent.headingTags?.["whyChooseUs.sectionLabel"]}
      />

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
