import Seo from "@site/components/Seo";
import Layout from "@site/components/layout/Layout";
import ContactUsSection from "@site/components/home/ContactUsSection";
import PageHero from "@site/components/shared/PageHero";
import { useContactContent } from "@site/hooks/useContactContent";
import { Loader2 } from "lucide-react";

export default function ContactPage() {
  const { content, meta, title, publishedAt, updatedAt, isLoading } = useContactContent();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Seo
        title={title || "Contact Us"}
        meta={meta}
        pageContent={content}
        publishedTime={publishedAt}
        updatedTime={updatedAt}
      />

      <PageHero
        content={content.hero}
        headingTag={content.headingTags?.["hero.h1Title"] || content.headingTags?.["hero.sectionLabel"]}
        compactDesktop
        hideMobileImage
        compactMobile
      />

      <ContactUsSection
        content={content.form}
        headingTag={content.headingTags?.["form.sectionLabel"] || content.headingTags?.["form.heading"]}
        sectionId="contact"
      />
    </Layout>
  );
}
