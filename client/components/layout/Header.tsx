import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, Phone, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSiteSettings, useGlobalPhone } from "@site/contexts/SiteSettingsContext";
import { cn } from "@/lib/utils";
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
          "sticky top-0 z-50 px-[30px] flex items-center justify-between transition-all duration-300",
          isScrolled ? "bg-black/95 py-[8px]" : "bg-transparent py-[20px]"
        )}
      >
        <div className="w-full flex items-center justify-between">
          {/* Logo - white via CSS filter */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={logoAlt}
                  className={cn(
                    "max-w-full brightness-0 invert transition-all duration-300",
                    isScrolled ? "w-[280px]" : "w-[380px]"
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
            <ul className="flex flex-wrap justify-center items-center -mx-[11px]">
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
              >
                <Phone className={cn(
                  "text-accent transition-all duration-300",
                  isScrolled ? "w-6 h-6" : "w-7 h-7"
                )} strokeWidth={1.5} />
                <span className={cn(
                  "font-inter font-semibold text-white hover:text-accent transition-all duration-300",
                  isScrolled ? "text-[28px]" : "text-[36px]"
                )}>
                  {phoneDisplay}
                </span>
              </a>
            ) : null}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-black border-border"
            >
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item, index) => {
                  const hasChildren =
                    item.children && item.children.length > 0;

                  return (
                    <MobileNavItem key={`mobile-nav-${item.href}-${index}`} item={item} hasChildren={hasChildren} />
                  );
                })}
                {phoneDisplay ? (
                  <a
                    href={`tel:${phoneNumber.replace(/\D/g, "")}`}
                    className="flex items-center gap-3 bg-accent text-white px-5 py-4 mt-4 hover:bg-accent/90 transition-colors"
                  >
                    <Phone className="w-6 h-6" strokeWidth={1.5} />
                    <span className="font-inter text-[22px] font-semibold">
                      {phoneDisplay}
                    </span>
                  </a>
                ) : null}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
}

/* ── Mobile nav item with collapsible children ── */

interface MobileNavItemProps {
  item: {
    label: string;
    href: string;
    openInNewTab?: boolean;
    children?: { label: string; href: string; openInNewTab?: boolean }[];
  };
  hasChildren?: boolean;
}

function MobileNavItem({
  item,
  hasChildren,
}: MobileNavItemProps) {
  const [expanded, setExpanded] = useState(false);

  if (!hasChildren) {
    return (
      <Link
        to={item.href}
        target={item.openInNewTab ? "_blank" : undefined}
        rel={item.openInNewTab ? "noopener noreferrer" : undefined}
        className="font-inter text-[20px] text-white py-[10px] px-[5%] border-b border-black/5 hover:opacity-80 transition-opacity"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div>
      <div className="flex items-center border-b border-black/5">
        <Link
          to={item.href}
          className="font-inter text-[20px] text-white py-[10px] px-[5%] hover:opacity-80 transition-opacity flex-1"
        >
          {item.label}
        </Link>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-white/70 hover:text-white p-2 mr-2 transition-colors"
          aria-label={expanded ? "Collapse submenu" : "Expand submenu"}
        >
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>
      <div className={`pl-[10%] py-1 ${expanded ? "block" : "hidden"}`}>
        {item.children!.map((child, idx) => (
          <Link
            key={idx}
            to={child.href}
            target={child.openInNewTab ? "_blank" : undefined}
            rel={child.openInNewTab ? "noopener noreferrer" : undefined}
            className="block font-inter text-[17px] text-white/80 py-[8px] hover:text-white transition-colors"
          >
            {child.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
