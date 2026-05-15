import type { ProcessContent } from "@site/lib/cms/homePageTypes";
import RichText from "@site/components/shared/RichText";
import DynamicHeading from "@site/components/shared/DynamicHeading";

interface ProcessSectionProps {
  content?: ProcessContent;
  headingTags?: Record<string, string>;
}

export default function ProcessSection({ content, headingTags }: ProcessSectionProps) {
  if (!content) {
    return null;
  }

  const data = content;
  const steps = (Array.isArray(data.steps) ? data.steps : []).filter(
    (step) => step && (step.number || step.title || step.description),
  );

  if (steps.length === 0) {
    return null;
  }

  return (
    <section className="bg-brand-dark py-[48px] md:py-[80px]">
      <div className="mx-auto w-[92%] max-w-[1200px]">
        <div className="mx-auto max-w-[760px] text-center">
          {data.sectionLabel ? (
            <DynamicHeading
              tag={headingTags?.["process.sectionLabel"]}
              defaultTag="h2"
              className="mb-3 font-inter text-[18px] font-semibold uppercase tracking-[0.08em] text-brand-accent md:text-[24px]"
            >
              {data.sectionLabel}
            </DynamicHeading>
          ) : null}

          {data.heading ? (
            <p className="font-playfair text-[34px] leading-[1.08] text-white md:text-[52px]">
              {data.heading}
            </p>
          ) : null}

          {data.description ? (
            <RichText
              html={data.description}
              className="mt-3 font-inter text-[16px] leading-[1.7] text-white/80 [&_p]:my-0 [&_p+p]:mt-4 md:text-[19px]"
            />
          ) : null}
        </div>

        <div className="relative mx-auto mt-12 max-w-[980px] md:mt-16">
          <div className="absolute bottom-0 left-[11px] top-0 w-px bg-brand-accent md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-10 md:space-y-0">
            {steps.map((step, index) => {
              const isRight = index % 2 === 1;
              const stepLabel = step.number?.trim() || `STEP ${index + 1}`;

              return (
                <div
                  key={`${step.title}-${index}`}
                  className="relative md:grid md:grid-cols-2 md:gap-x-14"
                >
                  <div
                    className={[
                      "relative pl-10 text-center md:pl-0",
                      isRight
                        ? "md:col-start-2 md:pb-14 md:pt-10 md:text-left"
                        : "md:col-start-1 md:pb-14 md:pt-10 md:text-right",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "flex w-fit min-h-[28px] items-center rounded-xl bg-brand-accent px-3 font-inter text-[12px] font-semibold uppercase tracking-[0.06em] text-white",
                        !isRight ? "mx-auto md:ml-auto md:mr-0" : "mx-auto md:mx-0",
                      ].join(" ")}
                    >
                      {stepLabel}
                    </span>

                    {step.title ? (
                      <h3 className="mt-3 font-inter text-[20px] font-semibold uppercase leading-tight text-white">
                        {step.title}
                      </h3>
                    ) : null}

                    {step.description ? (
                      <RichText
                        html={step.description}
                        className="mt-3 font-inter text-[16px] leading-[1.6] text-white/85 [&_p]:my-0 [&_p+p]:mt-4 md:text-[19px]"
                      />
                    ) : null}
                  </div>

                  <span className="absolute left-[11px] top-2.5 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-brand-accent bg-brand-dark md:left-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
