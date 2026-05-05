import { MessageSquare, Phone } from "lucide-react";
import { useGlobalPhone } from "@site/contexts/SiteSettingsContext";
import { cn } from "@site/lib/utils";

interface HeroContactActionsProps {
  consultationButtonText?: string;
  consultationButtonLink?: string;
  className?: string;
  stacked?: boolean;
}

export default function HeroContactActions({
  consultationButtonText,
  consultationButtonLink,
  className,
  stacked = false,
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
        className="bg-accent hover:bg-accent/90 transition-all duration-300 p-[6px] group"
      >
        <div className="flex items-center gap-3">
          <div className="bg-white p-[10px] flex items-center justify-center flex-shrink-0">
            <Phone className="w-5 h-5 md:w-6 md:h-6 text-accent" strokeWidth={1.5} />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-inter text-[12px] md:text-[14px] leading-tight text-white pb-[4px] font-normal truncate">
              {phoneLabel}
            </h4>
            <p className="font-inter text-[16px] md:text-[24px] text-white leading-tight font-semibold truncate">
              {phoneDisplay}
            </p>
          </div>
        </div>
      </a>

      {consultationButtonText ? (
        <a
          href={consultationButtonLink || "/contact/"}
          className="bg-white hover:bg-gray-100 transition-all duration-300 p-[6px] group"
        >
          <div className="flex items-center gap-3 h-full">
            <div className="bg-accent p-[10px] flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={1.5} />
            </div>
            <div className="min-w-0 flex-1 flex items-center">
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
