import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useDniPhone } from "@site/contexts/DniPhoneContext";

interface PhoneLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: ReactNode;
}

export default function PhoneLink({ children, ...props }: PhoneLinkProps) {
  const {
    activePhoneHref,
    activePhoneDisplay,
    activePhoneNumber,
    canonicalPhoneNumber,
  } = useDniPhone();

  if (!activePhoneNumber) {
    return null;
  }

  return (
    <a
      {...props}
      href={activePhoneHref}
      data-dni-phone="true"
      data-dni-original={canonicalPhoneNumber}
      data-dni-active={activePhoneNumber}
      suppressHydrationWarning
    >
      {children ?? <span suppressHydrationWarning>{activePhoneDisplay}</span>}
    </a>
  );
}
