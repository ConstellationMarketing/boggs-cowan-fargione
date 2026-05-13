import type { SharedHeroContent } from "@site/lib/cms/sharedHero";
import DynamicHeading from "@site/components/shared/DynamicHeading";
import HeroContactActions from "@site/components/shared/HeroContactActions";
import RichText from "@site/components/shared/RichText";

interface PageHeroProps {
  content: SharedHeroContent;
  headingTag?: string;
  underHeader?: boolean;
  awardLogos?: Array<{ src: string; alt: string }>;
}

function renderHeadline(content: SharedHeroContent) {
  if (!content.headline && !content.highlightedText) {
    return null;
  }

  if (content.highlightedText && content.headline.includes(content.highlightedText)) {
    const startIndex = content.headline.indexOf(content.highlightedText);
    const before = content.headline.slice(0, startIndex);
    const match = content.highlightedText;
    const after = content.headline.slice(startIndex + match.length);

    return (
      <>
        {before}
        <span className="text-brand-accent">{match}</span>
        {after}
      </>
    );
  }

  if (content.highlightedText && content.headline) {
    return (
      <>
        <span className="text-brand-accent">{content.highlightedText}</span>
        <br />
        {content.headline}
      </>
    );
  }

  if (content.highlightedText) {
    return <span className="text-brand-accent">{content.highlightedText}</span>;
  }

  return content.headline;
}

export default function PageHero({
  content,
  headingTag,
  underHeader = true,
  awardLogos = [],
}: PageHeroProps) {
  const heroImage = content.heroImage?.trim() || "";

  return (
    <div
      className={`relative overflow-hidden bg-brand-dark flex flex-col ${underHeader ? "-mt-[10rem] min-h-[80vh]" : ""}`}
    >
      {content.backgroundImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.95) 40%, rgba(0,0,0,0.85) 65%, rgba(0,0,0,0.60) 100%), url(${content.backgroundImage})`,
          }}
        />
      ) : null}

      <div className="relative z-10 max-w-[2560px] mx-auto w-[95%] flex-1 flex flex-col">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-[3%] flex-1">
          <div className={`lg:w-[65.667%] flex flex-col justify-center pb-[36px] md:pb-[48px] ${underHeader ? "pt-[12.5rem] md:pt-[13.5rem]" : "pt-[3rem] md:pt-[4rem]"}`}>
            <div className="mb-[20px] md:mb-[24px]">
              {content.h1Title ? (
                <DynamicHeading
                  tag={headingTag}
                  defaultTag="h1"
                  className="font-outfit text-[18px] md:text-[20px] font-medium tracking-wider uppercase text-accent mb-0 leading-none"
                >
                  {content.h1Title}
                </DynamicHeading>
              ) : null}

              <div className={`relative ${content.h1Title ? "mt-[8px] md:mt-[12px]" : ""}`}>
                <p className="font-playfair text-[clamp(2.5rem,7vw,68.8px)] font-light leading-[1.2] text-white text-left">
                  {renderHeadline(content)}
                </p>
              </div>

              {content.description ? (
                <RichText
                  html={content.description}
                  className="mt-[12px] max-w-[720px] font-inter text-[15px] md:text-[18px] leading-[24px] md:leading-[30px] text-white/85"
                />
              ) : null}
            </div>

            <HeroContactActions
              consultationButtonText={content.consultationButtonText}
              consultationButtonLink={content.consultationButtonLink || "/contact/"}
              className="max-w-[720px]"
            />

            {awardLogos.length ? (
              <div className="mt-5 max-w-[720px]">
                <p className="font-outfit text-[11px] md:text-[12px] tracking-widest uppercase text-white/50 mb-3">
                  Awards &amp; Recognition
                </p>
                <div className="overflow-x-auto pb-1">
                  <div className="flex flex-nowrap items-center gap-2 md:gap-3 pr-1">
                    {awardLogos.map((logo, index) => (
                      <div
                        key={`${logo.src}-${index}`}
                        className="flex shrink-0 items-center justify-center bg-white p-2 md:p-3 h-[64px] w-[96px] sm:h-[76px] sm:w-[114px] md:h-[84px] md:w-[128px]"
                      >
                        <img
                          src={logo.src}
                          alt={logo.alt}
                          loading="lazy"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {heroImage ? (
            <div className="mt-auto flex w-full justify-center px-4 pb-4 sm:px-6 sm:pb-6 lg:hidden">
              <img
                src={heroImage}
                alt={content.heroImageAlt || "Hero"}
                className="block h-auto max-h-[320px] w-full max-w-[520px] object-contain object-bottom sm:max-h-[420px]"
              />
            </div>
          ) : null}

          <div className={`hidden lg:block lg:w-[31.3333%] self-stretch ${underHeader ? "pt-[10rem]" : "pt-[3rem]"}`}>
            {heroImage ? (
              <img
                src={heroImage}
                alt={content.heroImageAlt || "Hero"}
                className="block w-full h-full object-cover object-top"
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
