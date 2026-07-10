import Layout from "@site/components/layout/Layout";
import Seo from "@site/components/Seo";
import PageHero from "@site/components/shared/PageHero";
import LocationsAreaBlock from "@site/components/blocks/LocationsAreaBlock";
import LocationsMapBlock from "@site/components/blocks/LocationsMapBlock";
import WhyChooseUsSection from "@site/components/home/AwardsSection";
import ContactUsSection from "@site/components/home/ContactUsSection";
import { normalizeSharedHeroContent } from "@site/lib/cms/sharedHero";
import type { PreloadedPageDocument } from "@site/lib/cms/publicLoaders";
import type { PageMeta } from "@site/lib/cms/pageMeta";
import { emptyPageMeta } from "@site/lib/cms/pageMeta";

interface LocationsContent {
  hero?: Record<string, unknown>;
  locationsArea?: {
    sectionLabel?: string;
    primaryHeading?: string;
    surroundingHeading?: string;
    primaryLocations?: Array<{ name: string; link: string }>;
    surroundingLocations?: Array<{ name: string; link: string }>;
  };
  locationsMap?: {
    heading?: string;
    body?: string;
    mapEmbedUrl?: string;
  };
  whyChooseUs?: {
    image?: string;
    imageAlt?: string;
    sectionLabel?: string;
    heading?: string;
    description?: string;
    items?: Array<{ icon: string; title: string; description: string }>;
  };
  contact?: {
    sectionLabel?: string;
    heading?: string;
    description?: string;
  };
}

function isLocationsContent(c: unknown): c is LocationsContent {
  if (!c || typeof c !== "object" || Array.isArray(c)) {
    return false;
  }

  const r = c as Record<string, unknown>;
  return "locationsArea" in r || "hero" in r || "locationsMap" in r;
}

interface LocationsPageViewProps {
  page: PreloadedPageDocument;
}

export default function LocationsPageView({ page }: LocationsPageViewProps) {
  const meta: PageMeta = page.meta || emptyPageMeta;
  const content = isLocationsContent(page.content) ? page.content : ({} as LocationsContent);

  const hero = normalizeSharedHeroContent(content.hero ?? {});
  const area = content.locationsArea;
  const map = content.locationsMap;
  const why = content.whyChooseUs;
  const contact = content.contact;

  return (
    <Layout>
      <Seo
        title={page.title || "Areas We Serve"}
        meta={meta}
        pageContent={page.content}
        publishedTime={page.publishedAt}
        updatedTime={page.updatedAt}
      />

      <PageHero content={hero} underHeader={false} />

      {area ? (
        <LocationsAreaBlock
          block={{
            type: "locations-area",
            sectionLabel: area.sectionLabel,
            primaryHeading: area.primaryHeading || "Primary Locations",
            surroundingHeading: area.surroundingHeading || "Surrounding Communities",
            primaryLocations: area.primaryLocations || [],
            surroundingLocations: area.surroundingLocations || [],
          }}
        />
      ) : null}

      {map ? (
        <LocationsMapBlock
          block={{
            type: "locations-map",
            heading: map.heading || "Serving North Georgia and East Georgia",
            body: map.body || "",
            mapEmbedUrl: map.mapEmbedUrl || "",
          }}
        />
      ) : null}

      {why ? (
        <WhyChooseUsSection
          content={{
            image: why.image || "",
            imageAlt: why.imageAlt || "",
            sectionLabel: why.sectionLabel || "",
            heading: why.heading || "",
            description: why.description || "",
            items: why.items || [],
          }}
        />
      ) : null}

      {contact ? (
        <ContactUsSection
          content={{
            sectionLabel: contact.sectionLabel || "",
            heading: contact.heading || "",
            description: contact.description || "",
          }}
          sectionId="contact"
        />
      ) : null}
    </Layout>
  );
}
