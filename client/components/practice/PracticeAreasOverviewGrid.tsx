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

  return (
    <section className="bg-brand-dark py-[40px] md:py-[60px]">
      <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%] lg:w-[85%]">
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

        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 md:gap-8">
          {areas.map((area, index) => {
            const Icon = resolvePracticeAreaIcon(area.icon);
            const subPractices = Array.isArray(area.subPractices)
              ? area.subPractices.filter((item) => item && (item.title || item.description || item.link))
              : [];

            return (
              <article
                key={`${area.title}-${index}`}
                className="flex h-full flex-col bg-white px-6 pb-6 pt-5 shadow-[0_14px_40px_rgba(0,0,0,0.18)] md:px-8 md:pb-8 md:pt-6"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-6 w-6 shrink-0 text-brand-accent" strokeWidth={1.75} />
                  <h3 className="font-playfair text-[30px] leading-tight text-black md:text-[34px]">
                    {area.title}
                  </h3>
                </div>

                <div className="mt-4 h-[2px] w-full bg-brand-accent/70" />

                {area.description ? (
                  <RichText
                    html={area.description}
                    className="mt-5 font-inter text-[16px] leading-[1.75] text-black/85 md:text-[18px] [&_p]:my-0 [&_p+p]:mt-4"
                  />
                ) : null}

                {area.link ? (
                  <div className="mt-6">
                    <Link
                      to={area.link}
                      className="inline-flex min-h-[46px] items-center justify-center bg-brand-accent px-6 font-inter text-[16px] font-medium text-white transition-colors duration-300 hover:bg-brand-accent-dark"
                    >
                      View Practice
                    </Link>
                  </div>
                ) : null}

                {subPractices.length > 0 ? (
                  <div className="mt-7 space-y-4 border-t border-black/10 pt-6 md:mt-8 md:space-y-5 md:pt-7">
                    {subPractices.map((subPractice, subIndex) => (
                      <div key={`${subPractice.title}-${subIndex}`} className="border-l-2 border-brand-accent/80 pl-4 md:pl-5">
                        {subPractice.title ? (
                          <h4 className="font-inter text-[18px] font-semibold uppercase leading-tight text-brand-accent md:text-[20px]">
                            {subPractice.title}
                          </h4>
                        ) : null}
                        {subPractice.description ? (
                          <RichText
                            html={subPractice.description}
                            className="mt-2 font-inter text-[15px] leading-[1.7] text-black/80 md:text-[17px] [&_p]:my-0 [&_p+p]:mt-3"
                          />
                        ) : null}
                        {subPractice.link ? (
                          <Link
                            to={subPractice.link}
                            className="mt-3 inline-flex items-center gap-2 font-inter text-[15px] font-medium text-black transition-colors duration-200 hover:text-brand-accent md:text-[16px]"
                          >
                            Learn More
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
