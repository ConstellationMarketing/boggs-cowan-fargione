import type {
  TemplateType,
  TransformedPracticePage,
  TransformedBlogPost,
  TransformedRecord,
  MappingConfig,
  SourceRecord,
} from "./types";
import { applyMapping, collectRepeaterData, slugify } from "./fieldMapping";
import {
  DEFAULT_PRACTICE_HERO_IMAGE,
  createPracticeAreaContentSection,
  defaultPracticeAreaPageContent,
  normalizePracticeAreaContentSections,
} from "@site/lib/cms/practiceAreaPageTypes";
import {
  extractFaqFromHtmlSections,
  mergeShortHtmlSections,
  resolveImportPublishDate,
  syncPracticeSourceImageFields,
} from "./preparer";

/**
 * Transform an array of mapped records into the exact CMS schema shapes
 * ready for server submission.
 */
export function transformRecords(
  sourceRecords: SourceRecord[],
  mappingConfig: MappingConfig,
  templateType: TemplateType,
): TransformedRecord[] {
  const importTimestamp = new Date().toISOString();

  return sourceRecords.map((source) => {
    const mapped =
      templateType === "practice"
        ? syncPracticeSourceImageFields(applyMapping(source, mappingConfig))
        : applyMapping(source, mappingConfig);

    if (templateType === "practice") {
      return transformPracticePage(mapped, source, mappingConfig, importTimestamp);
    }
    return transformBlogPost(mapped, importTimestamp);
  });
}

// ---------------------------------------------------------------------------
// Practice Area Page Transformer
// ---------------------------------------------------------------------------

function transformPracticePage(
  mapped: Record<string, unknown>,
  sourceRecord: SourceRecord,
  config: MappingConfig,
  importTimestamp: string,
): TransformedPracticePage {
  const syncedMapped = syncPracticeSourceImageFields(mapped);
  const title = String(mapped["title"] ?? "Untitled");
  const rawSlug = mapped["url_slug"]
    ? String(mapped["url_slug"])
    : slugify(title);
  const urlPath = `/${rawSlug}/`;
  const publishDate = resolveImportPublishDate(mapped["published_at"], importTimestamp);

  // Build content sections from repeater data or mapped arrays
  let contentSections = collectRepeaterData(
    sourceRecord,
    "practice",
    "contentSections",
    config,
  );

  // If no repeater data found, check if there's a single body mapped
  if (contentSections.length === 0 && mapped["contentSections.body"]) {
    contentSections = [
      createPracticeAreaContentSection(0, {
        body: ensureHtml(String(mapped["contentSections.body"])),
        image: mapped["contentSections.image"]
          ? String(mapped["contentSections.image"])
          : "",
        imageAlt: mapped["contentSections.imageAlt"]
          ? String(mapped["contentSections.imageAlt"])
          : "",
      }) as unknown as Record<string, unknown>,
    ];
  }

  const { sections: nonFaqSectionBodies, faqItems: sectionFaqItems } = extractFaqFromHtmlSections(
    contentSections.map((section) => ensureHtml(String(section.body ?? ""))),
  );
  const mergedSectionBodies = mergeShortHtmlSections(nonFaqSectionBodies);

  // Normalize content sections
  let normalizedSections = normalizePracticeAreaContentSections(
    mergedSectionBodies.map((body, index) => ({
      ...(contentSections[index] ?? {}),
      body,
      image: String(contentSections[index]?.image ?? ""),
      imageAlt: String(contentSections[index]?.imageAlt ?? ""),
      imagePosition: contentSections[index]?.imagePosition as "left" | "right" | undefined,
      showCTAs:
        typeof contentSections[index]?.showCTAs === "boolean" ? contentSections[index]?.showCTAs as boolean : undefined,
    })),
  );

  const heroBackgroundImage = syncedMapped["hero.backgroundImage"]
    ? String(syncedMapped["hero.backgroundImage"])
    : syncedMapped["featured_image"]
      ? String(syncedMapped["featured_image"])
      : syncedMapped["og_image"]
        ? String(syncedMapped["og_image"])
        : "";

  // Build FAQ items
  let faqItems = collectRepeaterData(
    sourceRecord,
    "practice",
    "faq.items",
    config,
  );

  if (sectionFaqItems.length > 0) {
    faqItems = [...faqItems, ...sectionFaqItems];
  }

  // Normalize FAQ items
  const normalizedFaq = faqItems.map((item) => ({
    question: String(item.question ?? ""),
    answer: ensureHtml(String(item.answer ?? "")),
  }));

  const metaTitle = mapped["meta_title"] ? String(mapped["meta_title"]) : undefined;
  const metaDescription = mapped["meta_description"]
    ? String(mapped["meta_description"])
    : undefined;
  const socialImage = syncedMapped["og_image"]
    ? String(syncedMapped["og_image"])
    : heroBackgroundImage || null;

  // Build the content object matching PracticeAreaPageContent
  const content: Record<string, unknown> = {
    hero: {
      h1Title: mapped["hero.h1Title"]
        ? String(mapped["hero.h1Title"])
        : mapped["hero.sectionLabel"]
          ? String(mapped["hero.sectionLabel"])
          : title,
      headline: mapped["hero.headline"]
        ? String(mapped["hero.headline"])
        : mapped["hero.tagline"]
          ? String(mapped["hero.tagline"])
          : defaultPracticeAreaPageContent.hero.headline,
      highlightedText: mapped["hero.highlightedText"]
        ? String(mapped["hero.highlightedText"])
        : defaultPracticeAreaPageContent.hero.highlightedText,
      description: mapped["hero.description"]
        ? ensureHtml(String(mapped["hero.description"]))
        : defaultPracticeAreaPageContent.hero.description,
      backgroundImage: heroBackgroundImage,
      heroImage: mapped["hero.heroImage"]
        ? String(mapped["hero.heroImage"])
        : DEFAULT_PRACTICE_HERO_IMAGE,
      heroImageAlt: mapped["hero.h1Title"]
        ? String(mapped["hero.h1Title"])
        : mapped["hero.sectionLabel"]
          ? String(mapped["hero.sectionLabel"])
          : title,
      consultationButtonText: mapped["hero.consultationButtonText"]
        ? String(mapped["hero.consultationButtonText"])
        : defaultPracticeAreaPageContent.hero.consultationButtonText,
      consultationButtonLink: mapped["hero.consultationButtonLink"]
        ? String(mapped["hero.consultationButtonLink"])
        : defaultPracticeAreaPageContent.hero.consultationButtonLink,
    },
    socialProof: {
      mode: "awards" as const,
      testimonials: [],
      awards: { logos: [] },
    },
    contentSections:
      normalizedSections.length > 0
        ? normalizedSections
        : defaultPracticeAreaPageContent.contentSections,
    faq: {
      enabled: normalizedFaq.length > 0 || !!mapped["faq.heading"],
      heading: mapped["faq.heading"]
        ? String(mapped["faq.heading"])
        : defaultPracticeAreaPageContent.faq.heading,
      description: mapped["faq.description"]
        ? String(mapped["faq.description"])
        : defaultPracticeAreaPageContent.faq.description,
      items:
        normalizedFaq.length > 0
          ? normalizedFaq
          : defaultPracticeAreaPageContent.faq.items,
    },
  };

  return {
    title,
    url_path: urlPath,
    page_type: "practice",
    content,
    meta_title: metaTitle,
    meta_description: metaDescription,
    canonical_url: null,
    og_title: metaTitle ?? null,
    og_description: metaDescription ?? null,
    og_image: socialImage,
    noindex: false,
    schema_type: null,
    schema_data: null,
    published_at: publishDate.publishedAt,
    publish_date_source: publishDate.source,
    status: "draft",
  };
}

// ---------------------------------------------------------------------------
// Blog Post Transformer
// ---------------------------------------------------------------------------

function transformBlogPost(
  mapped: Record<string, unknown>,
  importTimestamp: string,
): TransformedBlogPost {
  const title = String(mapped["title"] ?? "Untitled");
  const slug = mapped["slug"] ? String(mapped["slug"]) : slugify(title);
  const publishDate = resolveImportPublishDate(mapped["published_at"], importTimestamp);

  return {
    title,
    slug,
    excerpt: mapped["excerpt"] ? String(mapped["excerpt"]) : undefined,
    featured_image: mapped["featured_image"]
      ? String(mapped["featured_image"])
      : undefined,
    category: mapped["category"] ? String(mapped["category"]) : undefined,
    category_id: null,
    content: [],
    body: mapped["body"] ? ensureHtml(String(mapped["body"])) : undefined,
    meta_title: mapped["meta_title"] ? String(mapped["meta_title"]) : undefined,
    meta_description: mapped["meta_description"]
      ? String(mapped["meta_description"])
      : undefined,
    canonical_url: null,
    og_title: null,
    og_description: null,
    og_image: mapped["og_image"] ? String(mapped["og_image"]) : null,
    noindex: false,
    published_at: publishDate.publishedAt,
    publish_date_source: publishDate.source,
    status: "draft",
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Ensure a value is wrapped in HTML tags if it's plain text.
 */
function ensureHtml(text: string): string {
  if (!text || text.trim() === "") return "";
  // Already has HTML tags
  if (/<[a-z][\s\S]*>/i.test(text)) return text;
  // Wrap plain text in paragraphs
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (paragraphs.length === 0) return `<p>${text}</p>`;
  return paragraphs.map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("");
}
