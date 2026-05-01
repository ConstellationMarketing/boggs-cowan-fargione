import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqContent, FaqItem } from "@site/lib/cms/homePageTypes";
import RichText from "@site/components/shared/RichText";
import { triggerDniRefreshAfterReveal } from "@site/components/layout/dniReveal";

interface FaqSectionProps {
  content?: FaqContent;
}

export default function FaqSection({ content }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState(-1);

  // Guard: if no FAQ items, don't render
  if (!content || !content.items || content.items.length === 0) {
    return null;
  }

  const data = content;
  const faqs = data.items;

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
    triggerDniRefreshAfterReveal();
  };

  return (
    <div className="bg-white pt-[30px] md:pt-[54px]">
      {/* Header Section */}
      <div className="max-w-[1080px] mx-auto w-[95%] md:w-[85%] lg:w-[80%] py-[20px] md:py-[27px]">
        <div className="text-center">
          {data.heading && (
            <h2 className="font-playfair text-[32px] md:text-[48px] lg:text-[54px] leading-tight md:leading-[54px] text-black pb-[10px]">
              {data.heading}
            </h2>
          )}
          {data.description && (
            <RichText
              html={data.description}
              className="font-inter text-[16px] md:text-[19px] leading-[1.75] text-black/80 text-center [&_p]:my-0 [&_p+p]:mt-4"
            />
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-[1600px] mx-auto w-[95%] md:w-[85%] lg:w-[80%] py-[20px] md:py-[27px] flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-[4%]">
        {/* Left Side - Image */}
        {data.videoThumbnail && (
          <div className="lg:w-[42%]">
            <img
              src={data.videoThumbnail}
              alt={data.videoThumbnailAlt || "Frequently Asked Questions"}
              className="w-full h-auto object-cover"
              width={720}
              height={480}
              loading="lazy"
            />
          </div>
        )}

        {/* Right Side - Custom Accordion */}
        <div className={`${data.videoThumbnail ? "lg:w-[54%]" : "w-full"}`}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-white shadow-[0_10px_24px_rgba(0,0,0,0.06)] border-b-2 border-brand-accent ${
                index < faqs.length - 1 ? "mb-4" : ""
              }`}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="flex w-full cursor-pointer items-center justify-between px-5 py-5 text-left font-inter text-[18px] leading-[1.45] text-black md:px-6 md:py-6 md:text-[19px]"
              >
                <span className="pr-6 font-medium">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 text-brand-accent transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <RichText
                  html={faq.answer}
                  className="border-t border-black/5 px-5 pb-5 pt-1 font-inter text-[16px] leading-[1.7] text-black/80 [&_p]:my-0 [&_p+p]:mt-4 md:px-6 md:pb-6 md:text-[18px]"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
