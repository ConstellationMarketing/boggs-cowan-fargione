import type { ContentBlock } from "@site/lib/blocks";

interface LocationsMapBlockProps {
  block: Extract<ContentBlock, { type: "locations-map" }>;
}

export default function LocationsMapBlock({ block }: LocationsMapBlockProps) {
  return (
    <section className="bg-white py-[48px] md:py-[80px]">
      <div className="mx-auto w-[95%] max-w-[1200px] md:w-[90%]">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-[6%]">
          {/* Text side */}
          <div className="lg:pt-2">
            {block.heading ? (
              <h2 className="font-playfair text-[30px] leading-[1.1] text-black md:text-[42px]">
                {block.heading}
              </h2>
            ) : null}

            {block.body ? (
              <p className="mt-4 font-inter text-[17px] leading-[1.75] text-black/75 md:mt-5 md:text-[19px]">
                {block.body}
              </p>
            ) : null}

            <div className="mt-7 rounded-xl border border-black/10 bg-[#f7f8fa] px-5 py-4 md:mt-8">
              <p className="font-inter text-[14px] font-semibold uppercase tracking-[0.1em] text-brand-accent mb-3">
                Primary Locations
              </p>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 font-inter text-[14px] text-black/70">
                <li>Athens, GA</li>
                <li>Commerce, GA</li>
                <li>Elberton, GA</li>
                <li>Franklin Springs, GA</li>
                <li>Gwinnett County, GA</li>
                <li>Lawrenceville, GA</li>
                <li>Madison, GA</li>
                <li>Monroe, GA</li>
                <li>Royston, GA</li>
                <li>Watkinsville, GA</li>
                <li>Winder, GA</li>
              </ul>
            </div>
          </div>

          {/* Map side */}
          <div className="overflow-hidden rounded-2xl border border-black/10 shadow-[0_16px_48px_rgba(0,0,0,0.08)]">
            {block.mapEmbedUrl ? (
              <iframe
                src={block.mapEmbedUrl}
                width="100%"
                height="520"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Boggs, Cowan & Fargione Service Areas"
              />
            ) : (
              <div className="flex h-[520px] items-center justify-center bg-gray-100 text-gray-400">
                No map configured
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
