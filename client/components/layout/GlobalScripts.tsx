import { useEffect } from "react";
import { useSiteSettings } from "@site/contexts/SiteSettingsContext";
import {
  refreshWhatConvertsDni,
  registerWhatConvertsScriptNodes,
} from "@site/lib/whatconvertsRefresh";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function normalizeResourceUrl(value: string): string {
  try {
    return new URL(value, window.location.origin).href;
  } catch {
    return value;
  }
}

function findScriptByNormalizedSrc(src: string): HTMLScriptElement | null {
  const normalizedSrc = normalizeResourceUrl(src);
  return (
    Array.from(document.querySelectorAll<HTMLScriptElement>("script[src]")).find(
      (existing) => normalizeResourceUrl(existing.getAttribute("src") ?? existing.src) === normalizedSrc,
    ) ?? null
  );
}

function htmlContainsGoogleTagId(html: string, tagId: string): boolean {
  return Boolean(tagId) && html.includes(tagId) && /gtag|googletagmanager|google-analytics/i.test(html);
}

function isDuplicateGoogleTagNode(node: Node, tagIds: string[] = []): boolean {
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }

  const element = node as Element;
  if (element.tagName.toLowerCase() !== "script") {
    return false;
  }

  const script = element as HTMLScriptElement;
  const scriptHtml = `${script.getAttribute("src") ?? script.src}\n${script.textContent ?? ""}`;
  return tagIds.some((tagId) => htmlContainsGoogleTagId(scriptHtml, tagId));
}

function findMatchingNode(target: HTMLElement, node: Node): Node | null {
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const element = node as Element;
  const tagName = element.tagName.toLowerCase();

  if (tagName === "script") {
    const script = element as HTMLScriptElement;
    const src = script.getAttribute("src") || script.src;
    if (src) {
      return findScriptByNormalizedSrc(src);
    }

    const inlineContent = script.textContent?.trim();
    if (!inlineContent) {
      return null;
    }

    return (
      Array.from(target.querySelectorAll("script")).find(
        (existing) => existing.textContent?.trim() === inlineContent,
      ) || null
    );
  }

  if (tagName === "link") {
    const href = element.getAttribute("href");
    const rel = element.getAttribute("rel");
    if (href && rel) {
      return target.querySelector(`link[rel="${rel}"][href="${href}"]`);
    }
  }

  if (tagName === "meta") {
    const name = element.getAttribute("name");
    const property = element.getAttribute("property");
    const content = element.getAttribute("content");

    if (name && content) {
      return target.querySelector(`meta[name="${name}"][content="${content}"]`);
    }

    if (property && content) {
      return target.querySelector(`meta[property="${property}"][content="${content}"]`);
    }
  }

  const outerHtml = element.outerHTML.trim();
  return (
    Array.from(target.children).find(
      (existing) => existing.outerHTML.trim() === outerHtml,
    ) || null
  );
}

function appendInjectedNode(
  target: HTMLElement,
  node: Node,
  options?: { prepend?: boolean },
) {
  if (options?.prepend && target.firstChild) {
    target.insertBefore(node, target.firstChild);
    return;
  }

  target.appendChild(node);
}

function injectHtmlSnippet(
  html: string,
  target: HTMLElement,
  options?: {
    noscriptTarget?: HTMLElement;
    prependNoscript?: boolean;
    excludedGoogleTagIds?: string[];
  },
): Node[] {
  if (!html.trim()) {
    return [];
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const injected: Node[] = [];
  const sources = [...Array.from(doc.head.childNodes), ...Array.from(doc.body.childNodes)];

  for (const node of sources) {
    if (node.nodeType === Node.TEXT_NODE && !node.textContent?.trim()) {
      continue;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      continue;
    }

    const element = node as Element;
    const nodeTarget =
      element.tagName.toLowerCase() === "noscript" && options?.noscriptTarget
        ? options.noscriptTarget
        : target;

    if (
      findMatchingNode(nodeTarget, node)
      || isDuplicateGoogleTagNode(node, options?.excludedGoogleTagIds)
    ) {
      continue;
    }

    if (element.tagName === "SCRIPT") {
      const original = node as HTMLScriptElement;
      const script = document.createElement("script");

      for (const attr of Array.from(original.attributes)) {
        script.setAttribute(attr.name, attr.value);
      }

      if (script.src) {
        script.async = true;
      }

      if (original.textContent) {
        script.textContent = original.textContent;
      }

      appendInjectedNode(nodeTarget, script);
      injected.push(script);
      continue;
    }

    const clone = node.cloneNode(true);
    appendInjectedNode(nodeTarget, clone, {
      prepend: element.tagName.toLowerCase() === "noscript" && options?.prependNoscript,
    });
    injected.push(clone);
  }

  return injected;
}

function injectGA4(measurementId: string): Node[] {
  if (!measurementId) {
    return [];
  }

  if (typeof window.gtag === "function") {
    return [];
  }

  const existingScript = findScriptByNormalizedSrc(
    `https://www.googletagmanager.com/gtag/js?id=${measurementId}`,
  );
  if (existingScript) {
    return [];
  }

  const injected: Node[] = [];
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId);

  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  document.head.appendChild(script);
  injected.push(script);

  return injected;
}

function injectGoogleAds(adsId: string, conversionLabel: string): Node[] {
  if (!adsId) {
    return [];
  }

  const injected: Node[] = [];

  if (typeof window.gtag !== "function") {
    const existingScript = findScriptByNormalizedSrc(
      `https://www.googletagmanager.com/gtag/js?id=${adsId}`,
    );

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };
    window.gtag("js", new Date());

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = `https://www.googletagmanager.com/gtag/js?id=${adsId}`;
      script.async = true;
      document.head.appendChild(script);
      injected.push(script);
    }
  }

  window.gtag("config", adsId);

  if (conversionLabel) {
    window.gtag("event", "conversion", {
      send_to: `${adsId}/${conversionLabel}`,
    });
  }

  return injected;
}

export default function GlobalScripts() {
  const { settings, isLoading } = useSiteSettings();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const injected: Node[] = [];

    if (settings.ga4MeasurementId) {
      injected.push(...injectGA4(settings.ga4MeasurementId));
    }

    if (settings.googleAdsId) {
      injected.push(
        ...injectGoogleAds(
          settings.googleAdsId,
          settings.googleAdsConversionLabel,
        ),
      );
    }

    const appRenderedGoogleTagIds = [
      settings.ga4MeasurementId,
      settings.googleAdsId,
    ].filter(Boolean);

    if (settings.headScripts) {
      injected.push(
        ...injectHtmlSnippet(settings.headScripts, document.head, {
          noscriptTarget: document.body,
          prependNoscript: true,
          excludedGoogleTagIds: appRenderedGoogleTagIds,
        }),
      );
    }

    if (settings.footerScripts) {
      injected.push(
        ...injectHtmlSnippet(settings.footerScripts, document.body, {
          excludedGoogleTagIds: appRenderedGoogleTagIds,
        }),
      );
    }

    registerWhatConvertsScriptNodes(injected, "head-scripts-injected");
    refreshWhatConvertsDni("head-scripts-injected", { force: true });

    return () => {
      for (const node of injected) {
        node.parentNode?.removeChild(node);
      }
    };
  }, [
    isLoading,
    settings.footerScripts,
    settings.ga4MeasurementId,
    settings.googleAdsConversionLabel,
    settings.googleAdsId,
    settings.headScripts,
  ]);

  return null;
}
