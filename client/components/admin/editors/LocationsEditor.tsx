import { Section, ArrayEditor, ImageField, RichTextField, Input, Label, Textarea } from "./EditorShared";

interface LocationItem {
  name: string;
  link: string;
}

interface WhyChooseUsItem {
  icon: string;
  title: string;
  description: string;
}

interface LocationsPageContent {
  hero: {
    h1Title: string;
    headline: string;
    highlightedText: string;
    description: string;
    backgroundImage: string;
    heroImage: string;
    heroImageAlt: string;
    consultationButtonText: string;
    consultationButtonLink: string;
  };
  locationsArea: {
    sectionLabel: string;
    primaryHeading: string;
    surroundingHeading: string;
    primaryLocations: LocationItem[];
    surroundingLocations: LocationItem[];
  };
  locationsMap: {
    heading: string;
    body: string;
    mapEmbedUrl: string;
  };
  whyChooseUs: {
    image: string;
    imageAlt: string;
    sectionLabel: string;
    heading: string;
    description: string;
    items: WhyChooseUsItem[];
  };
  contact: {
    sectionLabel: string;
    heading: string;
    description: string;
  };
}

const defaultContent: LocationsPageContent = {
  hero: {
    h1Title: "Areas We Serve in Georgia",
    headline: "Straightforward advice. Trial-ready representation. Real help when it matters most.",
    highlightedText: "",
    description: "",
    backgroundImage: "",
    heroImage: "",
    heroImageAlt: "",
    consultationButtonText: "Free Consultation",
    consultationButtonLink: "/contact/",
  },
  locationsArea: {
    sectionLabel: "Where We Practice",
    primaryHeading: "Primary Locations",
    surroundingHeading: "Surrounding Communities",
    primaryLocations: [
      { name: "Athens, GA", link: "/athens-georgia-lawyer/" },
      { name: "Commerce, GA", link: "/commerce-georgia-lawyer/" },
      { name: "Elberton, GA", link: "/elberton-georgia-lawyer/" },
      { name: "Franklin Springs, GA", link: "/franklin-springs-georgia-lawyer/" },
      { name: "Gwinnett County, GA", link: "/gwinnett-georgia-lawyer/" },
      { name: "Lawrenceville, GA", link: "/lawrenceville-georgia-lawyer/" },
      { name: "Madison, GA", link: "/madison-georgia-lawyer/" },
      { name: "Monroe, GA", link: "/monroe-georgia-lawyer/" },
      { name: "Royston, GA", link: "/royston-georgia-lawyer/" },
      { name: "Watkinsville, GA", link: "/watkinsville-georgia-lawyer/" },
      { name: "Winder, GA", link: "/winder-georgia-lawyer/" },
    ],
    surroundingLocations: [
      { name: "Atlanta, GA", link: "" },
      { name: "Macon, GA", link: "" },
      { name: "Conyers, GA", link: "" },
      { name: "Covington, GA", link: "" },
      { name: "Loganville, GA", link: "" },
    ],
  },
  locationsMap: {
    heading: "Serving North Georgia and East Georgia",
    body: "We focus on the communities where people need real legal help, not big promises or confusing processes. If you're in or around these areas, we're ready to step in.",
    mapEmbedUrl: "",
  },
  whyChooseUs: {
    image: "",
    imageAlt: "",
    sectionLabel: "Why Choose Us",
    heading: "",
    description: "",
    items: [],
  },
  contact: {
    sectionLabel: "Get In Touch",
    heading: "Ready to Talk? We're Here.",
    description: "",
  },
};

function mergeWithDefaults(raw: unknown): LocationsPageContent {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return defaultContent;
  }

  const r = raw as Record<string, unknown>;

  const hero = typeof r.hero === "object" && r.hero && !Array.isArray(r.hero)
    ? { ...defaultContent.hero, ...(r.hero as object) }
    : defaultContent.hero;

  const locationsArea = typeof r.locationsArea === "object" && r.locationsArea && !Array.isArray(r.locationsArea)
    ? { ...defaultContent.locationsArea, ...(r.locationsArea as object) }
    : defaultContent.locationsArea;

  const locationsMap = typeof r.locationsMap === "object" && r.locationsMap && !Array.isArray(r.locationsMap)
    ? { ...defaultContent.locationsMap, ...(r.locationsMap as object) }
    : defaultContent.locationsMap;

  const whyChooseUs = typeof r.whyChooseUs === "object" && r.whyChooseUs && !Array.isArray(r.whyChooseUs)
    ? { ...defaultContent.whyChooseUs, ...(r.whyChooseUs as object) }
    : defaultContent.whyChooseUs;

  const contact = typeof r.contact === "object" && r.contact && !Array.isArray(r.contact)
    ? { ...defaultContent.contact, ...(r.contact as object) }
    : defaultContent.contact;

  return { hero, locationsArea, locationsMap, whyChooseUs, contact };
}

interface Props {
  content: unknown;
  onChange: (c: unknown) => void;
}

export default function LocationsEditor({ content, onChange }: Props) {
  const data = mergeWithDefaults(content);

  const update = <K extends keyof LocationsPageContent>(key: K, value: LocationsPageContent[K]) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <Section title="Hero Section">
        <div className="grid gap-4">
          <div>
            <Label>H1 Title (appears above headline in green)</Label>
            <Input
              value={data.hero.h1Title}
              onChange={(e) => update("hero", { ...data.hero, h1Title: e.target.value })}
            />
          </div>
          <div>
            <Label>Full Headline</Label>
            <Input
              value={data.hero.headline}
              onChange={(e) => update("hero", { ...data.hero, headline: e.target.value })}
            />
          </div>
          <div>
            <Label>Highlighted Text</Label>
            <Input
              value={data.hero.highlightedText}
              onChange={(e) => update("hero", { ...data.hero, highlightedText: e.target.value })}
              placeholder="Exact portion of headline to highlight in green"
            />
          </div>
          <div>
            <Label>Hero Description</Label>
            <Textarea
              value={data.hero.description}
              onChange={(e) => update("hero", { ...data.hero, description: e.target.value })}
              rows={3}
              placeholder="Short supporting text shown under the headline"
            />
          </div>
          <ImageField
            label="Hero Background Image"
            value={data.hero.backgroundImage}
            onChange={(url) => update("hero", { ...data.hero, backgroundImage: url })}
            folder="hero"
          />
          <ImageField
            label="Hero Side Image"
            value={data.hero.heroImage}
            onChange={(url) => update("hero", { ...data.hero, heroImage: url })}
            altValue={data.hero.heroImageAlt}
            onChangeWithAlt={(heroImage, heroImageAlt) =>
              update("hero", { ...data.hero, heroImage, heroImageAlt })
            }
            folder="hero"
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Button Text</Label>
              <Input
                value={data.hero.consultationButtonText}
                onChange={(e) => update("hero", { ...data.hero, consultationButtonText: e.target.value })}
              />
            </div>
            <div>
              <Label>Button Link</Label>
              <Input
                value={data.hero.consultationButtonLink}
                onChange={(e) => update("hero", { ...data.hero, consultationButtonLink: e.target.value })}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Areas Served */}
      <Section title="Areas Served">
        <div className="grid gap-4">
          <div>
            <Label>Section Label (small text above heading)</Label>
            <Input
              value={data.locationsArea.sectionLabel}
              onChange={(e) =>
                update("locationsArea", { ...data.locationsArea, sectionLabel: e.target.value })
              }
              placeholder="Where We Practice"
            />
          </div>
          <div>
            <Label>Primary Locations Heading</Label>
            <Input
              value={data.locationsArea.primaryHeading}
              onChange={(e) =>
                update("locationsArea", { ...data.locationsArea, primaryHeading: e.target.value })
              }
              placeholder="Primary Locations"
            />
          </div>
          <ArrayEditor
            items={data.locationsArea.primaryLocations}
            onChange={(items) =>
              update("locationsArea", { ...data.locationsArea, primaryLocations: items })
            }
            itemLabel="Primary Location"
            newItem={() => ({ name: "", link: "" })}
            renderItem={(item, _, upd) => (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Location Name</Label>
                  <Input
                    value={item.name}
                    onChange={(e) => upd({ ...item, name: e.target.value })}
                    placeholder="Athens, GA"
                  />
                </div>
                <div>
                  <Label>Link (optional)</Label>
                  <Input
                    value={item.link}
                    onChange={(e) => upd({ ...item, link: e.target.value })}
                    placeholder="/athens-georgia-lawyer/"
                  />
                </div>
              </div>
            )}
          />

          <div className="border-t pt-4">
            <Label>Surrounding Communities Heading</Label>
            <Input
              value={data.locationsArea.surroundingHeading}
              onChange={(e) =>
                update("locationsArea", { ...data.locationsArea, surroundingHeading: e.target.value })
              }
              placeholder="Surrounding Communities"
              className="mt-2"
            />
          </div>
          <ArrayEditor
            items={data.locationsArea.surroundingLocations}
            onChange={(items) =>
              update("locationsArea", { ...data.locationsArea, surroundingLocations: items })
            }
            itemLabel="Surrounding Location"
            newItem={() => ({ name: "", link: "" })}
            renderItem={(item, _, upd) => (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Location Name</Label>
                  <Input
                    value={item.name}
                    onChange={(e) => upd({ ...item, name: e.target.value })}
                    placeholder="Atlanta, GA"
                  />
                </div>
                <div>
                  <Label>Link (optional, leave blank if not ready)</Label>
                  <Input
                    value={item.link}
                    onChange={(e) => upd({ ...item, link: e.target.value })}
                    placeholder="/atlanta-georgia-lawyer/"
                  />
                </div>
              </div>
            )}
          />
        </div>
      </Section>

      {/* Locations Map */}
      <Section title="Map Section" defaultOpen={false}>
        <div className="grid gap-4">
          <div>
            <Label>Heading</Label>
            <Input
              value={data.locationsMap.heading}
              onChange={(e) =>
                update("locationsMap", { ...data.locationsMap, heading: e.target.value })
              }
              placeholder="Serving North Georgia and East Georgia"
            />
          </div>
          <div>
            <Label>Body Text</Label>
            <Textarea
              value={data.locationsMap.body}
              onChange={(e) =>
                update("locationsMap", { ...data.locationsMap, body: e.target.value })
              }
              rows={4}
              placeholder="We focus on the communities where people need real legal help..."
            />
          </div>
          <div>
            <Label>Google Maps Embed URL</Label>
            <Textarea
              value={data.locationsMap.mapEmbedUrl}
              onChange={(e) =>
                update("locationsMap", { ...data.locationsMap, mapEmbedUrl: e.target.value })
              }
              rows={3}
              placeholder="https://www.google.com/maps/embed?..."
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Go to Google Maps → Share → Embed a map → copy the <code>src</code> value from the iframe code.
            </p>
          </div>
        </div>
      </Section>

      {/* Why Choose Us */}
      <Section title="Why Choose Us" defaultOpen={false}>
        <div className="grid gap-4">
          <ImageField
            label="Section Image (left column)"
            value={data.whyChooseUs.image}
            onChange={(url) => update("whyChooseUs", { ...data.whyChooseUs, image: url })}
            altValue={data.whyChooseUs.imageAlt}
            onChangeWithAlt={(image, imageAlt) =>
              update("whyChooseUs", { ...data.whyChooseUs, image, imageAlt })
            }
            folder="team"
          />
          <div>
            <Label>Section Label</Label>
            <Input
              value={data.whyChooseUs.sectionLabel}
              onChange={(e) =>
                update("whyChooseUs", { ...data.whyChooseUs, sectionLabel: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Headline</Label>
            <Input
              value={data.whyChooseUs.heading}
              onChange={(e) =>
                update("whyChooseUs", { ...data.whyChooseUs, heading: e.target.value })
              }
            />
          </div>
          <RichTextField
            label="Description"
            value={data.whyChooseUs.description}
            onChange={(v) => update("whyChooseUs", { ...data.whyChooseUs, description: v })}
          />
          <ArrayEditor
            items={Array.isArray(data.whyChooseUs.items) ? data.whyChooseUs.items : []}
            onChange={(items) =>
              update("whyChooseUs", { ...data.whyChooseUs, items: items.slice(0, 4) })
            }
            itemLabel="Feature Box"
            newItem={() => ({ icon: "Check", title: "", description: "" })}
            renderItem={(item, _, upd) => (
              <div className="grid gap-3">
                <div>
                  <Label>Icon Name</Label>
                  <Input
                    value={item.icon}
                    onChange={(e) => upd({ ...item, icon: e.target.value })}
                    placeholder="Check"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use a Lucide icon name like Check, Scale, Shield, Users, etc.
                  </p>
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={item.title}
                    onChange={(e) => upd({ ...item, title: e.target.value })}
                  />
                </div>
                <RichTextField
                  label="Description"
                  value={item.description}
                  onChange={(v) => upd({ ...item, description: v })}
                />
              </div>
            )}
          />
        </div>
      </Section>

      {/* Contact */}
      <Section title="Contact Section" defaultOpen={false}>
        <div className="grid gap-4">
          <div>
            <Label>Section Label</Label>
            <Input
              value={data.contact.sectionLabel}
              onChange={(e) =>
                update("contact", { ...data.contact, sectionLabel: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Heading</Label>
            <Input
              value={data.contact.heading}
              onChange={(e) => update("contact", { ...data.contact, heading: e.target.value })}
            />
          </div>
          <RichTextField
            label="Description"
            value={data.contact.description}
            onChange={(v) => update("contact", { ...data.contact, description: v })}
          />
          <p className="text-xs text-gray-500 italic">
            Uses the existing contact form from Forms settings.
          </p>
        </div>
      </Section>
    </div>
  );
}
