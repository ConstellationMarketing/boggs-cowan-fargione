import DynamicHeading from "@site/components/shared/DynamicHeading";
import RichText from "@site/components/shared/RichText";

interface ApproachSectionProps {
  heading: string;
  description: string;
  headingTag?: string;
}

export default function ApproachSection({
  heading,
  description,
  headingTag,
}: ApproachSectionProps) {
  if (!heading && !description) {
    return null;
  }

  return (
    <section className="bg-black py-[40px] md:py-[60px]">
      <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%] lg:w-[80%]">
        <div className="mx-auto max-w-[1040px] border border-black/10 bg-white px-[24px] py-[28px] md:px-[48px] md:py-[44px] shadow-[0_18px_60px_rgba(0,0,0,0.24)]">
          {heading ? (
            <DynamicHeading
              tag={headingTag}
              defaultTag="h2"
              className="font-playfair text-[32px] md:text-[44px] lg:text-[48px] leading-tight text-black text-center"
            >
              {heading}
            </DynamicHeading>
          ) : null}
          <div className="mx-auto mt-[16px] mb-[20px] h-[3px] w-[96px] bg-brand-accent md:mt-[18px] md:mb-[24px]" />
          {description ? (
            <RichText
              html={description}
              className="font-outfit text-[16px] md:text-[19px] leading-[28px] md:leading-[34px] text-black/80 [&_p:not(:last-child)]:mb-[18px] md:[&_p:not(:last-child)]:mb-[22px]"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
