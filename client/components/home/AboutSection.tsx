import { useEffect, useRef, type ReactNode } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { AboutBadge, AboutContent } from "@site/lib/cms/homePageTypes";
import DynamicHeading from "@site/components/shared/DynamicHeading";
import RichText from "@site/components/shared/RichText";

interface AboutSectionProps {
  content?: AboutContent;
  headingTag?: string;
  credentialsPlacement?: "side" | "below";
  contentAlignment?: "start" | "center";
  buttonTone?: "green" | "navy";
}

function BadgeLinkWrapper({ badge, children }: { badge: AboutBadge; children: ReactNode }) {
  const link = badge.link?.trim();

  if (!link) {
    return <div className="block h-full">{children}</div>;
  }

  if (link.startsWith("/")) {
    return (
      <Link to={link} className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2">
        {children}
      </Link>
    );
  }

  return (
    <a
      href={link}
      className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
      rel="noopener noreferrer"
      target={link.startsWith("http://") || link.startsWith("https://") ? "_blank" : undefined}
    >
      {children}
    </a>
  );
}

function BadgeSlider({ badges }: { badges: AboutBadge[] }) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "previous" | "next") => {
    const slider = sliderRef.current;
    if (!slider) {
      return;
    }

    const scrollAmount = slider.clientWidth * 0.8;
    const isAtEnd = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 8;

    if (direction === "next" && isAtEnd) {
      slider.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    slider.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (badges.length <= 2) {
      return;
    }

    const interval = window.setInterval(() => {
      scroll("next");
    }, 3500);

    return () => window.clearInterval(interval);
  }, [badges.length]);

  return (
    <div className="relative mt-6 md:mt-8">
      <div
        ref={sliderRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] md:gap-6 [&::-webkit-scrollbar]:hidden"
        aria-label="Badges and awards"
      >
        {badges.map((badge, index) => (
          <div
            key={`${badge.src}-${index}`}
            className="min-w-[44%] snap-start sm:min-w-[32%] lg:min-w-[30%]"
          >
            <BadgeLinkWrapper badge={badge}>
              <div className="flex min-h-[96px] items-center justify-center md:min-h-[120px]">
                {badge.src ? (
                  <img
                    src={badge.src}
                    alt={badge.alt || `Badge ${index + 1}`}
                    className="max-h-[120px] w-full object-contain md:max-h-[148px]"
                    loading="lazy"
                  />
                ) : null}
              </div>
            </BadgeLinkWrapper>
          </div>
        ))}
      </div>

      {badges.length > 2 ? (
        <div className="mt-3 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => scroll("previous")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/15 bg-white text-brand-navy transition-colors hover:bg-brand-accent hover:text-white"
            aria-label="Previous badge"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scroll("next")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/15 bg-white text-brand-navy transition-colors hover:bg-brand-accent hover:text-white"
            aria-label="Next badge"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  );
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
  buttonTone = "green",
}: AboutSectionProps) {
  if (!content) {
    return null;
  }

  const data = content;
  const badges = (data.badges || []).filter((badge) => badge.src);
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
  const buttonClassName =
    buttonTone === "navy"
      ? "inline-flex min-h-[56px] items-center justify-center rounded-xl bg-brand-navy px-6 md:px-8 text-white font-inter text-[16px] md:text-[18px] font-medium transition-colors duration-300 hover:bg-brand-navy-dark"
      : "inline-flex min-h-[56px] items-center justify-center rounded-xl bg-brand-accent px-6 md:px-8 text-white font-inter text-[16px] md:text-[18px] font-medium transition-colors duration-300 hover:bg-brand-accent-dark";

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
              <div className="relative overflow-hidden rounded-xl border border-black/10 bg-[#f7f7f7]">
                <img
                  src={data.attorneyImage}
                  alt={data.attorneyImageAlt || data.heading || "Attorney"}
                  className="block w-full h-auto object-contain object-top"
                  loading="lazy"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-3 z-10 border-2 border-brand-accent md:inset-4"
                />
                <div className="pointer-events-none absolute right-3 top-3 z-20 flex aspect-square w-[28%] min-w-[116px] max-w-[200px] bg-brand-accent p-2 text-white md:right-4 md:top-4 md:p-3">
                  <div className="flex h-full w-full flex-col items-center justify-center border-2 border-white px-1 text-center font-inter uppercase leading-none">
                    <span className="whitespace-nowrap text-[clamp(2.25rem,6vw,4.5rem)] font-medium tracking-[-0.04em]">10+</span>
                    <span className="mt-1 whitespace-nowrap text-[clamp(0.72rem,1.75vw,1.35rem)] font-medium leading-[1.05] tracking-[0.01em]">Years of</span>
                    <span className="whitespace-nowrap text-[clamp(0.72rem,1.75vw,1.35rem)] font-medium leading-[1.05] tracking-[0.01em]">Experience</span>
                  </div>
                </div>
              </div>
            ) : null}

            {badges.length > 0 ? <BadgeSlider badges={badges} /> : null}
          </div>

          <div className={`pt-1 text-center lg:text-left ${contentAlignment === "center" ? "self-center" : ""}`}>
            {data.sectionLabel ? (
              <p className="font-inter text-brand-accent text-[18px] md:text-[24px] font-semibold uppercase tracking-[0.08em] mb-3 md:mb-4">
                {data.sectionLabel}
              </p>
            ) : null}

            {data.heading ? (
              <DynamicHeading
                tag={headingTag}
                defaultTag="h2"
                className="mx-auto max-w-[720px] font-playfair text-[34px] leading-[1.08] text-black mb-5 md:text-[52px] md:mb-6 lg:mx-0"
              >
                {data.heading}
              </DynamicHeading>
            ) : null}

            {data.description ? (
              <RichText
                html={data.description}
                className="mx-auto max-w-[760px] font-inter text-[16px] leading-[1.75] text-black/80 [&_p]:my-0 [&_p+p]:mt-5 md:text-[19px] md:[&_p+p]:mt-6 lg:mx-0"
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

            <div className="mt-6 flex justify-center md:mt-8 lg:justify-start">
              <Link
                to={buttonLink}
                className={buttonClassName}
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
