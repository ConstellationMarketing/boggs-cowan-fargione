import { MessageSquare, Phone } from "lucide-react";
import { useGlobalPhone } from "@site/contexts/SiteSettingsContext";
import { cn } from "@site/lib/utils";

interface HeroContactActionsProps {
  consultationButtonText?: string;
  consultationButtonLink?: string;
  className?: string;
  stacked?: boolean;
  consultationButtonClassName?: string;
  ctaTone?: "green" | "navy";
}

export default function HeroContactActions({
  consultationButtonText,
  consultationButtonLink,
  className,
  stacked = false,
  consultationButtonClassName,
  ctaTone = "green",
}: HeroContactActionsProps) {
  const { phoneNumber, phoneDisplay, phoneLabel } = useGlobalPhone();
  const isNavyTone = ctaTone === "navy";

  return (
    <div
      className={cn(
        "grid w-full gap-3",
        stacked || !consultationButtonText ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2",
        className,
      )}
    >
      <a
        href={`tel:${phoneNumber.replace(/\D/g, "")}`}
        suppressHydrationWarning
        className={cn(
          "block overflow-hidden rounded-xl p-[6px] transition-all duration-300 group",
          isNavyTone ? "bg-brand-navy hover:bg-brand-navy-dark" : "bg-accent hover:bg-accent/90",
        )}
      >
        <div className="flex items-center justify-center gap-3 text-center sm:text-left">
          <div className="flex flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-[10px]">
            <Phone
              className={cn(
                "w-5 h-5 md:w-6 md:h-6",
                isNavyTone ? "text-brand-navy" : "text-accent",
              )}
              strokeWidth={1.5}
            />
          </div>
          <div className="min-w-0 text-center sm:flex-1 sm:text-left">
            <h4 className="font-inter text-[12px] md:text-[14px] leading-tight text-white pb-[4px] font-normal sm:truncate">
              {phoneLabel}
            </h4>
            <p
              className="font-inter text-[16px] md:text-[24px] text-white leading-tight font-semibold sm:truncate"
              suppressHydrationWarning
            >
              {phoneDisplay}
            </p>
          </div>
        </div>
      </a>

      {consultationButtonText ? (
        <a
          href={consultationButtonLink || "/contact/"}
          className={cn(
            "block overflow-hidden rounded-xl bg-white p-[6px] transition-all duration-300 group",
            isNavyTone ? "hover:bg-slate-100" : "hover:bg-gray-100",
            consultationButtonClassName,
          )}
        >
          <div className="flex h-full items-center justify-center gap-3 text-center sm:text-left">
            <div
              className={cn(
                "flex flex-shrink-0 items-center justify-center overflow-hidden rounded-xl p-[10px]",
                isNavyTone ? "bg-brand-navy" : "bg-accent",
              )}
            >
              <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={1.5} />
            </div>
            <div className="min-w-0 flex items-center justify-center text-center sm:flex-1 sm:justify-start sm:text-left">
              <p
                className={cn(
                  "font-inter text-[14px] md:text-[22px] leading-tight font-semibold",
                  isNavyTone ? "text-brand-navy" : "text-accent",
                )}
              >
                {consultationButtonText}
              </p>
            </div>
          </div>
        </a>
      ) : null}
    </div>
  );
}
