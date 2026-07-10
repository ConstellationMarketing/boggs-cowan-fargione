import type { ContentBlock } from "@site/lib/blocks";
import ContactUsSection from "@site/components/home/ContactUsSection";

interface ContactFormBlockProps {
  block: Extract<ContentBlock, { type: "contact-form" }>;
}

export default function ContactFormBlock({ block }: ContactFormBlockProps) {
  return (
    <ContactUsSection
      content={{
        sectionLabel: block.sectionLabel || "",
        heading: block.heading || "",
        description: block.description || "",
      }}
      sectionId="contact"
    />
  );
}
