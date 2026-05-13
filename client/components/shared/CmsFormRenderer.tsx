import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useCmsForm } from "@site/hooks/useCmsForm";
import {
  AUTO_TRACKED_FORM_FIELD_NAMES,
  EMPTY_FORM_TRACKING_PAYLOAD,
  getBrowserFormTrackingPayload,
  normalizeRedirectUrl,
} from "@site/lib/cms/formTracking";
import type { CmsForm, FormFieldDef } from "@site/lib/cms/formTypes";

interface CmsFormRendererProps {
  /** Pass a pre-loaded form object directly */
  form?: CmsForm;
  /** Or pass an ID/name to fetch it */
  formId?: string;
  /** Optional extra className on the wrapper */
  className?: string;
  /** Optional visual styling preset */
  variant?: "default" | "contactSection";
}

export default function CmsFormRenderer({
  form: formProp,
  formId,
  className,
  variant = "default",
}: CmsFormRendererProps) {
  const { form: fetchedForm, isLoading } = useCmsForm(
    formProp ? undefined : formId,
  );
  const form = formProp ?? fetchedForm;

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!form) {
    return null;
  }

  return <FormInner form={form} className={className} variant={variant} />;
}

function FormInner({
  form,
  className,
  variant,
}: {
  form: CmsForm;
  className?: string;
  variant: "default" | "contactSection";
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingPayload, setTrackingPayload] = useState(
    EMPTY_FORM_TRACKING_PAYLOAD,
  );
  const redirectUrl = useMemo(
    () => normalizeRedirectUrl(form.redirect_url),
    [form.redirect_url],
  );

  useEffect(() => {
    setTrackingPayload(getBrowserFormTrackingPayload());
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formElement = e.currentTarget;

    try {
      const formData = new FormData(formElement);
      const body = new URLSearchParams();

      formData.forEach((value, key) => {
        if (value instanceof File) {
          if (value.name) {
            body.append(key, value.name);
          }
          return;
        }

        body.append(key, value.toString());
      });

      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      if (!response.ok) {
        throw new Error(`Form submission failed with ${response.status}`);
      }

      if (redirectUrl && typeof window !== "undefined") {
        window.location.assign(redirectUrl);
        return;
      }

      toast.success(form.success_message);
      formElement.reset();
      setTrackingPayload(getBrowserFormTrackingPayload());
    } catch (err) {
      console.error("[CmsFormRenderer] Submit error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formClassName =
    variant === "contactSection"
      ? cn("mx-auto w-full max-w-[760px]", className ?? "space-y-4 md:space-y-5")
      : className ?? "space-y-[25px]";

  return (
    <form
      name={form.name}
      method="POST"
      action={redirectUrl ?? undefined}
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className={formClassName}
    >
      <input type="hidden" name="form-name" value={form.name} />
      {AUTO_TRACKED_FORM_FIELD_NAMES.map((fieldName) => (
        <input
          key={fieldName}
          type="hidden"
          name={fieldName}
          value={trackingPayload[fieldName]}
          readOnly
        />
      ))}

      {form.fields.map((field) => (
        <FormField key={field.id} field={field} variant={variant} />
      ))}

      <div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className={
            variant === "contactSection"
              ? "h-[56px] w-full rounded-xl border border-brand-accent bg-brand-accent text-[18px] font-medium text-white transition-colors duration-300 hover:bg-brand-accent-dark"
              : "w-full bg-brand-accent-dark text-white border-brand-accent font-inter text-[22px] h-[50px] hover:bg-brand-accent hover:text-black transition-all duration-300 rounded-xl"
          }
        >
          {isSubmitting ? "SUBMITTING..." : form.submit_button_text}
        </Button>
      </div>

      <div className="absolute invisible" aria-hidden="true">
        <label>
          If you are a human, leave this empty.
          <Input
            type="text"
            name="bot-field"
            tabIndex={-1}
            autoComplete="off"
            className="invisible"
          />
        </label>
      </div>
    </form>
  );
}

const defaultFieldInputClass =
  "w-full h-[50px] bg-white border-[0.8px] border-brand-border text-gray-600 text-[16px] px-[12px] py-[12px] rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0";

const contactSectionFieldInputClass =
  "w-full h-[44px] md:h-[52px] bg-white border border-white text-black text-[16px] px-5 py-3 rounded-xl placeholder:text-black/45 focus-visible:ring-0 focus-visible:ring-offset-0";

function getFieldPlaceholder(field: FormFieldDef, variant: "default" | "contactSection") {
  if (variant !== "contactSection") {
    return field.label;
  }

  const normalizedName = field.name.replace(/[^a-z0-9]/gi, "").toLowerCase();
  const normalizedLabel = field.label.replace(/\*/g, "").trim();

  if (field.type === "email" || normalizedName.includes("email")) {
    return "your@email.com";
  }

  if (field.type === "phone" || normalizedName.includes("phone")) {
    return "(555) 123-4567";
  }

  if (field.type === "textarea") {
    return "Please Describe Your Situation...";
  }

  if (normalizedName.includes("name")) {
    return "Your Full Name";
  }

  return normalizedLabel || field.label;
}

function renderFieldLabel(field: FormFieldDef, variant: "default" | "contactSection") {
  if (variant !== "contactSection" || field.type === "html") {
    return null;
  }

  const labelText = field.label.replace(/\*+\s*$/g, "").trim();

  return (
    <label
      htmlFor={field.id}
      className="mb-2 block font-inter text-[15px] font-medium leading-tight text-white"
    >
      {labelText}
      {field.required ? " *" : ""}
    </label>
  );
}

function FormField({
  field,
  variant,
}: {
  field: FormFieldDef;
  variant: "default" | "contactSection";
}) {
  const inputClassName =
    variant === "contactSection" ? contactSectionFieldInputClass : defaultFieldInputClass;

  switch (field.type) {
    case "text":
    case "email":
    case "phone":
      return (
        <div>
          {renderFieldLabel(field, variant)}
          <Input
            id={field.id}
            type={field.type === "phone" ? "tel" : field.type}
            name={field.name}
            placeholder={getFieldPlaceholder(field, variant)}
            required={field.required}
            className={inputClassName}
          />
        </div>
      );

    case "textarea":
      return (
        <div>
          {renderFieldLabel(field, variant)}
          <Textarea
            id={field.id}
            name={field.name}
            placeholder={getFieldPlaceholder(field, variant)}
            required={field.required}
            className={
              variant === "contactSection"
                ? "min-h-[120px] w-full resize-none rounded-xl border border-white bg-white px-5 py-4 text-[16px] text-black placeholder:text-black/45 focus-visible:ring-0 focus-visible:ring-offset-0"
                : "w-full h-[200px] bg-white border-[0.8px] border-brand-border text-gray-600 text-[16px] px-[12px] py-[12px] rounded-xl resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
            }
          />
        </div>
      );

    case "select":
      return (
        <div>
          {renderFieldLabel(field, variant)}
          <select
            id={field.id}
            name={field.name}
            required={field.required}
            defaultValue=""
            className={inputClassName + " appearance-none"}
          >
            <option value="" disabled>
              {getFieldPlaceholder(field, variant)}
            </option>
            {(field.options ?? []).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );

    case "checkbox":
      return (
        <fieldset>
          <legend className={variant === "contactSection" ? "mb-2 font-inter text-[15px] font-medium text-white" : "mb-2 font-inter text-[16px] text-gray-600"}>
            {field.label}
          </legend>
          {(field.options ?? []).map((opt) => (
            <label
              key={opt}
              className={variant === "contactSection" ? "mb-2 flex cursor-pointer items-center gap-2 font-inter text-[15px] text-white/85" : "flex items-center gap-2 font-inter text-[15px] text-gray-600 mb-1 cursor-pointer"}
            >
              <input
                type="checkbox"
                name={field.name}
                value={opt}
                className="h-4 w-4"
              />
              {opt}
            </label>
          ))}
        </fieldset>
      );

    case "radio":
      return (
        <fieldset>
          <legend className={variant === "contactSection" ? "mb-2 font-inter text-[15px] font-medium text-white" : "font-inter text-[16px] text-gray-600 mb-2"}>
            {field.label}
          </legend>
          {(field.options ?? []).map((opt) => (
            <label
              key={opt}
              className={variant === "contactSection" ? "mb-2 flex cursor-pointer items-center gap-2 font-inter text-[15px] text-white/85" : "flex items-center gap-2 font-inter text-[15px] text-gray-600 mb-1 cursor-pointer"}
            >
              <input
                type="radio"
                name={field.name}
                value={opt}
                required={field.required}
                className="h-4 w-4"
              />
              {opt}
            </label>
          ))}
        </fieldset>
      );

    case "file":
      return (
        <div>
          {renderFieldLabel(field, variant)}
          <Input
            id={field.id}
            type="file"
            name={field.name}
            accept={field.accept}
            required={field.required}
            className={cn(inputClassName, variant === "contactSection" ? "file:mr-4 file:border-0 file:bg-transparent file:text-black" : "")}
          />
        </div>
      );

    case "html":
      return (
        <div
          className={variant === "contactSection" ? "text-white/85 [&_a]:text-brand-accent" : "text-gray-700 [&_a]:underline"}
          dangerouslySetInnerHTML={{ __html: field.htmlContent || "" }}
        />
      );

    default:
      return null;
  }
}
