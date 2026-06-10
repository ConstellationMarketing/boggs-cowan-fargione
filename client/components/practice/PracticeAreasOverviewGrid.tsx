import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { ArrowRight, Scale, type LucideIcon } from "lucide-react";
import RichText from "@site/components/shared/RichText";
import DynamicHeading from "@site/components/shared/DynamicHeading";
import type { PracticeAreaGridItem } from "@site/lib/cms/practiceAreasPageTypes";

interface PracticeAreasOverviewGridProps {
  heading: string;
  description: string;
  areas: PracticeAreaGridItem[];
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

function resolvePracticeAreaIcon(iconName: string | null | undefined): LucideIcon {
  if (!iconName || typeof iconName !== "string") {
    return Scale;
  }

  const normalizedInput = iconName.replace(/[^a-z0-9]/gi, "").toLowerCase();
  return normalizedIconMap[normalizedInput] || Scale;
}

export default function PracticeAreasOverviewGrid({ heading, description, areas, headingTag }: PracticeAreasOverviewGridProps) {
  if (!heading && !description && areas.length === 0) {
    return null;
  }

  const areasWithSubs = areas.filter((area) => {
    const subs = Array.isArray(area.subPractices)
      ? area.subPractices.filter((s) => s && (s.title || s.link))
      : [];
    return subs.length > 0;
  });

  return (
    <section className="bg-brand-dark py-[40px] md:py-[60px]">
      <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%] lg:w-[85%]">

        {/* Section header */}
        {(heading || description) && (
          <div className="mx-auto mb-[30px] max-w-[900px] text-center md:mb-[50px]">
            {heading ? (
              <DynamicHeading
                tag={headingTag}
                defaultTag="h2"
                className="font-playfair text-[32px] leading-tight text-white md:text-[48px] lg:text-[54px] md:leading-[54px]"
              >
                {heading}
              </DynamicHeading>
            ) : null}
            {description ? (
              <RichText
                html={description}
                className="mx-auto mt-[15px] max-w-[800px] font-outfit text-[16px] leading-[24px] text-white/80 md:text-[18px] md:leading-[28px]"
              />
            ) : null}
          </div>
        )}

        {/* Main practice area cards — 3 in one row */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {areas.map((area, index) => {
            const Icon = resolvePracticeAreaIcon(area.icon);

            return (
              <article
                key={`${area.title}-${index}`}
                className="flex flex-col overflow-hidden rounded-xl bg-white px-6 pb-6 pt-5 shadow-[0_14px_40px_rgba(0,0,0,0.22)]"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-6 w-6 shrink-0 text-brand-accent" strokeWidth={1.75} />
                  <h3 className="font-playfair text-[26px] leading-tight text-black md:text-[28px]">
                    {area.title}
                  </h3>
                </div>

                <div className="mt-4 h-[2px] w-full bg-brand-accent/70" />

                {area.description ? (
                  <RichText
                    html={area.description}
                    className="mt-4 flex-1 font-inter text-[15px] leading-[1.75] text-black/80 md:text-[16px] [&_p]:my-0 [&_p+p]:mt-3"
                  />
                ) : null}

                {area.link ? (
                  <div className="mt-6">
                    <Link
                      to={area.link}
                      className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand-accent px-6 font-inter text-[15px] font-medium text-white transition-colors duration-300 hover:bg-brand-accent-dark"
                    >
                      {area.linkText || "View Practice"}
                    </Link>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>

        {/* Sub-practice sections — one section per main practice area */}
        {areasWithSubs.map((area, areaIndex) => {
          const subPractices = area.subPractices.filter((s) => s && (s.title || s.link));
          const sectionTitle = area.subgroupTitle?.trim() || `${area.title} Services`;

          return (
            <div key={`subs-${area.title}-${areaIndex}`} className="mt-[48px] md:mt-[64px]">
              {/* Sub-group heading */}
              <div className="mb-[24px] text-center md:mb-[32px]">
                <h3 className="font-playfair text-[26px] leading-tight text-white md:text-[34px]">
                  {sectionTitle}
                </h3>
                <div className="mx-auto mt-3 h-[2px] w-[60px] bg-brand-accent" />
              </div>

              {/* Sub-practices grid — 2 or 3 per row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
                {subPractices.map((sub, subIndex) => (
                  <div
                    key={`${sub.title}-${subIndex}`}
                    className="flex flex-col rounded-xl border border-white/10 bg-white/5 px-5 py-5 transition-colors duration-200 hover:bg-white/10"
                  >
                    {sub.title ? (
                      <h4 className="font-inter text-[16px] font-semibold uppercase tracking-wide text-brand-accent md:text-[17px]">
                        {sub.title}
                      </h4>
                    ) : null}

                    {sub.description ? (
                      <RichText
                        html={sub.description}
                        className="mt-2 flex-1 font-inter text-[14px] leading-[1.7] text-white/75 md:text-[15px] [&_p]:my-0 [&_p+p]:mt-2"
                      />
                    ) : null}

                    {sub.link ? (
                      <Link
                        to={sub.link}
                        className="mt-4 inline-flex items-center gap-2 font-inter text-[14px] font-medium text-white/90 transition-colors duration-200 hover:text-brand-accent md:text-[15px]"
                      >
                        Learn More
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
}
