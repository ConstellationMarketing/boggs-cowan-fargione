// @vitest-environment jsdom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { SiteSettings } from "@site/lib/cms/publicLoaders";

const {
  mockUseSiteSettings,
  refreshWhatConvertsDni,
  registerWhatConvertsScriptNodes,
} = vi.hoisted(() => ({
  mockUseSiteSettings: vi.fn(),
  refreshWhatConvertsDni: vi.fn(),
  registerWhatConvertsScriptNodes: vi.fn(),
}));

vi.mock("@site/contexts/SiteSettingsContext", () => ({
  useSiteSettings: () => mockUseSiteSettings(),
}));

vi.mock("@site/lib/whatconvertsRefresh", () => ({
  refreshWhatConvertsDni,
  registerWhatConvertsScriptNodes,
}));

import GlobalScripts from "./GlobalScripts";

const baseSettings: SiteSettings = {
  siteName: "",
  logoUrl: "",
  logoAlt: "",
  faviconSourceUrl: "",
  faviconAssets: null,
  phoneNumber: "",
  phoneDisplay: "",
  phoneAvailability: "",
  applyPhoneGlobally: true,
  navigationItems: [],
  footerAboutLinks: [],
  footerPracticeLinks: [],
  footerResourcesHeading: "",
  footerPracticeAreasHeading: "",
  footerTaglineHtml: "",
  footerDescription: "",
  footerDisclaimerText: "",
  privacyPolicyLabel: "Privacy Policy",
  privacyPolicyUrl: "",
  termsOfServiceLabel: "Terms of Service",
  termsOfServiceUrl: "",
  addressLine1: "",
  addressLine2: "",
  mapEmbedUrl: "",
  socialLinks: [],
  copyrightText: "",
  siteUrl: "",
  siteNoindex: false,
  ga4MeasurementId: "",
  googleAdsId: "",
  googleAdsConversionLabel: "",
  headScripts: '<script src="https://cdn.example.com/whatconverts.js"></script>',
  footerScripts: '<script>window.footerMarker = true;</script>',
  globalSchema: "",
};

describe("GlobalScripts", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    document.head.innerHTML = "";
    document.body.innerHTML = "";
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    mockUseSiteSettings.mockReturnValue({
      settings: baseSettings,
      isLoading: false,
    });
    refreshWhatConvertsDni.mockReset();
    registerWhatConvertsScriptNodes.mockReset();
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
  });

  it("injects site scripts once and registers WhatConverts readiness", () => {
    act(() => {
      root.render(<GlobalScripts />);
    });

    expect(document.head.querySelectorAll('script[src="https://cdn.example.com/whatconverts.js"]')).toHaveLength(1);
    expect(document.body.querySelectorAll("script").length).toBeGreaterThanOrEqual(1);
    expect(registerWhatConvertsScriptNodes).toHaveBeenCalledTimes(1);
    expect(refreshWhatConvertsDni).toHaveBeenCalledWith("head-scripts-injected", {
      force: true,
    });

    act(() => {
      root.render(<GlobalScripts />);
    });

    expect(document.head.querySelectorAll('script[src="https://cdn.example.com/whatconverts.js"]')).toHaveLength(1);
  });

  it("dedupes protocol-relative scripts against absolute SSR script URLs", () => {
    const existing = document.createElement("script");
    existing.src = "https://s.ksrndkehqnwntyxlhgto.com/165912.js";
    document.head.appendChild(existing);
    mockUseSiteSettings.mockReturnValue({
      settings: {
        ...baseSettings,
        headScripts: '<script src="//s.ksrndkehqnwntyxlhgto.com/165912.js"></script>',
        footerScripts: "",
      },
      isLoading: false,
    });

    act(() => {
      root.render(<GlobalScripts />);
    });

    expect(document.head.querySelectorAll('script[src="https://s.ksrndkehqnwntyxlhgto.com/165912.js"]')).toHaveLength(1);
  });

  it("does not inject duplicate WhatConverts scripts when SSR already included them", () => {
    document.head.innerHTML = '<script src="https://s.ksrndkehqnwntyxlhgto.com/165912.js"></script>';
    mockUseSiteSettings.mockReturnValue({
      settings: {
        ...baseSettings,
        headScripts: '<script src="//s.ksrndkehqnwntyxlhgto.com/165912.js"></script>',
        footerScripts: "",
      },
      isLoading: false,
    });

    act(() => {
      root.render(<GlobalScripts />);
    });

    expect(document.head.querySelectorAll('script[src="https://s.ksrndkehqnwntyxlhgto.com/165912.js"]')).toHaveLength(1);
  });

  it("does not inject duplicate GA4 scripts when equivalent CMS scripts exist", () => {
    mockUseSiteSettings.mockReturnValue({
      settings: {
        ...baseSettings,
        ga4MeasurementId: "G-TEST123",
        headScripts:
          '<script async src="https://www.googletagmanager.com/gtag/js?id=G-TEST123"></script>',
        footerScripts: "",
      },
      isLoading: false,
    });

    act(() => {
      root.render(<GlobalScripts />);
    });

    expect(document.head.querySelectorAll('script[src="https://www.googletagmanager.com/gtag/js?id=G-TEST123"]')).toHaveLength(1);
  });

  it("moves GTM noscript snippets out of head injection", () => {
    mockUseSiteSettings.mockReturnValue({
      settings: {
        ...baseSettings,
        headScripts:
          '<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TEST"></iframe></noscript>',
        footerScripts: "",
      },
      isLoading: false,
    });

    act(() => {
      root.render(<GlobalScripts />);
    });

    expect(document.head.querySelectorAll("noscript")).toHaveLength(0);
    expect(document.body.querySelectorAll("noscript")).toHaveLength(1);
  });

  it("does nothing while site settings are still loading", () => {
    mockUseSiteSettings.mockReturnValue({
      settings: baseSettings,
      isLoading: true,
    });

    act(() => {
      root.render(<GlobalScripts />);
    });

    expect(document.head.querySelectorAll("script")).toHaveLength(0);
    expect(registerWhatConvertsScriptNodes).not.toHaveBeenCalled();
    expect(refreshWhatConvertsDni).not.toHaveBeenCalled();
  });
});
