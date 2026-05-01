import type { ContactPageContent } from "@site/lib/cms/contactPageTypes";
import {
  Section,
  ImageField,
  RichTextField,
  HeadingField,
  Input,
  Label,
  Textarea,
} from "./EditorShared";

interface ContactEditorProps {
  content: ContactPageContent;
  onChange: (c: ContactPageContent) => void;
}

export default function ContactEditor({ content, onChange }: ContactEditorProps) {
  const update = <K extends keyof ContactPageContent>(key: K, value: ContactPageContent[K]) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="space-y-6">
      <HeroSection content={content} update={update} />
      <FormSection content={content} update={update} />
    </div>
  );
}

type Updater = <K extends keyof ContactPageContent>(key: K, value: ContactPageContent[K]) => void;
type SectionProps = { content: ContactPageContent; update: Updater };

function useHeadingTag(content: ContactPageContent, update: Updater) {
  return {
    get: (key: string) => content.headingTags?.[key] ?? "h2",
    set: (key: string, tag: string) =>
      update("headingTags", { ...content.headingTags, [key]: tag }),
  };
}

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
      </div>
    </Section>
  );
}

function FormSection({ content, update }: SectionProps) {
  const form = content.form;
  const set = (patch: Partial<typeof form>) => update("form", { ...form, ...patch });
  const ht = useHeadingTag(content, update);

  return (
    <Section title="Contact Form" defaultOpen={false}>
      <div className="grid gap-4">
        <HeadingField
          label="Heading"
          value={form.heading}
          onChange={(v) => set({ heading: v })}
          tag={ht.get("form.heading")}
          onTagChange={(t) => ht.set("form.heading", t)}
        />
        <RichTextField label="Subtext" value={form.subtext} onChange={(v) => set({ subtext: v })} />
      </div>
    </Section>
  );
}
