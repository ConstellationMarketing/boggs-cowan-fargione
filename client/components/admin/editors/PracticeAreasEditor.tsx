import type { PracticeAreasPageContent } from "@site/lib/cms/practiceAreasPageTypes";
import { Section, ArrayEditor, ImageField, GlobalSectionInfo, RichTextField, HeadingField, Input, Label, Textarea } from "./EditorShared";

interface PracticeAreasEditorProps {
  content: PracticeAreasPageContent;
  onChange: (c: PracticeAreasPageContent) => void;
}

export default function PracticeAreasEditor({ content, onChange }: PracticeAreasEditorProps) {
  const update = <K extends keyof PracticeAreasPageContent>(key: K, value: PracticeAreasPageContent[K]) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="space-y-6">
      <HeroSection content={content} update={update} />
      <GridSection content={content} update={update} />
      <GlobalSectionInfo sectionTitle="Why Choose Us" managedIn="About Us" />
      <GlobalSectionInfo sectionTitle="Call to Action" managedIn="About Us" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
type Updater = <K extends keyof PracticeAreasPageContent>(key: K, value: PracticeAreasPageContent[K]) => void;
type SectionProps = { content: PracticeAreasPageContent; update: Updater };

function useHeadingTag(content: PracticeAreasPageContent, update: Updater) {
  return {
    get: (key: string) => content.headingTags?.[key] ?? "h2",
    set: (key: string, tag: string) =>
      update("headingTags", { ...content.headingTags, [key]: tag }),
  };
}

/* ------------------------------------------------------------------ */
function HeroSection({ content, update }: SectionProps) {
  const hero = content.hero;
  const set = (patch: Partial<typeof hero>) => update("hero", { ...hero, ...patch });
  const ht = useHeadingTag(content, update);

  return (
    <Section title="Hero Section">
      <div className="grid gap-4">
        <HeadingField
          label="H1 Title (appears above headline in green)"
          value={hero.h1Title}
          onChange={(v) => set({ h1Title: v })}
          tag={ht.get("hero.h1Title") === "h2" ? "h1" : ht.get("hero.h1Title")}
          onTagChange={(t) => ht.set("hero.h1Title", t)}
        />
        <div>
          <Label>Full Headline</Label>
          <Input value={hero.headline} onChange={(e) => set({ headline: e.target.value })} />
        </div>
        <div>
          <Label>Highlighted Text</Label>
          <Input value={hero.highlightedText} onChange={(e) => set({ highlightedText: e.target.value })} />
        </div>
        <div>
          <Label>Hero Description</Label>
          <Textarea value={hero.description} onChange={(e) => set({ description: e.target.value })} rows={4} />
        </div>
        <ImageField
          label="Hero Background Image"
          value={hero.backgroundImage}
          onChange={(url) => set({ backgroundImage: url })}
          folder="hero"
        />
        <ImageField
          label="Hero Side Image"
          value={hero.heroImage}
          onChange={(url) => set({ heroImage: url })}
          altValue={hero.heroImageAlt}
          onChangeWithAlt={(heroImage, heroImageAlt) => set({ heroImage, heroImageAlt })}
          folder="hero"
        />
        <div>
          <Label>Hero Image Alt Text</Label>
          <Input value={hero.heroImageAlt} onChange={(e) => set({ heroImageAlt: e.target.value })} />
        </div>
        <div className="border-t pt-4 mt-4 space-y-4">
          <div>
            <Label>Consultation Button Text</Label>
            <Input value={hero.consultationButtonText} onChange={(e) => set({ consultationButtonText: e.target.value })} />
          </div>
          <div>
            <Label>Consultation Button Link</Label>
            <Input value={hero.consultationButtonLink} onChange={(e) => set({ consultationButtonLink: e.target.value })} placeholder="/contact" />
          </div>
        </div>
        <p className="text-xs text-gray-500 italic">Phone number is managed in Site Settings &gt; Contact Info</p>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
function GridSection({ content, update }: SectionProps) {
  const grid = content.grid;
  const set = (patch: Partial<typeof grid>) => update("grid", { ...grid, ...patch });
  const ht = useHeadingTag(content, update);

  return (
    <Section title="Practice Areas Grid" defaultOpen={false}>
      <div className="grid gap-4">
        <HeadingField
          label="Heading"
          value={grid.heading}
          onChange={(v) => set({ heading: v })}
          tag={ht.get("grid.heading")}
          onTagChange={(t) => ht.set("grid.heading", t)}
        />
        <RichTextField label="Description" value={grid.description} onChange={(v) => set({ description: v })} />
        <ArrayEditor
          items={grid.areas}
          onChange={(items) => set({ areas: items })}
          itemLabel="Practice Area"
          newItem={() => ({ icon: "FileText", title: "", description: "", image: "", imageAlt: "", link: "/practice-areas" })}
          renderItem={(item, _, upd) => (
            <div className="grid gap-3">
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <Label>Icon</Label>
                  <Input value={item.icon} onChange={(e) => upd({ ...item, icon: e.target.value })} placeholder="Lucide icon name" />
                </div>
                <div className="col-span-3">
                  <Label>Title</Label>
                  <Input value={item.title} onChange={(e) => upd({ ...item, title: e.target.value })} />
                </div>
              </div>
              <RichTextField label="Description" value={item.description} onChange={(v) => upd({ ...item, description: v })} />
              <ImageField
                label="Background Image"
                value={item.image}
                onChange={(url) => upd({ ...item, image: url })}
                altValue={item.imageAlt}
                onChangeWithAlt={(image, imageAlt) =>
                  upd({ ...item, image, imageAlt })
                }
                folder="practice-areas"
              />
              <div>
                <Label>Image Alt Text</Label>
                <Input value={item.imageAlt} onChange={(e) => upd({ ...item, imageAlt: e.target.value })} placeholder="Describe the background image" />
              </div>
              <div>
                <Label>Link</Label>
                <Input value={item.link} onChange={(e) => upd({ ...item, link: e.target.value })} />
              </div>
            </div>
          )}
        />
      </div>
    </Section>
  );
}
