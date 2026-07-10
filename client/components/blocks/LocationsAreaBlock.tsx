import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import type { ContentBlock } from "@site/lib/blocks";

interface LocationsAreaBlockProps {
  block: Extract<ContentBlock, { type: "locations-area" }>;
}

function LocationList({
  heading,
  locations,
}: {
  heading: string;
  locations: Array<{ name: string; link: string }>;
}) {
  return (
    <div>
      <h3 className="font-inter text-[13px] font-semibold uppercase tracking-[0.12em] text-brand-accent mb-5">
        {heading}
      </h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        {locations.map((loc, index) => {
          const name = loc.name?.trim() || "";
          const link = loc.link?.trim() || "";

          if (!name) {
            return null;
          }

          const inner = (
            <span className="flex items-center gap-2.5 font-inter text-[16px] leading-snug text-black/80 group-hover:text-brand-accent transition-colors duration-200">
              <MapPin className="h-4 w-4 shrink-0 text-brand-accent opacity-70" aria-hidden="true" />
              {name}
            </span>
          );

          return (
            <li key={`${name}-${index}`}>
              {link ? (
                <Link
                  to={link}
                  className="group inline-flex items-center"
                  aria-label={`Learn more about ${name}`}
                >
                  {inner}
                </Link>
              ) : (
                <span className="inline-flex items-center opacity-60">{inner}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function LocationsAreaBlock({ block }: LocationsAreaBlockProps) {
  const primaryLocations = (block.primaryLocations || []).filter((l) => l.name?.trim());
  const surroundingLocations = (block.surroundingLocations || []).filter((l) => l.name?.trim());

  return (
    <section className="bg-[#f7f8fa] py-[48px] md:py-[80px]">
      <div className="mx-auto w-[95%] max-w-[1080px] md:w-[90%]">
        {block.sectionLabel ? (
          <p className="mb-3 font-inter text-[14px] font-semibold uppercase tracking-[0.12em] text-brand-accent md:text-[16px]">
            {block.sectionLabel}
          </p>
        ) : null}

        <div className="rounded-2xl border border-black/10 bg-white shadow-[0_16px_48px_rgba(0,0,0,0.07)]">
          <div className="grid grid-cols-1 divide-y divide-black/10 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            {/* Primary locations */}
            <div className="p-7 md:p-10">
              <LocationList
                heading={block.primaryHeading || "Primary Locations"}
                locations={primaryLocations}
              />
            </div>

            {/* Surrounding communities */}
            <div className="p-7 md:p-10">
              <LocationList
                heading={block.surroundingHeading || "Surrounding Communities"}
                locations={surroundingLocations}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
