export const DNI_PHONE_DETECTED_EVENT = "dni-phone-detected";

const STORAGE_KEY = "bcf:dni-phone:v1";
const STORAGE_TTL_MS = 1000 * 60 * 60 * 24 * 30;

export interface StoredDniPhoneNumber {
  canonicalDigits: string;
  trackingDigits: string;
  hostname: string;
  timestamp: number;
}

export interface DniPhoneDetectedDetail {
  canonicalDigits?: string;
  trackingDigits: string;
  source?: string;
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function isTrackingDebugEnabled(): boolean {
  if (!isBrowser()) {
    return false;
  }

  return new URLSearchParams(window.location.search).get("debugTracking") === "1";
}

export function trackingDebugLog(message: string, data?: unknown): void {
  if (!isTrackingDebugEnabled()) {
    return;
  }

  if (data === undefined) {
    console.info(`[Tracking] ${message}`);
  } else {
    console.info(`[Tracking] ${message}`, data);
  }
}

export function normalizePhoneDigits(value: string | null | undefined): string {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return digits.slice(1);
  }
  return digits;
}

export function formatDniDisplay(digits: string): string {
  const normalized = normalizePhoneDigits(digits);
  if (normalized.length !== 10) {
    return normalized;
  }

  return `${normalized.slice(0, 3)}-${normalized.slice(3, 6)}-${normalized.slice(6)}`;
}

export function getDniPhoneHref(digits: string): string {
  return `tel:${normalizePhoneDigits(digits)}`;
}

function getCurrentHostname(): string {
  return isBrowser() ? window.location.hostname : "";
}

function readStoredRecord(): StoredDniPhoneNumber | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<StoredDniPhoneNumber>;
    if (
      !parsed
      || typeof parsed.canonicalDigits !== "string"
      || typeof parsed.trackingDigits !== "string"
      || typeof parsed.hostname !== "string"
      || typeof parsed.timestamp !== "number"
    ) {
      return null;
    }

    return parsed as StoredDniPhoneNumber;
  } catch {
    return null;
  }
}

export function getStoredDniNumber(canonicalDigits: string): string | null {
  const normalizedCanonical = normalizePhoneDigits(canonicalDigits);
  const stored = readStoredRecord();
  if (!stored) {
    return null;
  }

  const isExpired = Date.now() - stored.timestamp > STORAGE_TTL_MS;
  const isSameHost = stored.hostname === getCurrentHostname();
  const isSameCanonical = stored.canonicalDigits === normalizedCanonical;
  const hasTrackingNumber = stored.trackingDigits.length >= 10
    && stored.trackingDigits !== normalizedCanonical;

  if (isExpired || !isSameHost || !isSameCanonical || !hasTrackingNumber) {
    clearDniNumber();
    return null;
  }

  return stored.trackingDigits;
}

export function storeDniNumber(
  trackingDigits: string,
  canonicalDigits: string,
): string | null {
  if (!isBrowser()) {
    return null;
  }

  const normalizedTracking = normalizePhoneDigits(trackingDigits);
  const normalizedCanonical = normalizePhoneDigits(canonicalDigits);

  if (
    normalizedTracking.length < 10
    || normalizedCanonical.length < 10
    || normalizedTracking === normalizedCanonical
  ) {
    return null;
  }

  const record: StoredDniPhoneNumber = {
    canonicalDigits: normalizedCanonical,
    trackingDigits: normalizedTracking,
    hostname: getCurrentHostname(),
    timestamp: Date.now(),
  };

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Ignore storage failures. In-memory React state will still update.
  }

  return normalizedTracking;
}

export function clearDniNumber(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silent
  }
}

export function notifyDniPhoneDetected(detail: DniPhoneDetectedDetail): void {
  if (!isBrowser()) {
    return;
  }

  const trackingDigits = normalizePhoneDigits(detail.trackingDigits);
  const canonicalDigits = normalizePhoneDigits(detail.canonicalDigits);

  if (trackingDigits.length < 10) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<DniPhoneDetectedDetail>(DNI_PHONE_DETECTED_EVENT, {
      detail: {
        ...detail,
        trackingDigits,
        canonicalDigits: canonicalDigits || undefined,
      },
    }),
  );
}
