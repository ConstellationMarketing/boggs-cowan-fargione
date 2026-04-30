import type { HomePageContent } from "@site/lib/cms/homePageTypes";
import { Section, ArrayEditor, ImageField, RichTextField, HeadingField, Input, Label, Textarea } from "./EditorShared";

interface HomeEditorProps {
  content: HomePageContent;
  onChange: (c: HomePageContent) => void;
}

export default function HomeEditor({ content, onChange }: HomeEditorProps) {
  const update = <K extends keyof HomePageContent>(key: K, value: HomePageContent[K]) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <div className="space-y-6">
      <HeroSection content={content} update={update} />
      <PartnerLogosSection content={content} update={update} />
      <AboutSectionEditor content={content} update={update} />
      <PracticeAreasIntroSection content={content} update={update} />
      <PracticeAreasItemsSection content={content} update={update} />
      <AwardsSection content={content} update={update} />
      <TestimonialsSection content={content} update={update} />
      <ProcessSection content={content} update={update} />
      <GoogleReviewsSection content={content} update={update} />
      <FaqSectionEditor content={content} update={update} />
      <ContactSectionEditor content={content} update={update} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
type Updater = <K extends keyof HomePageContent>(key: K, value: HomePageContent[K]) => void;
type SectionProps = { content: HomePageContent; update: Updater };

function useHeadingTag(content: HomePageContent, update: Updater) {
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
          <p className="text-xs text-gray-500 mt-1">The complete headline sentence displayed in the hero</p>
        </div>
        <div>
          <Label>Highlighted Text</Label>
          <Input value={hero.highlightedText} onChange={(e) => set({ highlightedText: e.target.value })} />
          <p className="text-xs text-gray-500 mt-1">Enter the exact portion of the headline to display in accent color</p>
        </div>
        <div>
          <Label>Hero Description</Label>
          <Textarea
            value={hero.description}
            onChange={(e) => set({ description: e.target.value })}
            placeholder="Short supporting text shown under the headline"
            rows={4}
          />
        </div>

        <ImageField
          label="Hero Background Image"
          value={hero.backgroundImage}
          onChange={(url) => set({ backgroundImage: url })}
          folder="hero"
        />

        <ImageField
          label="Hero Side Image (replaces contact form)"
          value={hero.heroImage}
          onChange={(url) => set({ heroImage: url })}
          altValue={hero.heroImageAlt}
          onChangeWithAlt={(heroImage, heroImageAlt) =>
            set({ heroImage, heroImageAlt })
          }
          folder="hero"
        />
        <div>
          <Label>Hero Image Alt Text</Label>
          <Input value={hero.heroImageAlt} onChange={(e) => set({ heroImageAlt: e.target.value })} />
        </div>

        <p className="text-xs text-gray-500 italic mt-2">Phone number is managed in Site Settings &gt; Contact Info</p>

        <div className="border-t pt-4 mt-4">
          <h4 className="font-medium mb-3">Free Consultation Button</h4>
          <div className="grid gap-3">
            <div>
              <Label>Button Text</Label>
              <Input
                value={hero.consultationButtonText}
                onChange={(e) => set({ consultationButtonText: e.target.value })}
                placeholder="Free Consultation"
              />
            </div>
            <div>
              <Label>Button Link</Label>
              <Input
                value={hero.consultationButtonLink}
                onChange={(e) => set({ consultationButtonLink: e.target.value })}
                placeholder="/contact"
              />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
function PartnerLogosSection({ content, update }: SectionProps) {
  return (
    <Section title="Partner Logos" defaultOpen={false}>
      <ArrayEditor
        items={content.partnerLogos}
        onChange={(items) => update("partnerLogos", items)}
        itemLabel="Logo"
        newItem={() => ({ src: "", alt: "" })}
        renderItem={(item, _, upd) => (
          <div className="grid gap-3">
            <ImageField
              label="Logo Image"
              value={item.src}
              onChange={(url) => upd({ ...item, src: url })}
              altValue={item.alt}
              onChangeWithAlt={(src, alt) => upd({ ...item, src, alt })}
              folder="logos"
            />
            <div>
              <Label>Alt Text</Label>
              <Input value={item.alt} onChange={(e) => upd({ ...item, alt: e.target.value })} />
            </div>
          </div>
        )}
      />
    </Section>
  );
}

/* ------------------------------------------------------------------ */
function AboutSectionEditor({ content, update }: SectionProps) {
  const about = content.about;
  const set = (patch: Partial<typeof about>) => update("about", { ...about, ...patch });
  const ht = useHeadingTag(content, update);

  return (
    <Section title="About Section" defaultOpen={false}>
      <div className="grid gap-4">
        <div>
          <Label>Section Label</Label>
          <Input value={about.sectionLabel} onChange={(e) => set({ sectionLabel: e.target.value })} />
        </div>
        <div>
          <Label>Heading</Label>
          <Input value={about.heading} onChange={(e) => set({ heading: e.target.value })} />
        </div>
        <RichTextField label="Description" value={about.description} onChange={(v) => set({ description: v })} />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Button Text</Label>
            <Input
              value={about.contactLabel}
              onChange={(e) => set({ contactLabel: e.target.value })}
              placeholder="Learn More About Our Firm"
            />
          </div>
          <div>
            <Label>Button Link</Label>
            <Input
              value={about.contactText}
              onChange={(e) => set({ contactText: e.target.value })}
              placeholder="/about/"
            />
          </div>
        </div>
        <ImageField
          label="Attorney Image"
          value={about.attorneyImage}
          onChange={(url) => set({ attorneyImage: url })}
          altValue={about.attorneyImageAlt}
          onChangeWithAlt={(attorneyImage, attorneyImageAlt) =>
            set({ attorneyImage, attorneyImageAlt })
          }
          folder="team"
        />
        <div>
          <Label>Attorney Image Alt</Label>
          <Input value={about.attorneyImageAlt} onChange={(e) => set({ attorneyImageAlt: e.target.value })} />
        </div>

        <h4 className="font-medium mt-2">Badges / Awards</h4>
        <ArrayEditor
          items={about.badges}
          onChange={(items) => set({ badges: items.slice(0, 3) })}
          itemLabel="Badge"
          newItem={() => ({ src: "", alt: "" })}
          renderItem={(item, _, upd) => (
            <div className="grid gap-3">
              <ImageField
                label="Badge Image"
                value={item.src}
                onChange={(url) => upd({ ...item, src: url })}
                altValue={item.alt}
                onChangeWithAlt={(src, alt) => upd({ ...item, src, alt })}
                folder="awards"
              />
              <div>
                <Label>Badge Alt Text</Label>
                <Input value={item.alt} onChange={(e) => upd({ ...item, alt: e.target.value })} />
              </div>
            </div>
          )}
        />
        <p className="text-xs text-gray-500 italic">Add up to 3 badges. They render in a single row below the attorney image.</p>

        <div className="border-t pt-4 mt-4 space-y-4">
          <div>
            <Label>Credentials Box Title</Label>
            <Input
              value={about.credentialsTitle}
              onChange={(e) => set({ credentialsTitle: e.target.value })}
              placeholder="Credentials & Affiliations"
            />
          </div>
          <div>
            <Label>First Subtitle</Label>
            <Input
              value={about.admissionsTitle}
              onChange={(e) => set({ admissionsTitle: e.target.value })}
              placeholder="Court Admissions"
            />
          </div>
          <ArrayEditor
            items={about.admissionsItems.map((text, index) => ({ id: `${index}`, text }))}
            onChange={(items) => set({ admissionsItems: items.map((item) => item.text) })}
            itemLabel="First List Item"
            newItem={() => ({ id: String(Date.now()), text: "" })}
            renderItem={(item, _, upd) => (
              <div>
                <Label>Text</Label>
                <Input value={item.text} onChange={(e) => upd({ ...item, text: e.target.value })} />
              </div>
            )}
          />
          <div>
            <Label>Second Subtitle</Label>
            <Input
              value={about.membershipsTitle}
              onChange={(e) => set({ membershipsTitle: e.target.value })}
              placeholder="Memberships"
            />
          </div>
          <ArrayEditor
            items={about.membershipsItems.map((text, index) => ({ id: `${index}`, text }))}
            onChange={(items) => set({ membershipsItems: items.map((item) => item.text) })}
            itemLabel="Second List Item"
            newItem={() => ({ id: String(Date.now()), text: "" })}
            renderItem={(item, _, upd) => (
              <div>
                <Label>Text</Label>
                <Input value={item.text} onChange={(e) => upd({ ...item, text: e.target.value })} />
              </div>
            )}
          />
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
function PracticeAreasIntroSection({ content, update }: SectionProps) {
  const intro = content.practiceAreasIntro;
  const set = (patch: Partial<typeof intro>) => update("practiceAreasIntro", { ...intro, ...patch });
  const ht = useHeadingTag(content, update);

  return (
    <Section title="Practice Areas Intro" defaultOpen={false}>
      <div className="grid gap-4">
        <HeadingField
          label="Section Label"
          value={intro.sectionLabel}
          onChange={(v) => set({ sectionLabel: v })}
          tag={ht.get("practiceAreasIntro.sectionLabel")}
          onTagChange={(t) => ht.set("practiceAreasIntro.sectionLabel", t)}
        />
        <div>
          <Label>Text</Label>
          <Input
            value={intro.heading}
            onChange={(e) => set({ heading: e.target.value })}
            placeholder="Displayed below the section label"
          />
          <p className="mt-1 text-xs text-gray-500">This is rendered as body text, not as a heading.</p>
        </div>
        <RichTextField
          label="Description"
          value={intro.description}
          onChange={(value) => set({ description: value })}
          placeholder="Optional supporting text shown below the intro text"
        />
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
function PracticeAreasItemsSection({ content, update }: SectionProps) {
  return (
    <Section title="Practice Areas Grid" defaultOpen={false}>
      <ArrayEditor
        items={Array.isArray(content.practiceAreas) ? content.practiceAreas : []}
        onChange={(items) => update("practiceAreas", items)}
        itemLabel="Practice Area"
        newItem={() => ({ title: "", icon: "Scale", subPractices: [{ text: "", link: "" }], link: "/practice-areas/" })}
        renderItem={(item, _, upd) => (
          <div className="grid gap-3">
            <div>
              <Label>Title</Label>
              <Input value={typeof item.title === "string" ? item.title : ""} onChange={(e) => upd({ ...item, title: e.target.value })} />
            </div>
            <div>
              <Label>Icon Name</Label>
              <Input
                value={typeof item.icon === "string" ? item.icon : ""}
                onChange={(e) => upd({ ...item, icon: e.target.value })}
                placeholder="Scale"
              />
              <p className="mt-1 text-xs text-gray-500">Use a Lucide icon name like Users, CarFront, BriefcaseBusiness, Shield, Heart, or Scale. Spaces and dashes are also accepted.</p>
            </div>
            <ArrayEditor
              items={Array.isArray(item.subPractices)
                ? item.subPractices.map((entry) => {
                    if (entry && typeof entry === "object") {
                      return {
                        text: typeof entry.text === "string" ? entry.text : "",
                        link: typeof entry.link === "string" ? entry.link : "",
                      };
                    }

                    if (typeof entry === "string") {
                      return { text: entry, link: "" };
                    }

                    return { text: "", link: "" };
                  })
                : []}
              onChange={(items) => upd({ ...item, subPractices: items })}
              itemLabel="Sub-practice"
              newItem={() => ({ text: "", link: "" })}
              renderItem={(subPractice, __, updateSubPractice) => (
                <div className="grid gap-3">
                  <div>
                    <Label>Text</Label>
                    <Input
                      value={typeof subPractice.text === "string" ? subPractice.text : ""}
                      onChange={(e) => updateSubPractice({ ...subPractice, text: e.target.value })}
                      placeholder="Motor Vehicle Accidents"
                    />
                  </div>
                  <div>
                    <Label>Link</Label>
                    <Input
                      value={typeof subPractice.link === "string" ? subPractice.link : ""}
                      onChange={(e) => updateSubPractice({ ...subPractice, link: e.target.value })}
                      placeholder="/practice-areas/personal-injury/"
                    />
                  </div>
                </div>
              )}
            />
            <div>
              <Label>Link</Label>
              <Input value={typeof item.link === "string" ? item.link : ""} onChange={(e) => upd({ ...item, link: e.target.value })} />
            </div>
          </div>
        )}
      />
    </Section>
  );
}

/* ------------------------------------------------------------------ */
function AwardsSection({ content, update }: SectionProps) {
  const awards = content.awards;
  const set = (patch: Partial<typeof awards>) => update("awards", { ...awards, ...patch });
  const ht = useHeadingTag(content, update);

  return (
    <Section title="Awards & Memberships" defaultOpen={false}>
      <div className="grid gap-4">
        <HeadingField
          label="Section Label"
          value={awards.sectionLabel}
          onChange={(v) => set({ sectionLabel: v })}
          tag={ht.get("awards.sectionLabel")}
          onTagChange={(t) => ht.set("awards.sectionLabel", t)}
        />
        <div>
          <Label>Heading</Label>
          <Input value={awards.heading} onChange={(e) => set({ heading: e.target.value })} />
        </div>
        <RichTextField label="Description" value={awards.description} onChange={(v) => set({ description: v })} />
        <h4 className="font-medium">Award Logos</h4>
        <ArrayEditor
          items={awards.logos}
          onChange={(items) => set({ logos: items })}
          itemLabel="Logo"
          newItem={() => ({ src: "", alt: "" })}
          renderItem={(item, _, upd) => (
            <div className="grid gap-3">
              <ImageField
                label="Logo Image"
                value={item.src}
                onChange={(url) => upd({ ...item, src: url })}
                altValue={item.alt}
                onChangeWithAlt={(src, alt) => upd({ ...item, src, alt })}
                folder="awards"
              />
              <div>
                <Label>Alt Text</Label>
                <Input value={item.alt} onChange={(e) => upd({ ...item, alt: e.target.value })} />
              </div>
            </div>
          )}
        />
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
function TestimonialsSection({ content, update }: SectionProps) {
  const t = content.testimonials;
  const set = (patch: Partial<typeof t>) => update("testimonials", { ...t, ...patch });
  const ht = useHeadingTag(content, update);

  return (
    <Section title="Testimonials" defaultOpen={false}>
      <div className="grid gap-4">
        <HeadingField
          label="Section Label"
          value={t.sectionLabel}
          onChange={(v) => set({ sectionLabel: v })}
          tag={ht.get("testimonials.sectionLabel")}
          onTagChange={(t2) => ht.set("testimonials.sectionLabel", t2)}
        />
        <div>
          <Label>Heading</Label>
          <Input value={t.heading} onChange={(e) => set({ heading: e.target.value })} />
        </div>
        <ImageField
          label="Background Image"
          value={t.backgroundImage}
          onChange={(url) => set({ backgroundImage: url })}
          altValue={t.backgroundImageAlt || ""}
          onChangeWithAlt={(backgroundImage, backgroundImageAlt) =>
            set({ backgroundImage, backgroundImageAlt })
          }
          folder="backgrounds"
        />
        <div>
          <Label>Background Image Alt Text</Label>
          <Input value={t.backgroundImageAlt || ""} onChange={(e) => set({ backgroundImageAlt: e.target.value })} placeholder="Describe the background image" />
        </div>
        <ArrayEditor
          items={t.items}
          onChange={(items) => set({ items })}
          itemLabel="Testimonial"
          newItem={() => ({ text: "", author: "", ratingImage: "", ratingImageAlt: "" })}
          renderItem={(item, _, upd) => (
            <div className="grid gap-3">
              <div>
                <Label>Author</Label>
                <Input value={item.author} onChange={(e) => upd({ ...item, author: e.target.value })} />
              </div>
              <RichTextField label="Text" value={item.text} onChange={(v) => upd({ ...item, text: v })} />
              <ImageField
                label="Rating Image"
                value={item.ratingImage}
                onChange={(url) => upd({ ...item, ratingImage: url })}
                altValue={item.ratingImageAlt || ""}
                onChangeWithAlt={(ratingImage, ratingImageAlt) =>
                  upd({ ...item, ratingImage, ratingImageAlt })
                }
                folder="logos"
              />
              <div>
                <Label>Rating Image Alt Text</Label>
                <Input value={item.ratingImageAlt || ""} onChange={(e) => upd({ ...item, ratingImageAlt: e.target.value })} placeholder="e.g. 5 star rating" />
              </div>
            </div>
          )}
        />
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
function ProcessSection({ content, update }: SectionProps) {
  const p = content.process;
  const set = (patch: Partial<typeof p>) => update("process", { ...p, ...patch });
  const ht = useHeadingTag(content, update);

  return (
    <Section title="Process Steps" defaultOpen={false}>
      <div className="grid gap-4">
        <HeadingField
          label="Section Label"
          value={p.sectionLabel}
          onChange={(v) => set({ sectionLabel: v })}
          tag={ht.get("process.sectionLabel")}
          onTagChange={(t) => ht.set("process.sectionLabel", t)}
        />
        <div>
          <Label>Heading Line 1</Label>
          <Input value={p.headingLine1} onChange={(e) => set({ headingLine1: e.target.value })} />
        </div>
        <div>
          <Label>Heading Line 2</Label>
          <Input value={p.headingLine2} onChange={(e) => set({ headingLine2: e.target.value })} />
        </div>
        <ArrayEditor
          items={p.steps}
          onChange={(items) => set({ steps: items })}
          itemLabel="Step"
          newItem={() => ({ number: "", title: "", description: "" })}
          renderItem={(item, _, upd) => (
            <div className="grid gap-3">
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <Label>Number</Label>
                  <Input value={item.number} onChange={(e) => upd({ ...item, number: e.target.value })} />
                </div>
                <div className="col-span-3">
                  <Label>Title</Label>
                  <Input value={item.title} onChange={(e) => upd({ ...item, title: e.target.value })} />
                </div>
              </div>
              <RichTextField label="Description" value={item.description} onChange={(v) => upd({ ...item, description: v })} />
            </div>
          )}
        />
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
function GoogleReviewsSection({ content, update }: SectionProps) {
  const r = content.googleReviews;
  const set = (patch: Partial<typeof r>) => update("googleReviews", { ...r, ...patch });
  const ht = useHeadingTag(content, update);

  return (
    <Section title="Google Reviews" defaultOpen={false}>
      <div className="grid gap-4">
        <HeadingField
          label="Section Label"
          value={r.sectionLabel}
          onChange={(v) => set({ sectionLabel: v })}
          tag={ht.get("googleReviews.sectionLabel")}
          onTagChange={(t) => ht.set("googleReviews.sectionLabel", t)}
        />
        <div>
          <Label>Heading</Label>
          <Input value={r.heading} onChange={(e) => set({ heading: e.target.value })} />
        </div>
        <RichTextField label="Description" value={r.description} onChange={(v) => set({ description: v })} />
        <ArrayEditor
          items={r.reviews}
          onChange={(items) => set({ reviews: items })}
          itemLabel="Review"
          newItem={() => ({ text: "", author: "", ratingImage: "", ratingImageAlt: "" })}
          renderItem={(item, _, upd) => (
            <div className="grid gap-3">
              <div>
                <Label>Author</Label>
                <Input value={item.author} onChange={(e) => upd({ ...item, author: e.target.value })} />
              </div>
              <RichTextField label="Review Text" value={item.text} onChange={(v) => upd({ ...item, text: v })} />
              <ImageField
                label="Rating Image"
                value={item.ratingImage}
                onChange={(url) => upd({ ...item, ratingImage: url })}
                altValue={item.ratingImageAlt || ""}
                onChangeWithAlt={(ratingImage, ratingImageAlt) =>
                  upd({ ...item, ratingImage, ratingImageAlt })
                }
                folder="logos"
              />
              <div>
                <Label>Rating Image Alt Text</Label>
                <Input value={item.ratingImageAlt || ""} onChange={(e) => upd({ ...item, ratingImageAlt: e.target.value })} placeholder="e.g. 5 star rating" />
              </div>
            </div>
          )}
        />
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
function FaqSectionEditor({ content, update }: SectionProps) {
  const faq = content.faq;
  const set = (patch: Partial<typeof faq>) => update("faq", { ...faq, ...patch });
  const ht = useHeadingTag(content, update);

  return (
    <Section title="FAQ Section" defaultOpen={false}>
      <div className="grid gap-4">
        <HeadingField
          label="Heading"
          value={faq.heading}
          onChange={(v) => set({ heading: v })}
          tag={ht.get("faq.heading")}
          onTagChange={(t) => ht.set("faq.heading", t)}
        />
        <RichTextField label="Description" value={faq.description} onChange={(v) => set({ description: v })} />
        <ImageField
          label="Video Thumbnail"
          value={faq.videoThumbnail}
          onChange={(url) => set({ videoThumbnail: url })}
          altValue={faq.videoThumbnailAlt || ""}
          onChangeWithAlt={(videoThumbnail, videoThumbnailAlt) =>
            set({ videoThumbnail, videoThumbnailAlt })
          }
          folder="backgrounds"
        />
        <div>
          <Label>Video Thumbnail Alt Text</Label>
          <Input value={faq.videoThumbnailAlt || ""} onChange={(e) => set({ videoThumbnailAlt: e.target.value })} placeholder="Describe the thumbnail image" />
        </div>
        <div>
          <Label>Video URL</Label>
          <Input value={faq.videoUrl} onChange={(e) => set({ videoUrl: e.target.value })} />
        </div>
        <ArrayEditor
          items={faq.items}
          onChange={(items) => set({ items })}
          itemLabel="FAQ"
          newItem={() => ({ question: "", answer: "" })}
          renderItem={(item, _, upd) => (
            <div className="grid gap-3">
              <div>
                <Label>Question</Label>
                <Input value={item.question} onChange={(e) => upd({ ...item, question: e.target.value })} />
              </div>
              <RichTextField label="Answer" value={item.answer} onChange={(v) => upd({ ...item, answer: v })} />
            </div>
          )}
        />
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
function ContactSectionEditor({ content, update }: SectionProps) {
  const c = content.contact;
  const set = (patch: Partial<typeof c>) => update("contact", { ...c, ...patch });
  const ht = useHeadingTag(content, update);

  return (
    <Section title="Contact Section" defaultOpen={false}>
      <div className="grid gap-4">
        <HeadingField
          label="Section Label"
          value={c.sectionLabel}
          onChange={(v) => set({ sectionLabel: v })}
          tag={ht.get("contact.sectionLabel")}
          onTagChange={(t) => ht.set("contact.sectionLabel", t)}
        />
        <div>
          <Label>Heading</Label>
          <Input value={c.heading} onChange={(e) => set({ heading: e.target.value })} />
        </div>
        <RichTextField label="Description" value={c.description} onChange={(v) => set({ description: v })} />
        <ImageField
          label="Section Image"
          value={c.image}
          onChange={(url) => set({ image: url })}
          altValue={c.imageAlt}
          onChangeWithAlt={(image, imageAlt) => set({ image, imageAlt })}
          folder="team"
        />
        <div>
          <Label>Image Alt Text</Label>
          <Input value={c.imageAlt} onChange={(e) => set({ imageAlt: e.target.value })} placeholder="Describe the image" />
        </div>
        <p className="text-xs text-gray-500 italic">Phone and address are managed in Site Settings &gt; Contact Info</p>
        <div>
          <Label>Form Heading</Label>
          <Input value={c.formHeading} onChange={(e) => set({ formHeading: e.target.value })} />
        </div>
        <div>
          <Label>Availability Text</Label>
          <Input value={c.availabilityText || ""} onChange={(e) => set({ availabilityText: e.target.value })} placeholder="Our intake team is available 24 hours a day, seven days a week" />
        </div>
      </div>
    </Section>
  );
}
