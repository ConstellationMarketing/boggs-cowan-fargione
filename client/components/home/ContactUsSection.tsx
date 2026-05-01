import type { ContactContent } from "@site/lib/cms/homePageTypes";
import RichText from "@site/components/shared/RichText";
import DynamicHeading from "@site/components/shared/DynamicHeading";
import CmsFormRenderer from "@site/components/shared/CmsFormRenderer";

interface ContactUsSectionProps {
  content?: Pick<ContactContent, "sectionLabel" | "heading" | "description">;
  headingTag?: string;
  sectionId?: string;
}

export default function ContactUsSection({ content, headingTag, sectionId }: ContactUsSectionProps) {
  if (!content || (!content.heading && !content.sectionLabel && !content.description)) {
    return null;
  }

  const data = content;

  return (
    <section id={sectionId} className="bg-brand-dark py-[48px] md:py-[80px]">
      <div className="mx-auto w-[92%] max-w-[1040px]">
        <div className="mx-auto max-w-[760px] text-center">
          {data.sectionLabel ? (
            <DynamicHeading
              tag={headingTag}
              defaultTag="h2"
              className="mb-3 font-inter text-[18px] font-semibold uppercase tracking-[0.08em] text-brand-accent md:text-[24px]"
            >
              {data.sectionLabel}
            </DynamicHeading>
          ) : null}

          {data.heading ? (
            <p className="font-playfair text-[34px] leading-[1.08] text-white md:text-[52px]">
              {data.heading}
            </p>
          ) : null}

          {data.description ? (
            <RichText
              html={data.description}
              className="mt-3 font-inter text-[15px] leading-[1.55] text-white [&_p]:my-0 [&_p+p]:mt-4 md:text-[17px] md:leading-[1.6]"
            />
          ) : null}
        </div>

        <div className="mx-auto mt-8 max-w-[900px] md:mt-10">
          <CmsFormRenderer
            formId="contact"
            variant="contactSection"
            className="space-y-4 md:space-y-5"
          />
        </div>
      </div>
    </section>
  );
}
