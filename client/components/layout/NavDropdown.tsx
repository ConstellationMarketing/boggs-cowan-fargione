import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";

interface NavGrandchildItem {
  label: string;
  href: string;
  openInNewTab?: boolean;
}

interface NavDropdownChildItem {
  label: string;
  href: string;
  openInNewTab?: boolean;
  children?: NavGrandchildItem[];
}

interface NavDropdownItem {
  label: string;
  href: string;
  openInNewTab?: boolean;
  children?: NavDropdownChildItem[];
}

interface NavDropdownProps {
  item: NavDropdownItem;
  direction?: "down" | "up";
}

function GrandchildFlyout({
  child,
  parentOpen,
}: {
  child: NavDropdownChildItem;
  parentOpen: boolean;
}) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasGrandchildren = child.children && child.children.length > 0;

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 120);
  };

  if (!hasGrandchildren) {
    return (
      <Link
        to={child.href}
        target={child.openInNewTab ? "_blank" : undefined}
        rel={child.openInNewTab ? "noopener noreferrer" : undefined}
        className="block px-5 py-2.5 font-inter text-[16px] text-white/90 hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap"
        tabIndex={parentOpen ? 0 : -1}
      >
        {child.label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div className="flex items-center justify-between px-5 py-2.5 font-inter text-[16px] text-white/90 hover:bg-white/10 hover:text-white transition-colors cursor-default whitespace-nowrap gap-3">
        <Link
          to={child.href}
          target={child.openInNewTab ? "_blank" : undefined}
          rel={child.openInNewTab ? "noopener noreferrer" : undefined}
          className="flex-1 hover:text-white transition-colors"
          tabIndex={parentOpen ? 0 : -1}
        >
          {child.label}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
      </div>

      {/* Grandchild flyout panel */}
      <div
        className={`absolute left-full top-0 min-w-[200px] overflow-hidden bg-brand-card border border-brand-border rounded-xl shadow-xl z-50 py-2 transition-all duration-150 ${
          open
            ? "visible opacity-100 pointer-events-auto"
            : "invisible opacity-0 pointer-events-none"
        }`}
      >
        {child.children!.map((grandchild, idx) => (
          <Link
            key={idx}
            to={grandchild.href}
            target={grandchild.openInNewTab ? "_blank" : undefined}
            rel={grandchild.openInNewTab ? "noopener noreferrer" : undefined}
            className="block px-5 py-2.5 font-inter text-[15px] text-white/90 hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap"
            tabIndex={open ? 0 : -1}
          >
            {grandchild.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function NavDropdown({ item, direction = "down" }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <Link
        to={item.href}
        className="font-inter text-[16px] text-white py-[31px] mr-[20px] whitespace-nowrap hover:opacity-80 transition-opacity duration-400 inline-flex items-center gap-1"
      >
        {item.label}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </Link>

      <div
        className={`absolute left-0 min-w-[220px] bg-brand-card border border-brand-border rounded-xl shadow-xl z-50 py-2 transition-all duration-200 ${
          direction === "up" ? "bottom-full mb-0" : "top-full mt-0"
        } ${
          open
            ? "block visible opacity-100 pointer-events-auto"
            : direction === "up"
              ? "hidden invisible opacity-0 pointer-events-none"
              : "invisible opacity-0 pointer-events-none"
        }`}
      >
        {item.children!.map((child, idx) => (
          <GrandchildFlyout key={idx} child={child} parentOpen={open} />
        ))}
      </div>
    </div>
  );
}
