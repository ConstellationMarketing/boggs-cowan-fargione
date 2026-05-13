import CmsFormRenderer from "@site/components/shared/CmsFormRenderer";

export default function ContactForm() {
  return (
    <div className="overflow-hidden rounded-xl border border-brand-border bg-brand-card p-[30px]">
      <CmsFormRenderer formId="contact" className="space-y-[25px]" />
    </div>
  );
}
