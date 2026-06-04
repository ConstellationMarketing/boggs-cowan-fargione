import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import { useSiteSettings, useGlobalPhone } from "@site/contexts/SiteSettingsContext";
import { cn } from "@/lib/utils";
import MobileNavSheet from "./MobileNavSheet";
import NavDropdown from "./NavDropdown";

export default function Header() {
  const { settings } = useSiteSettings();
  const { phoneNumber, phoneDisplay } = useGlobalPhone();
  const [isScrolled, setIsScrolled] = useState(false);

  const logoUrl = settings.logoUrl?.trim() || "";
  const logoAlt =
    settings.logoAlt?.trim() || settings.siteName?.trim() || "Logo";

  const navItems = [...(settings.navigationItems ?? [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Sticky header wrapper - fullwidth, transparent background */}
      <div
        className={cn(
          "sticky top-0 z-50 flex items-center justify-between px-4 sm:px-5 md:px-6 lg:px-[30px] transition-all duration-300",
          isScrolled ? "bg-black/95 py-2" : "bg-transparent py-3 md:py-[20px]"
        )}
      >
        <div className="flex w-full min-w-0 items-center justify-between gap-3 md:gap-4">
          {/* Logo - white via CSS filter */}
          <div className="flex min-w-0 flex-1 items-center lg:flex-none">
            <Link to="/" className="block max-w-full">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={logoAlt}
                  className={cn(
                    "block max-w-full brightness-0 invert transition-all duration-300",
                    isScrolled
                      ? "w-[175px] sm:w-[205px] md:w-[240px] lg:w-[220px] xl:w-[280px]"
                      : "w-[210px] sm:w-[245px] md:w-[280px] lg:w-[260px] xl:w-[380px]"
                  )}
                  width={380}
                  height={62}
                />
              ) : (
                <span className="font-inter text-white text-[22px] leading-none">
                  {settings.siteName || " "}
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex items-center flex-1 justify-center">
            <ul className="flex flex-nowrap justify-center items-center -mx-[11px]">
              {navItems.map((item, index) => {
                const hasChildren =
                  item.children && item.children.length > 0;

                return (
                  <li key={`nav-${item.href}-${index}`} className="px-[11px] flex items-center">
                    {hasChildren ? (
                      <NavDropdown item={item} />
                    ) : (
                      <Link
                        to={item.href}
                        target={
                          item.openInNewTab ? "_blank" : undefined
                        }
                        rel={
                          item.openInNewTab
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="font-inter text-[16px] text-white mr-[20px] whitespace-nowrap hover:opacity-80 transition-opacity duration-400"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Phone Number Display - Desktop */}
          <div className="hidden lg:block flex-shrink-0">
            {phoneDisplay ? (
              <a
                href={`tel:${phoneNumber.replace(/\D/g, "")}`}
                className="flex items-center gap-3 transition-all duration-300"
                suppressHydrationWarning
              >
                <Phone className={cn(
                  "text-accent transition-all duration-300",
                  isScrolled ? "w-6 h-6" : "w-7 h-7"
                )} strokeWidth={1.5} />
                <span
                  className={cn(
                    "font-inter font-semibold text-white hover:text-accent transition-all duration-300",
                    isScrolled ? "text-[22px] lg:text-[22px] xl:text-[28px]" : "text-[26px] lg:text-[26px] xl:text-[36px]"
                  )}
                  suppressHydrationWarning
                >
                  {phoneDisplay}
                </span>
              </a>
            ) : null}
          </div>

          {/* Mobile Menu */}
          <MobileNavSheet
            navItems={navItems}
            phoneDisplay={phoneDisplay}
            phoneNumber={phoneNumber}
            variant="header"
          />
        </div>
      </div>
    </>
  );
}
