import PhoneLink from "./PhoneLink";
import { useDniPhone } from "@site/contexts/DniPhoneContext";

export default function DniPhoneSentinel() {
  const { activePhoneDisplay, activePhoneNumber } = useDniPhone();

  if (!activePhoneNumber) {
    return null;
  }

  return (
    <PhoneLink
      aria-hidden="true"
      tabIndex={-1}
      style={{
        position: "absolute",
        left: "-10000px",
        top: "auto",
        width: "1px",
        height: "1px",
        overflow: "hidden",
      }}
    >
      <span suppressHydrationWarning>{activePhoneDisplay}</span>
    </PhoneLink>
  );
}
