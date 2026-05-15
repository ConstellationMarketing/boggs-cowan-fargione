import { MessageSquare, Phone } from "lucide-react";
import { useGlobalPhone } from "@site/contexts/SiteSettingsContext";
import { cn } from "@site/lib/utils";

interface HeroContactActionsProps {
  consultationButtonText?: string;
  consultationButtonLink?: string;
  className?: string;
  stacked?: boolean;
  consultationButtonClassName?: string;
}

export default function HeroContactActions({
  consultationButtonText,
  consultationButtonLink,
  className,
  stacked = false,
  consultationButtonClassName,
}: HeroContactActionsProps) {
  const { phoneNumber, phoneDisplay, phoneLabel } = useGlobalPhone();

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
        className="block overflow-hidden rounded-xl bg-accent p-[6px] transition-all duration-300 hover:bg-accent/90 group"
      >
        <div className="flex items-center justify-center gap-3 text-center sm:text-left">
          <div className="flex flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-[10px]">
            <Phone className="w-5 h-5 md:w-6 md:h-6 text-accent" strokeWidth={1.5} />
          </div>
          <div className="min-w-0 text-center sm:flex-1 sm:text-left">
            <h4 className="font-inter text-[12px] md:text-[14px] leading-tight text-white pb-[4px] font-normal sm:truncate">
              {phoneLabel}
            </h4>
            <p className="font-inter text-[16px] md:text-[24px] text-white leading-tight font-semibold sm:truncate">
              {phoneDisplay}
            </p>
          </div>
        </div>
      </a>

      {consultationButtonText ? (
        <a
          href={consultationButtonLink || "/contact/"}
          className={cn(
            "block overflow-hidden rounded-xl bg-white p-[6px] transition-all duration-300 hover:bg-gray-100 group",
            consultationButtonClassName,
          )}
        >
          <div className="flex h-full items-center justify-center gap-3 text-center sm:text-left">
            <div className="flex flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-accent p-[10px]">
              <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={1.5} />
            </div>
            <div className="min-w-0 flex items-center justify-center text-center sm:flex-1 sm:justify-start sm:text-left">
              <p className="font-inter text-[14px] md:text-[22px] text-accent leading-tight font-semibold">
                {consultationButtonText}
              </p>
            </div>
          </div>
        </a>
      ) : null}
    </div>
  );
}
