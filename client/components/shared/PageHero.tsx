import { MessageSquare, Phone } from "lucide-react";
import type { SharedHeroContent } from "@site/lib/cms/sharedHero";
import { useGlobalPhone } from "@site/contexts/SiteSettingsContext";
import DynamicHeading from "@site/components/shared/DynamicHeading";
import RichText from "@site/components/shared/RichText";

interface PageHeroProps {
  content: SharedHeroContent;
  headingTag?: string;
  underHeader?: boolean;
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
}: PageHeroProps) {
  const { phoneNumber, phoneDisplay, phoneLabel } = useGlobalPhone();

  return (
    <div
      className={`relative overflow-hidden bg-brand-dark flex flex-col ${underHeader ? "-mt-[7rem] min-h-[80vh]" : ""}`}
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
          <div className={`lg:w-[65.667%] flex flex-col justify-center pb-[36px] md:pb-[48px] ${underHeader ? "pt-[9.5rem] md:pt-[10.5rem]" : "pt-[3rem] md:pt-[4rem]"}`}>
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

            <div className={`grid w-full max-w-[720px] gap-3 ${content.consultationButtonText ? "grid-cols-2" : "grid-cols-1"}`}>
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

              {content.consultationButtonText ? (
                <a
                  href={content.consultationButtonLink || "/contact"}
                  className="bg-white hover:bg-gray-100 transition-all duration-300 p-[6px] group"
                >
                  <div className="flex items-center gap-3 h-full">
                    <div className="bg-accent p-[10px] flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1 flex items-center">
                      <p className="font-inter text-[14px] md:text-[22px] text-accent leading-tight font-semibold">
                        {content.consultationButtonText}
                      </p>
                    </div>
                  </div>
                </a>
              ) : null}
            </div>
          </div>

          <div className={`hidden lg:block lg:w-[31.3333%] self-stretch ${underHeader ? "pt-[7rem]" : "pt-[3rem]"}`}>
            {content.heroImage ? (
              <img
                src={content.heroImage}
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
