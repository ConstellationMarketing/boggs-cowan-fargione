import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import type { AboutContent } from "@site/lib/cms/homePageTypes";
import DynamicHeading from "@site/components/shared/DynamicHeading";
import RichText from "@site/components/shared/RichText";

interface AboutSectionProps {
  content?: AboutContent;
  headingTag?: string;
  credentialsPlacement?: "side" | "below";
  contentAlignment?: "start" | "center";
}

function CredentialList({ title, items }: { title: string; items: string[] }) {
  if (!title && items.length === 0) {
    return null;
  }

  return (
    <div>
      {title ? (
        <h4 className="font-inter text-[18px] md:text-[20px] font-semibold text-black mb-3">
          {title}
        </h4>
      ) : null}
      {items.length > 0 ? (
        <ul className="space-y-2.5">
          {items.map((item, index) => (
            <li key={`${title}-${index}`} className="flex items-start gap-2.5 text-black/80">
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-accent text-white">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              <span className="font-inter text-[15px] md:text-[17px] leading-[1.5]">
                {item}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default function AboutSection({
  content,
  headingTag,
  credentialsPlacement = "side",
  contentAlignment = "start",
}: AboutSectionProps) {
  if (!content) {
    return null;
  }

  const data = content;
  const badges = (data.badges || []).slice(0, 3);
  const admissionsItems = (data.admissionsItems || []).filter(Boolean);
  const membershipsItems = (data.membershipsItems || []).filter(Boolean);
  const buttonText = data.contactLabel?.trim() || "Learn More";
  const buttonLink = data.contactText?.trim() || "/about/";
  const hasCredentials =
    !!data.credentialsTitle ||
    !!data.admissionsTitle ||
    !!data.membershipsTitle ||
    admissionsItems.length > 0 ||
    membershipsItems.length > 0;

  if (
    !data.sectionLabel &&
    !data.heading &&
    !data.description &&
    !data.attorneyImage &&
    badges.length === 0 &&
    !hasCredentials
  ) {
    return null;
  }

  return (
    <section className="bg-white py-[40px] md:py-[72px]">
      <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-[6%] items-start">
          <div>
            {data.attorneyImage ? (
              <div className="overflow-hidden rounded-lg border border-black/10 bg-[#f7f7f7]">
                <img
                  src={data.attorneyImage}
                  alt={data.attorneyImageAlt || data.heading || "Attorney"}
                  className="block w-full h-auto object-contain object-top"
                  loading="lazy"
                />
              </div>
            ) : null}

            {badges.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 md:gap-6 mt-6 md:mt-8">
                {badges.map((badge, index) => (
                  <div
                    key={`${badge.src}-${index}`}
                    className="flex min-h-[96px] md:min-h-[120px] items-center justify-center"
                  >
                    {badge.src ? (
                      <img
                        src={badge.src}
                        alt={badge.alt || `Badge ${index + 1}`}
                        className="max-h-[120px] md:max-h-[148px] w-full object-contain"
                        loading="lazy"
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className={`pt-1 ${contentAlignment === "center" ? "self-center" : ""}`}>
            {data.sectionLabel ? (
              <p className="font-inter text-brand-accent text-[18px] md:text-[24px] font-semibold uppercase tracking-[0.08em] mb-3 md:mb-4">
                {data.sectionLabel}
              </p>
            ) : null}

            {data.heading ? (
              <DynamicHeading
                tag={headingTag}
                defaultTag="h2"
                className="font-playfair text-black text-[34px] md:text-[52px] leading-[1.08] mb-5 md:mb-6 max-w-[720px]"
              >
                {data.heading}
              </DynamicHeading>
            ) : null}

            {data.description ? (
              <RichText
                html={data.description}
                className="font-inter text-[16px] md:text-[19px] leading-[1.75] text-black/80 max-w-[760px] [&_p]:my-0 [&_p+p]:mt-5 md:[&_p+p]:mt-6"
              />
            ) : null}

            {hasCredentials && credentialsPlacement === "side" ? (
              <div className="mt-7 md:mt-9 rounded-xl border border-black/10 bg-white p-5 md:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
                {data.credentialsTitle ? (
                  <h3 className="font-playfair text-brand-accent text-[26px] md:text-[32px] leading-tight mb-5 border-b border-black/10 pb-3">
                    {data.credentialsTitle}
                  </h3>
                ) : null}

                <div className="space-y-6">
                  <CredentialList
                    title={data.admissionsTitle}
                    items={admissionsItems}
                  />
                  <CredentialList
                    title={data.membershipsTitle}
                    items={membershipsItems}
                  />
                </div>
              </div>
            ) : null}

            <div className="mt-6 md:mt-8">
              <Link
                to={buttonLink}
                className="inline-flex min-h-[56px] items-center justify-center rounded-lg bg-brand-accent px-6 md:px-8 text-white font-inter text-[16px] md:text-[18px] font-medium transition-colors duration-300 hover:bg-brand-accent-dark"
              >
                {buttonText}
              </Link>
            </div>
          </div>
        </div>

        {hasCredentials && credentialsPlacement === "below" ? (
          <div className="mt-8 md:mt-10 flex justify-center">
            <div className="w-full max-w-[860px] rounded-xl border border-black/10 bg-white p-5 md:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
              {data.credentialsTitle ? (
                <h3 className="font-playfair text-brand-accent text-[26px] md:text-[32px] leading-tight mb-5 border-b border-black/10 pb-3 text-center">
                  {data.credentialsTitle}
                </h3>
              ) : null}

              <div className="grid gap-6 md:grid-cols-2">
                <CredentialList
                  title={data.admissionsTitle}
                  items={admissionsItems}
                />
                <CredentialList
                  title={data.membershipsTitle}
                  items={membershipsItems}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
