import type { ContentBlock } from "@site/lib/blocks";
import WhyChooseUsSection from "@site/components/home/AwardsSection";

interface WhyChooseUsBlockProps {
  block: Extract<ContentBlock, { type: "why-choose-us" }>;
}

export default function WhyChooseUsBlock({ block }: WhyChooseUsBlockProps) {
  return (
    <WhyChooseUsSection
      content={{
        image: block.image || "",
        imageAlt: block.imageAlt || "",
        sectionLabel: block.sectionLabel || "",
        heading: block.heading || "",
        description: block.description || "",
        items: Array.isArray(block.items) ? block.items : [],
      }}
    />
  );
}
