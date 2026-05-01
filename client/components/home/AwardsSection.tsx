import * as LucideIcons from "lucide-react";
import { Check, type LucideIcon } from "lucide-react";
import type { HomeWhyChooseUsContent } from "@site/lib/cms/homePageTypes";
import RichText from "@site/components/shared/RichText";
import DynamicHeading from "@site/components/shared/DynamicHeading";

interface WhyChooseUsSectionProps {
  content?: HomeWhyChooseUsContent;
  headingTag?: string;
}

const normalizedIconMap = Object.entries(LucideIcons).reduce<Record<string, LucideIcon>>((acc, [name, icon]) => {
  if (name === "default" || name === "icons" || name === "aliases") {
    return acc;
  }

  const normalizedName = name.replace(/[^a-z0-9]/gi, "").toLowerCase();
  acc[normalizedName] = icon as LucideIcon;
  return acc;
}, {});

function resolveIcon(iconName: string | null | undefined): LucideIcon {
  if (!iconName || typeof iconName !== "string") {
    return Check;
  }

  const normalizedInput = iconName.replace(/[^a-z0-9]/gi, "").toLowerCase();
  return normalizedIconMap[normalizedInput] || Check;
}

export default function WhyChooseUsSection({ content, headingTag }: WhyChooseUsSectionProps) {
  if (!content) {
    return null;
  }

  const data = content;
  const items = (Array.isArray(data.items) ? data.items : [])
    .filter((item) => item && (item.title || item.description || item.icon))
    .slice(0, 4);
  const hasIntro = !!data.sectionLabel || !!data.heading || !!data.description;

  if (!data.image && !hasIntro && items.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-[40px] md:py-[72px]">
      <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%]">
        <div className={`grid grid-cols-1 ${data.image ? "lg:grid-cols-2" : ""} gap-10 lg:gap-[6%] items-stretch`}>
          {data.image ? (
            <div>
              <div className="h-full min-h-[360px] overflow-hidden border border-black/10 bg-[#f7f7f7] lg:min-h-full">
                <img
                  src={data.image}
                  alt={data.imageAlt || data.heading || "Why Choose Us"}
                  className="block h-full w-full object-cover object-center"
                  loading="lazy"
                />
              </div>
            </div>
          ) : null}

          <div className="pt-1">
            {data.sectionLabel ? (
              <DynamicHeading
                tag={headingTag}
                defaultTag="h2"
                className="mb-3 md:mb-4 font-inter text-[18px] font-semibold uppercase tracking-[0.08em] text-brand-accent md:text-[24px]"
              >
                {data.sectionLabel}
              </DynamicHeading>
            ) : null}

            {data.heading ? (
              <p className="mb-5 md:mb-6 max-w-[720px] font-playfair text-[34px] leading-[1.08] text-black md:text-[52px]">
                {data.heading}
              </p>
            ) : null}

            {data.description ? (
              <RichText
                html={data.description}
                className="max-w-[760px] font-inter text-[16px] leading-[1.75] text-black/80 [&_p]:my-0 [&_p+p]:mt-5 md:text-[19px] md:[&_p+p]:mt-6"
              />
            ) : null}

            {items.length > 0 ? (
              <div className="mt-7 space-y-5 md:mt-9 md:space-y-6">
                {items.map((item, index) => {
                  const Icon = resolveIcon(item.icon);

                  return (
                    <article
                      key={`${item.title}-${index}`}
                      className="border-b-2 border-brand-accent bg-white px-5 py-5 shadow-[0_12px_34px_rgba(0,0,0,0.07)] md:px-7 md:py-6"
                    >
                      <div className="flex items-start gap-3 md:gap-4">
                        <Icon className="mt-0.5 h-6 w-6 shrink-0 text-brand-accent md:h-7 md:w-7" strokeWidth={2} />
                        <div className="min-w-0 flex-1">
                          {item.title ? (
                            <h3 className="font-inter text-[22px] font-semibold uppercase leading-tight text-brand-accent md:text-[24px]">
                              {item.title}
                            </h3>
                          ) : null}
                          {item.description ? (
                            <RichText
                              html={item.description}
                              className="mt-3 font-inter text-[16px] leading-[1.65] text-black/85 [&_p]:my-0 [&_p+p]:mt-4 md:text-[19px]"
                            />
                          ) : null}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
