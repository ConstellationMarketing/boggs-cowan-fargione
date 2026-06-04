import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSiteSettings } from "./SiteSettingsContext";
import {
  DNI_PHONE_DETECTED_EVENT,
  formatDniDisplay,
  getDniPhoneHref,
  getStoredDniNumber,
  normalizePhoneDigits,
  storeDniNumber,
  trackingDebugLog,
  type DniPhoneDetectedDetail,
} from "@site/lib/dniPhoneState";

interface DniPhoneContextValue {
  canonicalPhoneNumber: string;
  canonicalPhoneDisplay: string;
  activePhoneNumber: string;
  activePhoneDisplay: string;
  activePhoneHref: string;
  phoneLabel: string;
  isDniActive: boolean;
  isLoading: boolean;
}

const DniPhoneContext = createContext<DniPhoneContextValue | null>(null);

function buildValue({
  phoneNumber,
  phoneDisplay,
  phoneLabel,
  activeDigits,
  isLoading,
}: {
  phoneNumber: string;
  phoneDisplay: string;
  phoneLabel: string;
  activeDigits: string;
  isLoading: boolean;
}): DniPhoneContextValue {
  const canonicalDigits = normalizePhoneDigits(phoneNumber || phoneDisplay);
  const normalizedActiveDigits = normalizePhoneDigits(activeDigits);
  const hasActiveDni = Boolean(
    normalizedActiveDigits
    && canonicalDigits
    && normalizedActiveDigits !== canonicalDigits,
  );
  const activePhoneNumber = hasActiveDni ? normalizedActiveDigits : canonicalDigits;

  return {
    canonicalPhoneNumber: canonicalDigits,
    canonicalPhoneDisplay: phoneDisplay || formatDniDisplay(canonicalDigits),
    activePhoneNumber,
    activePhoneDisplay: hasActiveDni
      ? formatDniDisplay(normalizedActiveDigits)
      : phoneDisplay || formatDniDisplay(canonicalDigits),
    activePhoneHref: getDniPhoneHref(activePhoneNumber),
    phoneLabel,
    isDniActive: hasActiveDni,
    isLoading,
  };
}

export function DniPhoneProvider({ children }: { children: ReactNode }) {
  const { settings, isLoading } = useSiteSettings();
  const canonicalDigits = normalizePhoneDigits(
    settings.phoneNumber || settings.phoneDisplay,
  );
  const [activeDigits, setActiveDigits] = useState("");

  useEffect(() => {
    if (!canonicalDigits) {
      setActiveDigits("");
      return;
    }

    const storedDniNumber = getStoredDniNumber(canonicalDigits) || "";
    trackingDebugLog(storedDniNumber ? "stored DNI number found" : "stored DNI number not found", {
      canonicalDigits,
      storedDniNumber,
    });
    setActiveDigits(storedDniNumber);
  }, [canonicalDigits]);

  useEffect(() => {
    if (!canonicalDigits) {
      return;
    }

    const onDetected = (event: Event) => {
      const customEvent = event as CustomEvent<DniPhoneDetectedDetail>;
      const detectedTracking = normalizePhoneDigits(customEvent.detail?.trackingDigits);
      const detectedCanonical = normalizePhoneDigits(customEvent.detail?.canonicalDigits);

      if (!detectedTracking || detectedTracking === canonicalDigits) {
        return;
      }

      if (detectedCanonical && detectedCanonical !== canonicalDigits) {
        return;
      }

      storeDniNumber(detectedTracking, canonicalDigits);
      trackingDebugLog("active DNI number applied", {
        canonicalDigits,
        trackingDigits: detectedTracking,
        source: customEvent.detail?.source,
      });
      setActiveDigits(detectedTracking);
    };

    window.addEventListener(DNI_PHONE_DETECTED_EVENT, onDetected);
    return () => window.removeEventListener(DNI_PHONE_DETECTED_EVENT, onDetected);
  }, [canonicalDigits]);

  const value = useMemo(
    () => buildValue({
      phoneNumber: settings.phoneNumber,
      phoneDisplay: settings.phoneDisplay,
      phoneLabel: settings.phoneAvailability,
      activeDigits,
      isLoading,
    }),
    [
      activeDigits,
      isLoading,
      settings.phoneAvailability,
      settings.phoneDisplay,
      settings.phoneNumber,
    ],
  );

  return (
    <DniPhoneContext.Provider value={value}>
      {children}
    </DniPhoneContext.Provider>
  );
}

export function useDniPhone(): DniPhoneContextValue {
  const context = useContext(DniPhoneContext);
  const { settings, isLoading } = useSiteSettings();

  if (context) {
    return context;
  }

  return buildValue({
    phoneNumber: settings.phoneNumber,
    phoneDisplay: settings.phoneDisplay,
    phoneLabel: settings.phoneAvailability,
    activeDigits: "",
    isLoading,
  });
}
