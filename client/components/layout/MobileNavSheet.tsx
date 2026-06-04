import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChevronDown, Menu, Phone } from "lucide-react";
import { useDniPhone } from "@site/contexts/DniPhoneContext";
import PhoneLink from "@site/components/shared/PhoneLink";
import { cn } from "@/lib/utils";

export interface MobileNavGrandchildItem {
  label: string;
  href: string;
  openInNewTab?: boolean;
}

export interface MobileNavChildItem {
  label: string;
  href: string;
  openInNewTab?: boolean;
  children?: MobileNavGrandchildItem[];
}

export interface MobileNavMenuItem {
  label: string;
  href: string;
  openInNewTab?: boolean;
  children?: MobileNavChildItem[];
}

interface MobileNavSheetProps {
  navItems: MobileNavMenuItem[];
  phoneDisplay?: string;
  phoneNumber?: string;
  variant?: "header" | "footer";
}

export default function MobileNavSheet({
  navItems,
  variant = "header",
}: MobileNavSheetProps) {
  const { activePhoneDisplay, activePhoneNumber } = useDniPhone();
  const trigger =
    variant === "header" ? (
      <Button
        variant="ghost"
        size="icon"
        className="h-11 w-11 shrink-0 text-white hover:bg-white/10 hover:text-white lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="h-6 w-6" />
      </Button>
    ) : (
      <Button
        variant="ghost"
        className="inline-flex h-11 items-center gap-2 rounded-none border border-white/20 px-4 text-white hover:bg-white/10 hover:text-white lg:hidden"
        aria-label="Open footer navigation menu"
      >
        <Menu className="h-5 w-5" />
        <span className="font-inter text-[16px] font-medium">Menu</span>
      </Button>
    );

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="border-white/10 bg-black text-white">
        <nav className="mt-8 flex flex-col gap-4">
          {navItems.map((item, index) => {
            const hasChildren = item.children && item.children.length > 0;

            return (
              <MobileNavItem
                key={`mobile-nav-${item.href}-${index}`}
                item={item}
                hasChildren={hasChildren}
              />
            );
          })}

          {activePhoneNumber ? (
            <PhoneLink className="mt-4 flex items-center gap-3 bg-accent px-5 py-4 text-white transition-colors hover:bg-accent/90">
              <Phone className="h-6 w-6" strokeWidth={1.5} />
              <span className="font-inter text-[22px] font-semibold" suppressHydrationWarning>
                {activePhoneDisplay}
              </span>
            </PhoneLink>
          ) : null}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

interface MobileNavItemProps {
  item: MobileNavMenuItem;
  hasChildren?: boolean;
}

function MobileNavItem({ item, hasChildren }: MobileNavItemProps) {
  const [expanded, setExpanded] = useState(false);

  if (!hasChildren) {
    return (
      <Link
        to={item.href}
        target={item.openInNewTab ? "_blank" : undefined}
        rel={item.openInNewTab ? "noopener noreferrer" : undefined}
        className="border-b border-white/10 px-[5%] py-[10px] font-inter text-[20px] text-white transition-opacity hover:opacity-80"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div>
      <div className="flex items-center border-b border-white/10">
        <Link
          to={item.href}
          className="flex-1 px-[5%] py-[10px] font-inter text-[20px] text-white transition-opacity hover:opacity-80"
        >
          {item.label}
        </Link>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mr-2 p-2 text-white/70 transition-colors hover:text-white"
          aria-label={expanded ? "Collapse submenu" : "Expand submenu"}
        >
          <ChevronDown
            className={cn(
              "h-5 w-5 transition-transform duration-200",
              expanded && "rotate-180",
            )}
          />
        </button>
      </div>

      <div className={cn("py-1 pl-[10%]", expanded ? "block" : "hidden")}>
        {item.children?.map((child, index) => (
          <MobileChildRow key={index} child={child} />
        ))}
      </div>
    </div>
  );
}

function MobileChildRow({ child }: { child: MobileNavChildItem }) {
  const [expanded, setExpanded] = useState(false);
  const hasGrandchildren = child.children && child.children.length > 0;

  if (!hasGrandchildren) {
    return (
      <Link
        to={child.href}
        target={child.openInNewTab ? "_blank" : undefined}
        rel={child.openInNewTab ? "noopener noreferrer" : undefined}
        className="block py-[8px] font-inter text-[17px] text-white/80 transition-colors hover:text-white"
      >
        {child.label}
      </Link>
    );
  }

  return (
    <div>
      <div className="flex items-center">
        <Link
          to={child.href}
          target={child.openInNewTab ? "_blank" : undefined}
          rel={child.openInNewTab ? "noopener noreferrer" : undefined}
          className="flex-1 py-[8px] font-inter text-[17px] text-white/80 transition-colors hover:text-white"
        >
          {child.label}
        </Link>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="p-1 text-white/50 hover:text-white transition-colors"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          <ChevronDown
            className={cn("h-4 w-4 transition-transform duration-200", expanded && "rotate-180")}
          />
        </button>
      </div>
      <div className={cn("pl-4 pb-1", expanded ? "block" : "hidden")}>
        {child.children!.map((grandchild, idx) => (
          <Link
            key={idx}
            to={grandchild.href}
            target={grandchild.openInNewTab ? "_blank" : undefined}
            rel={grandchild.openInNewTab ? "noopener noreferrer" : undefined}
            className="block py-[6px] font-inter text-[15px] text-white/60 transition-colors hover:text-white"
          >
            {grandchild.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
