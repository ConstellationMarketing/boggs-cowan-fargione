// TypeScript interfaces for global site settings (Header/Footer CMS)

import { normalizeFaviconAssets, type FaviconAssets } from "@site/lib/seo/favicon";

export interface NavigationGrandchildItem {
  label: string;
  href: string;
  openInNewTab?: boolean;
}

export interface NavigationChildItem {
  label: string;
  href: string;
  openInNewTab?: boolean;
  children?: NavigationGrandchildItem[];
}

export interface NavigationItem {
  label: string;
  href: string;
  order?: number;
  openInNewTab?: boolean;
  children?: NavigationChildItem[];
}

export interface FooterLink {
  label: string;
  href?: string;
}

export interface SocialLink {
  platform: "facebook" | "instagram" | "twitter" | "linkedin" | "youtube";
  url: string;
  enabled: boolean;
}

export interface SiteSettings {
  // Site Name
  siteName: string;

  // Logo
  logoUrl: string;
  logoAlt: string;
  faviconSourceUrl: string;
  faviconAssets: FaviconAssets | null;

  // Phone
  phoneNumber: string; // e.g., "4049057742"
  phoneDisplay: string; // e.g., "404-905-7742"
  phoneAvailability: string; // e.g., "Available 24/7"
  applyPhoneGlobally: boolean;

  // Navigation
  navigationItems: NavigationItem[];

  // Footer Links
  footerAboutLinks: FooterLink[];
  footerPracticeLinks: FooterLink[];
  footerResourcesHeading: string;
  footerPracticeAreasHeading: string;

  // Address
  addressLine1: string;
  addressLine2: string;

  // Map
  mapEmbedUrl: string;

  // Social
  socialLinks: SocialLink[];

  // Copyright
  copyrightText: string;

  // Footer Tagline (Rich Text HTML)
  footerTaglineHtml: string;
  footerDescription: string;
  footerDisclaimerText: string;
  privacyPolicyLabel: string;
  privacyPolicyUrl: string;
  termsOfServiceLabel: string;
  termsOfServiceUrl: string;

  // SEO
  siteUrl: string;
  siteNoindex: boolean;
  globalSchema: string; // JSON-LD schema injected on every page

  // Analytics & Scripts
  ga4MeasurementId: string;
  googleAdsId: string;
  googleAdsConversionLabel: string;
  headScripts: string;
  footerScripts: string;
}

// Database row structure from Supabase site_settings table
export interface SiteSettingsRow {
  id: string;
  settings_key: string;
  logo_url: string | null;
  logo_alt: string | null;
  favicon_source_url: string | null;
  favicon_assets: FaviconAssets | null;
  phone_number: string | null;
  phone_display: string | null;
  phone_availability: string | null;
  apply_phone_globally: boolean;
  navigation_items: NavigationItem[];
  footer_about_links: FooterLink[];
  footer_practice_links: FooterLink[];
  footer_resources_heading: string | null;
  footer_practice_areas_heading: string | null;
  address_line1: string | null;
  address_line2: string | null;
  map_embed_url: string | null;
  social_links: SocialLink[];
  copyright_text: string | null;
  footer_tagline_html: string | null;
  footer_description: string | null;
  footer_disclaimer_text: string | null;
  privacy_policy_label: string | null;
  privacy_policy_url: string | null;
  terms_of_service_label: string | null;
  terms_of_service_url: string | null;
  site_noindex: boolean;
  ga4_measurement_id: string | null;
  google_ads_id: string | null;
  google_ads_conversion_label: string | null;
  head_scripts: string | null;
  footer_scripts: string | null;
  site_name: string | null;
  site_url: string | null;
  global_schema: string | null;
  updated_at: string;
  updated_by: string | null;
}

// Default values matching current hardcoded content
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: "",
  logoUrl:
    "",
  logoAlt: "",
  faviconSourceUrl: "",
  faviconAssets: null,
  phoneNumber: "",
  phoneDisplay: "",
  phoneAvailability: "",
  applyPhoneGlobally: true,
  navigationItems: [
  ],
  footerAboutLinks: [

  ],
  footerPracticeLinks: [

  ],
  footerResourcesHeading: "",
  footerPracticeAreasHeading: "",
  addressLine1: "",
  addressLine2: "",
  mapEmbedUrl:
    "",
  socialLinks: [
   
  ],
  copyrightText: "",
  footerTaglineHtml: "",
  footerDescription: "",
  footerDisclaimerText: "",
  privacyPolicyLabel: "Privacy Policy",
  privacyPolicyUrl: "",
  termsOfServiceLabel: "Terms of Service",
  termsOfServiceUrl: "",
  siteUrl: "",
  siteNoindex: false,
  globalSchema: "",
  ga4MeasurementId: "",
  googleAdsId: "",
  googleAdsConversionLabel: "",
  headScripts: "",
  footerScripts: "",
};

// Helper to convert database row to SiteSettings interface
export function rowToSiteSettings(row: SiteSettingsRow): SiteSettings {
  return {
    siteName: row.site_name || DEFAULT_SITE_SETTINGS.siteName,
    logoUrl: row.logo_url || DEFAULT_SITE_SETTINGS.logoUrl,
    logoAlt: row.logo_alt || DEFAULT_SITE_SETTINGS.logoAlt,
    faviconSourceUrl: row.favicon_source_url || DEFAULT_SITE_SETTINGS.faviconSourceUrl,
    faviconAssets: normalizeFaviconAssets(row.favicon_assets) || DEFAULT_SITE_SETTINGS.faviconAssets,
    phoneNumber: row.phone_number || DEFAULT_SITE_SETTINGS.phoneNumber,
    phoneDisplay: row.phone_display || DEFAULT_SITE_SETTINGS.phoneDisplay,
    phoneAvailability:
      row.phone_availability || DEFAULT_SITE_SETTINGS.phoneAvailability,
    applyPhoneGlobally:
      row.apply_phone_globally ?? DEFAULT_SITE_SETTINGS.applyPhoneGlobally,
    navigationItems: row.navigation_items?.length
      ? row.navigation_items
      : DEFAULT_SITE_SETTINGS.navigationItems,
    footerAboutLinks: row.footer_about_links?.length
      ? row.footer_about_links
      : DEFAULT_SITE_SETTINGS.footerAboutLinks,
    footerPracticeLinks: row.footer_practice_links?.length
      ? row.footer_practice_links
      : DEFAULT_SITE_SETTINGS.footerPracticeLinks,
    footerResourcesHeading:
      row.footer_resources_heading || DEFAULT_SITE_SETTINGS.footerResourcesHeading,
    footerPracticeAreasHeading:
      row.footer_practice_areas_heading || DEFAULT_SITE_SETTINGS.footerPracticeAreasHeading,
    addressLine1: row.address_line1 || DEFAULT_SITE_SETTINGS.addressLine1,
    addressLine2: row.address_line2 || DEFAULT_SITE_SETTINGS.addressLine2,
    mapEmbedUrl: row.map_embed_url || DEFAULT_SITE_SETTINGS.mapEmbedUrl,
    socialLinks: row.social_links?.length
      ? row.social_links
      : DEFAULT_SITE_SETTINGS.socialLinks,
    copyrightText: row.copyright_text || DEFAULT_SITE_SETTINGS.copyrightText,
    footerTaglineHtml: row.footer_tagline_html || DEFAULT_SITE_SETTINGS.footerTaglineHtml,
    footerDescription: row.footer_description || DEFAULT_SITE_SETTINGS.footerDescription,
    footerDisclaimerText: row.footer_disclaimer_text || DEFAULT_SITE_SETTINGS.footerDisclaimerText,
    privacyPolicyLabel: row.privacy_policy_label || DEFAULT_SITE_SETTINGS.privacyPolicyLabel,
    privacyPolicyUrl: row.privacy_policy_url || DEFAULT_SITE_SETTINGS.privacyPolicyUrl,
    termsOfServiceLabel: row.terms_of_service_label || DEFAULT_SITE_SETTINGS.termsOfServiceLabel,
    termsOfServiceUrl: row.terms_of_service_url || DEFAULT_SITE_SETTINGS.termsOfServiceUrl,
    siteUrl: row.site_url || "",
    siteNoindex: row.site_noindex ?? DEFAULT_SITE_SETTINGS.siteNoindex,
    globalSchema: row.global_schema || "",
    ga4MeasurementId: row.ga4_measurement_id || "",
    googleAdsId: row.google_ads_id || "",
    googleAdsConversionLabel: row.google_ads_conversion_label || "",
    headScripts: row.head_scripts || "",
    footerScripts: row.footer_scripts || "",
  };
}

// Helper to convert SiteSettings to database row format for updates
export function siteSettingsToRow(
  settings: SiteSettings,
): Partial<SiteSettingsRow> {
  return {
    logo_url: settings.logoUrl,
    logo_alt: settings.logoAlt,
    favicon_source_url: settings.faviconSourceUrl || null,
    favicon_assets: settings.faviconAssets,
    phone_number: settings.phoneNumber,
    phone_display: settings.phoneDisplay,
    phone_availability: settings.phoneAvailability,
    apply_phone_globally: settings.applyPhoneGlobally,
    navigation_items: settings.navigationItems,
    footer_about_links: settings.footerAboutLinks,
    footer_practice_links: settings.footerPracticeLinks,
    footer_resources_heading: settings.footerResourcesHeading || null,
    footer_practice_areas_heading: settings.footerPracticeAreasHeading || null,
    address_line1: settings.addressLine1,
    address_line2: settings.addressLine2,
    map_embed_url: settings.mapEmbedUrl,
    social_links: settings.socialLinks,
    copyright_text: settings.copyrightText,
    footer_tagline_html: settings.footerTaglineHtml || null,
    footer_description: settings.footerDescription || null,
    footer_disclaimer_text: settings.footerDisclaimerText || null,
    privacy_policy_label: settings.privacyPolicyLabel || null,
    privacy_policy_url: settings.privacyPolicyUrl || null,
    terms_of_service_label: settings.termsOfServiceLabel || null,
    terms_of_service_url: settings.termsOfServiceUrl || null,
    site_noindex: settings.siteNoindex,
    ga4_measurement_id: settings.ga4MeasurementId || null,
    google_ads_id: settings.googleAdsId || null,
    google_ads_conversion_label: settings.googleAdsConversionLabel || null,
    head_scripts: settings.headScripts || null,
    footer_scripts: settings.footerScripts || null,
    site_name: settings.siteName,
    site_url: settings.siteUrl || null,
    global_schema: settings.globalSchema || null,
  };
}
