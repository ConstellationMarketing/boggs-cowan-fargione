import RichText from "@site/components/shared/RichText";
import type { PracticeAreasIntroContent } from "@site/lib/cms/homePageTypes";

interface PracticeAreasSectionProps {
  content?: PracticeAreasIntroContent;
}

export default function PracticeAreasSection({ content }: PracticeAreasSectionProps) {
  if (!content || (!content.sectionLabel && !content.heading && !content.description)) {
    return null;
  }

  return (
    <section className="bg-brand-dark py-[30px] md:py-[44px]">
      <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%] lg:w-[85%]">
        <div className="mx-auto max-w-[900px] text-center">
          {content.sectionLabel && (
            <h2 className="font-playfair text-[32px] md:text-[44px] lg:text-[54px] leading-tight text-white">
              {content.sectionLabel}
            </h2>
          )}

          {content.heading && (
            <p className="mt-[12px] font-inter text-[16px] md:text-[20px] leading-[26px] md:leading-[32px] text-white/90">
              {content.heading}
            </p>
          )}

          {content.description && (
            <RichText
              html={content.description}
              className="mt-[16px] font-inter text-[15px] md:text-[18px] leading-[24px] md:leading-[30px] text-white/80 [&_p+p]:mt-4"
            />
          )}
        </div>
      </div>
    </section>
  );
}
