import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { ArrowRight, Scale, type LucideIcon } from "lucide-react";
import RichText from "@site/components/shared/RichText";
import DynamicHeading from "@site/components/shared/DynamicHeading";
import type { PracticeAreaGridItem, PracticeAreasGridCta } from "@site/lib/cms/practiceAreasPageTypes";

interface PracticeAreasOverviewGridProps {
  heading: string;
  description: string;
  areas: PracticeAreaGridItem[];
  headingTag?: string;
  footerTitle?: string;
  footerSubtitle?: string;
  footerButtons?: PracticeAreasGridCta[];
}

const normalizedIconMap = Object.entries(LucideIcons).reduce<Record<string, LucideIcon>>((acc, [name, icon]) => {
  if (name === "default" || name === "icons" || name === "aliases") {
    return acc;
  }
  const normalizedName = name.replace(/[^a-z0-9]/gi, "").toLowerCase();
  acc[normalizedName] = icon as LucideIcon;
  return acc;
}, {});

function resolveIcon(iconName: string | null | undefined, fallback: LucideIcon = Scale): LucideIcon {
  if (!iconName || typeof iconName !== "string") return fallback;
  const key = iconName.replace(/[^a-z0-9]/gi, "").toLowerCase();
  return normalizedIconMap[key] || fallback;
}

export default function PracticeAreasOverviewGrid({ heading, description, areas, headingTag, footerTitle, footerSubtitle, footerButtons }: PracticeAreasOverviewGridProps) {
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

        {/* Main practice area cards — image background, centered content, description hover-only on desktop */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {areas.map((area, index) => {
            const hasImage = Boolean((area as { image?: string }).image);
            const bgImage = (area as { image?: string }).image || "";

            return (
              <div key={`${area.title}-${index}`} className="flex flex-col items-center">
                {/* Card */}
                <article
                  className="group relative w-full overflow-hidden rounded-2xl shadow-[0_14px_40px_rgba(0,0,0,0.35)]"
                  style={{ minHeight: "260px" }}
                >
                  {/* Background image or gradient fallback */}
                  {hasImage ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${bgImage})` }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary to-brand-dark" />
                  )}

                  {/* Dark overlay — lighter on hover to reveal description */}
                  <div className="absolute inset-0 bg-black/55 transition-all duration-500 group-hover:bg-black/70" />

                  {/* Card content */}
                  <div className="relative flex flex-col items-center justify-center px-6 py-10 text-center h-full" style={{ minHeight: "260px" }}>
                    {/* Title — always visible */}
                    <h3 className="font-playfair text-[26px] leading-tight text-white drop-shadow md:text-[30px]">
                      {area.title}
                    </h3>

                    {/* Accent line */}
                    <div className="mx-auto mt-3 h-[2px] w-[50px] bg-brand-accent transition-all duration-300 group-hover:w-[70px]" />

                    {/* Description — hidden on desktop until hover, always visible on mobile */}
                    {area.description ? (
                      <div className="mt-4 md:max-h-0 md:overflow-hidden md:opacity-0 md:transition-all md:duration-500 md:group-hover:max-h-[300px] md:group-hover:opacity-100">
                        <RichText
                          html={area.description}
                          className="font-inter text-[14px] leading-[1.75] text-white/90 md:text-[15px] [&_p]:my-0 [&_p+p]:mt-2"
                        />
                      </div>
                    ) : null}
                  </div>
                </article>

                {/* Button below card — always visible, centered */}
                {area.link ? (
                  <div className="mt-4">
                    <Link
                      to={area.link}
                      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-brand-accent px-6 font-inter text-[15px] font-medium text-white transition-colors duration-300 hover:bg-brand-accent-dark"
                    >
                      {area.linkText || "View Practice"}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Sub-practice sections — one per main practice area */}
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

              {/* Sub-practice cards — white background, dark text, green titles */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
                {subPractices.map((sub, subIndex) => {
                  const SubIcon = sub.icon ? resolveIcon(sub.icon) : null;

                  return (
                    <div
                      key={`${sub.title}-${subIndex}`}
                      className="flex flex-col rounded-xl bg-white px-5 py-5 shadow-[0_4px_20px_rgba(0,0,0,0.10)] transition-shadow duration-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
                    >
                      {sub.title ? (
                        <div className="flex items-center gap-2">
                          {SubIcon ? (
                            <SubIcon className="h-5 w-5 shrink-0 text-brand-accent" strokeWidth={1.75} />
                          ) : null}
                          <h4 className="font-inter text-[16px] font-semibold text-brand-accent md:text-[17px]">
                            {sub.title}
                          </h4>
                        </div>
                      ) : null}

                      {sub.description ? (
                        <RichText
                          html={sub.description}
                          className="mt-2 flex-1 font-inter text-[14px] leading-[1.7] text-black/75 md:text-[15px] [&_p]:my-0 [&_p+p]:mt-2"
                        />
                      ) : null}

                      {sub.link ? (
                        <Link
                          to={sub.link}
                          className="mt-4 inline-flex items-center gap-2 font-inter text-[14px] font-medium text-brand-accent transition-colors duration-200 hover:text-brand-accent-dark md:text-[15px]"
                        >
                          Learn More
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Footer CTA */}
        {(footerTitle || footerSubtitle || (footerButtons && footerButtons.length > 0)) && (
          <div className="mt-[56px] md:mt-[72px] flex flex-col items-center text-center">
            {footerTitle ? (
              <p className="font-playfair text-[24px] leading-snug text-white md:text-[32px] max-w-[700px]">
                {footerTitle}
              </p>
            ) : null}
            {footerSubtitle ? (
              <p className="mt-3 max-w-[600px] font-inter text-[15px] leading-[1.7] text-white/75 md:text-[17px]">
                {footerSubtitle}
              </p>
            ) : null}
            {footerButtons && footerButtons.length > 0 ? (
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                {footerButtons.map((btn, i) =>
                  btn.link ? (
                    <Link
                      key={i}
                      to={btn.link}
                      className={
                        btn.variant === "outline"
                          ? "inline-flex min-h-[48px] items-center justify-center rounded-xl border-2 border-brand-accent bg-white px-7 font-inter text-[15px] font-medium text-brand-accent transition-colors duration-300 hover:bg-brand-accent hover:text-white"
                          : "inline-flex min-h-[48px] items-center justify-center rounded-xl bg-brand-accent px-7 font-inter text-[15px] font-medium text-white transition-colors duration-300 hover:bg-brand-accent-dark"
                      }
                    >
                      {btn.label}
                    </Link>
                  ) : null
                )}
              </div>
            ) : null}
          </div>
        )}

      </div>
    </section>
  );
}
