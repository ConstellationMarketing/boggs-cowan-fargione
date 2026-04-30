import { Link } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { Scale, type LucideIcon } from "lucide-react";
import type { PracticeAreaItem } from "@site/lib/cms/homePageTypes";

interface PracticeAreasGridProps {
  areas?: PracticeAreaItem[];
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

export default function PracticeAreasGrid({ areas }: PracticeAreasGridProps) {
  if (!areas || areas.length === 0) {
    return null;
  }

  return (
    <section className="bg-brand-dark py-[40px] md:py-[60px]">
      <div className="max-w-[2560px] mx-auto w-[95%] md:w-[90%] lg:w-[85%]">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {areas.map((area, index) => {
            const Icon = resolvePracticeAreaIcon(area.icon);
            const subPractices = Array.isArray(area.subPractices)
              ? area.subPractices.filter(
                  (item): item is { text: string; link: string } =>
                    !!item
                    && typeof item.text === "string"
                    && item.text.trim().length > 0,
                )
              : [];

            return (
              <article
                key={`${area.title}-${index}`}
                className="flex min-h-[360px] flex-col bg-white px-6 pb-6 pt-5 text-center shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
              >
                <div className="flex items-center justify-center gap-3">
                  <Icon className="h-6 w-6 text-brand-accent" strokeWidth={1.75} />
                  <h3 className="font-playfair text-[28px] leading-tight text-black">
                    {area.title}
                  </h3>
                </div>

                <div className="mx-auto mt-4 h-[2px] w-full bg-brand-accent/70" />

                <ul className="mt-5 flex-1 space-y-3 font-inter text-[18px] leading-[28px] text-black/90">
                  {subPractices.map((item, itemIndex) => (
                    <li key={`${item.text}-${itemIndex}`}>
                      {item.link ? (
                        <Link
                          to={item.link}
                          className="text-inherit no-underline transition-colors duration-200 hover:text-brand-accent hover:underline"
                        >
                          {item.text}
                        </Link>
                      ) : (
                        item.text
                      )}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex justify-center">
                  <Link
                    to={area.link || "/practice-areas/"}
                    className="inline-flex min-h-[46px] items-center justify-center bg-brand-accent px-6 font-inter text-[16px] font-medium text-white transition-colors duration-300 hover:bg-brand-accent-dark"
                  >
                    Learn More
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
