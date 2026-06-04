/**
 * Universal WhatConverts phone-number synchronisation utility.
 *
 * WhatConverts (WC) may only swap one or some of the phone render targets on
 * the page. This module detects the tracking number and propagates it to every
 * other tel link and plain-text phone occurrence in the DOM.
 */

import {
  formatDniDisplay,
  normalizePhoneDigits,
  notifyDniPhoneDetected,
  storeDniNumber,
  trackingDebugLog,
} from "./dniPhoneState";

const PHONE_TEXT_PATTERN = /(?:\+?1[\s.-]*)?(?:\(\d{3}\)|\d{3})[\s.-]*\d{3}[\s.-]*\d{4}\b/g;
const knownOriginalDigits = new Set<string>();
let lastSwappedDigits = "";
let pollingTimer: ReturnType<typeof setInterval> | null = null;

function formatPhoneVariants(digits: string): string[] {
  if (digits.length !== 10) {
    return [digits];
  }

  const a = digits.slice(0, 3);
  const b = digits.slice(3, 6);
  const c = digits.slice(6);
  return [
    `${a}-${b}-${c}`,
    `(${a}) ${b}-${c}`,
    `${a}.${b}.${c}`,
    `${a} ${b} ${c}`,
    digits,
  ];
}

function replaceFirstMatchingVariant(
  value: string,
  originalVariants: string[],
  replacement: string,
): string {
  let nextValue = value;

  for (const variant of originalVariants) {
    if (nextValue.includes(variant)) {
      nextValue = nextValue.replace(variant, replacement);
    }
  }

  return nextValue;
}

function replacePhoneTextInElement(
  element: HTMLElement,
  originalVariants: string[],
  swappedFormatted: string,
): boolean {
  const spans = element.querySelectorAll("span");
  for (const span of spans) {
    const nextText = replaceFirstMatchingVariant(
      span.textContent || "",
      originalVariants,
      swappedFormatted,
    );
    if (nextText !== (span.textContent || "")) {
      span.textContent = nextText;
      return true;
    }
  }

  for (const child of element.childNodes) {
    if (child.nodeType !== Node.TEXT_NODE) {
      continue;
    }

    const textNode = child as Text;
    const nextText = replaceFirstMatchingVariant(
      textNode.textContent || "",
      originalVariants,
      swappedFormatted,
    );
    if (nextText !== (textNode.textContent || "")) {
      textNode.textContent = nextText;
      return true;
    }
  }

  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let node: Text | null;

  while ((node = walker.nextNode() as Text | null)) {
    const nextText = replaceFirstMatchingVariant(
      node.textContent || "",
      originalVariants,
      swappedFormatted,
    );
    if (nextText !== (node.textContent || "")) {
      node.textContent = nextText;
      return true;
    }
  }

  return false;
}

function isInsideTelAnchor(node: Node): boolean {
  let current: Node | null = node.parentNode;

  while (current) {
    if (current.nodeType === Node.ELEMENT_NODE) {
      const element = current as Element;
      const tagName = element.tagName.toLowerCase();

      if (element.matches('a[href^="tel:"]')) {
        return true;
      }

      if (tagName === "script" || tagName === "style" || tagName === "noscript") {
        return true;
      }
    }

    current = current.parentNode;
  }

  return false;
}

function collectBodyTextPhoneCounts(): Map<string, number> {
  const counts = new Map<string, number>();

  if (!document.body) {
    return counts;
  }

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let textNode: Text | null;

  while ((textNode = walker.nextNode() as Text | null)) {
    const textContent = textNode.textContent || "";
    if (!textContent.trim() || isInsideTelAnchor(textNode)) {
      continue;
    }

    const matches = textContent.match(PHONE_TEXT_PATTERN) || [];
    for (const match of matches) {
      const digits = normalizePhoneDigits(match);
      if (digits.length < 10) {
        continue;
      }
      counts.set(digits, (counts.get(digits) ?? 0) + 1);
    }
  }

  return counts;
}

function getKnownOriginalDifferentFrom(digits: string): string | null {
  for (const candidate of knownOriginalDigits) {
    if (candidate !== digits) {
      return candidate;
    }
  }
  return null;
}

function getMostFrequentDifferentDigits(
  counts: Map<string, number>,
  excludedDigits: string,
): string | null {
  let bestDigits: string | null = null;
  let bestCount = 0;

  for (const [digits, count] of counts) {
    if (digits === excludedDigits) {
      continue;
    }

    if (count > bestCount) {
      bestDigits = digits;
      bestCount = count;
    }
  }

  return bestDigits;
}

function chooseSwappedDigits(
  telDigits: string[],
  originalDigits: string,
): string | null {
  const candidates = telDigits.filter((digits) => digits !== originalDigits);
  if (candidates.length === 0) {
    return null;
  }

  if (lastSwappedDigits && candidates.includes(lastSwappedDigits)) {
    return lastSwappedDigits;
  }

  return candidates[0];
}

function resolvePhoneMapping(
  telCounts: Map<string, number>,
  textCounts: Map<string, number>,
): { originalDigits: string; swappedDigits: string } | null {
  const telDigits = Array.from(telCounts.keys());
  if (telDigits.length === 0) {
    return null;
  }

  if (telDigits.length >= 2) {
    const knownOriginal = telDigits.find(
      (digits) => knownOriginalDigits.has(digits) && digits !== lastSwappedDigits,
    );
    if (knownOriginal) {
      const swappedDigits = chooseSwappedDigits(telDigits, knownOriginal);
      if (swappedDigits) {
        return { originalDigits: knownOriginal, swappedDigits };
      }
    }

    const textPreferredOriginal = telDigits
      .filter((digits) => (textCounts.get(digits) ?? 0) > 0)
      .sort((a, b) => (textCounts.get(b) ?? 0) - (textCounts.get(a) ?? 0))[0];
    if (textPreferredOriginal) {
      const swappedDigits = chooseSwappedDigits(telDigits, textPreferredOriginal);
      if (swappedDigits) {
        return { originalDigits: textPreferredOriginal, swappedDigits };
      }
    }

    if (lastSwappedDigits && telCounts.has(lastSwappedDigits)) {
      const originalDigits = telDigits.find((digits) => digits !== lastSwappedDigits);
      if (originalDigits) {
        return { originalDigits, swappedDigits: lastSwappedDigits };
      }
    }

    const sortedDigits = Array.from(telCounts.entries()).sort((a, b) => b[1] - a[1]);
    const originalDigits = sortedDigits[0]?.[0];
    if (!originalDigits) {
      return null;
    }

    const swappedDigits = chooseSwappedDigits(telDigits, originalDigits);
    if (!swappedDigits) {
      return null;
    }

    return { originalDigits, swappedDigits };
  }

  const onlyTelDigits = telDigits[0];
  const textOriginal = getMostFrequentDifferentDigits(textCounts, onlyTelDigits);
  if (textOriginal) {
    return { originalDigits: textOriginal, swappedDigits: onlyTelDigits };
  }

  const knownOriginal = getKnownOriginalDifferentFrom(onlyTelDigits);
  if (knownOriginal) {
    return { originalDigits: knownOriginal, swappedDigits: onlyTelDigits };
  }

  return null;
}

export function resetUniversalPhoneSyncState(): void {
  knownOriginalDigits.clear();
  lastSwappedDigits = "";

  if (pollingTimer !== null) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }
}

/**
 * Scan every `<a href="tel:...">` on the page. If WhatConverts has
 * swapped at least one link to a tracking number, propagate that number
 * to remaining tel links and plain-text occurrences.
 *
 * @returns `true` if any DOM changes were made.
 */
export function syncPhoneNumbersNow(): boolean {
  try {
    if (!document.body) {
      return false;
    }

    const telLinks = document.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]');
    if (telLinks.length === 0) {
      return false;
    }

    const telCounts = new Map<string, number>();
    for (const link of telLinks) {
      const originalDigits = normalizePhoneDigits(link.dataset.dniOriginal);
      if (originalDigits) {
        knownOriginalDigits.add(originalDigits);
      }

      const href = link.getAttribute("href") || link.href;
      const digits = normalizePhoneDigits(href);
      if (!digits) {
        continue;
      }
      telCounts.set(digits, (telCounts.get(digits) ?? 0) + 1);
    }

    const textCounts = collectBodyTextPhoneCounts();
    const phoneMapping = resolvePhoneMapping(telCounts, textCounts);
    if (!phoneMapping) {
      return false;
    }

    const { originalDigits, swappedDigits } = phoneMapping;
    if (!originalDigits || !swappedDigits || originalDigits === swappedDigits) {
      return false;
    }

    knownOriginalDigits.add(originalDigits);
    lastSwappedDigits = swappedDigits;

    storeDniNumber(swappedDigits, originalDigits);
    trackingDebugLog("swapped number detected", {
      canonicalDigits: originalDigits,
      trackingDigits: swappedDigits,
      telTargetCount: telLinks.length,
    });
    notifyDniPhoneDetected({
      canonicalDigits: originalDigits,
      trackingDigits: swappedDigits,
      source: "syncPhoneNumbersNow",
    });

    const originalVariants = Array.from(
      new Set([...formatPhoneVariants(originalDigits), formatDniDisplay(originalDigits)]),
    );
    const swappedFormatted = formatDniDisplay(swappedDigits);

    let changed = false;

    for (const link of telLinks) {
      const href = link.getAttribute("href") || link.href;
      const linkDigits = normalizePhoneDigits(href);

      if (linkDigits !== swappedDigits) {
        link.setAttribute("href", `tel:${swappedDigits}`);
        changed = true;
      }

      if (replacePhoneTextInElement(link, originalVariants, swappedFormatted)) {
        changed = true;
      }
    }

    const bodyWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let textNode: Text | null;

    while ((textNode = bodyWalker.nextNode() as Text | null)) {
      if (!textNode.textContent || isInsideTelAnchor(textNode)) {
        continue;
      }

      const nextText = replaceFirstMatchingVariant(
        textNode.textContent,
        originalVariants,
        swappedFormatted,
      );
      if (nextText !== textNode.textContent) {
        textNode.textContent = nextText;
        changed = true;
      }
    }

    trackingDebugLog("phone targets updated", { changed });
    return changed;
  } catch {
    return false;
  }
}

/**
 * Start a 250 ms polling loop that runs `syncPhoneNumbersNow()` for up
 * to 20 seconds. It keeps running long enough for delayed route content,
 * hydration, and third-party DNI scripts to settle.
 *
 * Safe for re-invocation — cancels any previous loop first.
 */
export function startUniversalPhoneSync(): void {
  try {
    if (pollingTimer !== null) {
      clearInterval(pollingTimer);
      pollingTimer = null;
    }

    syncPhoneNumbersNow();

    const MAX_ITERATIONS = 80;
    const MIN_ITERATIONS_BEFORE_IDLE_STOP = 24;
    const MAX_CONSECUTIVE_NO_CHANGE_AFTER_MIN = 12;
    let iterations = 0;
    let consecutiveNoChange = 0;

    pollingTimer = setInterval(() => {
      iterations++;

      try {
        const didChange = syncPhoneNumbersNow();
        consecutiveNoChange = didChange ? 0 : consecutiveNoChange + 1;
      } catch {
        consecutiveNoChange++;
      }

      const canStopForIdle =
        iterations >= MIN_ITERATIONS_BEFORE_IDLE_STOP
        && consecutiveNoChange >= MAX_CONSECUTIVE_NO_CHANGE_AFTER_MIN;

      if (iterations >= MAX_ITERATIONS || canStopForIdle) {
        if (pollingTimer !== null) {
          clearInterval(pollingTimer);
          pollingTimer = null;
        }
      }
    }, 250);
  } catch {
    // Silent
  }
}
