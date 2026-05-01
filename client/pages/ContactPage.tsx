import Seo from "@site/components/Seo";
import Layout from "@site/components/layout/Layout";
import ContactForm from "@site/components/home/ContactForm";
import PageHero from "@site/components/shared/PageHero";
import DynamicHeading from "@site/components/shared/DynamicHeading";
import RichText from "@site/components/shared/RichText";
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
      />

      <section className="bg-brand-dark py-[40px] md:py-[60px]">
        <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%] lg:w-[80%]">
          <div className="mx-auto max-w-[920px]">
            <div className="mb-[20px] md:mb-[30px] text-center">
              <DynamicHeading
                tag={content.headingTags?.["form.heading"]}
                defaultTag="h2"
                className="font-playfair text-[32px] md:text-[40px] leading-tight text-white pb-[10px]"
              >
                {content.form.heading}
              </DynamicHeading>
              {content.form.subtext && (
                <RichText
                  html={content.form.subtext}
                  className="mx-auto max-w-[760px] font-outfit text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] text-white/80"
                />
              )}
            </div>

            <ContactForm />
          </div>
        </div>
      </section>
    </Layout>
  );
}
