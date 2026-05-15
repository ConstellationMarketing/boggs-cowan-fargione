import type { PracticeAreaContentSectionItem } from "@site/lib/cms/practiceAreaPageTypes";
import HeroContactActions from "@site/components/shared/HeroContactActions";
import RichText from "@site/components/shared/RichText";

interface PracticeAreaContentSectionProps {
  section: PracticeAreaContentSectionItem;
  index: number;
}

export default function PracticeAreaContentSection({
  section,
  index,
}: PracticeAreaContentSectionProps) {
  const imageOnLeft = section.imagePosition === "left";
  const showCTAs = section.showCTAs !== false;
  const isDarkSection = index % 2 !== 0;

  return (
    <div className={`py-[40px] md:py-[60px] ${isDarkSection ? "bg-black" : "bg-white"}`}>
      <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%] lg:w-[85%]">
        <div
          className={`flex flex-col items-center ${imageOnLeft ? "lg:flex-row-reverse" : "lg:flex-row"} gap-8 lg:items-start lg:gap-[5%]`}
        >
          {/* Rich Text Content - larger column (full width when no sidebar) */}
          <div className={showCTAs || section.image ? "w-full lg:w-[60%]" : "w-full"}>
            <RichText
              html={section.body}
              className={`prose prose-lg max-w-none font-inter text-[16px] leading-[26px] text-center md:text-[18px] md:leading-[30px] lg:text-left
                ${isDarkSection ? "text-white [&_h2]:text-white [&_h3]:text-white [&_strong]:text-white [&_a]:text-white" : "text-black/90 [&_h2]:text-black [&_h3]:text-black"}
                [&_h2]:text-center [&_h2]:font-playfair [&_h2]:text-[32px] [&_h2]:leading-tight [&_h2]:mb-4 [&_h2]:md:text-[48px] [&_h2]:md:leading-[54px] lg:[&_h2]:text-left [&_h2]:lg:text-[54px]
                [&_h3]:text-center [&_h3]:font-playfair [&_h3]:text-[22px] [&_h3]:leading-tight [&_h3]:mb-3 [&_h3]:md:text-[28px] lg:[&_h3]:text-left
                [&_p]:mb-4 [&_ul]:mb-4 [&_ol]:mb-4 [&_li]:mb-1 [&_ul]:text-left [&_ol]:text-left`}
            />
          </div>

          {/* Image + CTAs - smaller column (hidden entirely when no image and no CTAs) */}
          {(showCTAs || section.image) && (
            <div className="flex w-full flex-col items-center lg:w-[35%] lg:items-stretch">
              {section.image && (
                <img
                  src={section.image}
                  alt={section.imageAlt || ""}
                  className="mb-6 w-full h-auto rounded-xl object-cover"
                  loading="lazy"
                />
              )}

              {showCTAs && (
                <HeroContactActions
                  consultationButtonText="Free Consultation"
                  consultationButtonLink="/contact/"
                  stacked
                  className="mx-auto max-w-[340px] lg:mx-0"
                  consultationButtonClassName="border border-accent"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
