import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { renderRoute } from "../../../client/entry-server";
import { buildRoutePreload } from "../../../client/lib/cms/routePreload";
import {
  loadSiteSettings,
  normalizeCmsUrlPath,
  normalizePostSlug,
  type SiteSettings,
} from "../../../client/lib/cms/publicLoaders";
import { serializePreloadedState, type CmsPreloadedState } from "../../../client/lib/preloadState";
import type { Database } from "../client/lib/database.types";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey || !supabaseAnonKey) {
  console.error("Supabase credentials not configured. SSG generation cannot continue.");
  console.error("Set VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY before running build:ssg.");
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceRoleKey);

interface PageRow {
  id: string;
  title: string;
  url_path: string;
  noindex: boolean;
  updated_at: string;
}

interface PostRow {
  id: string;
  title: string;
  slug: string;
  noindex: boolean;
  updated_at: string;
}

interface Redirect {
  from_path: string;
  to_path: string;
  status_code: number;
}

async function generateSSG() {
  console.log("Starting SSG generation...");

  const siteSettings = await loadSiteSettings();
  const renderSiteSettings = normalizeSiteSettingsForRender(siteSettings);
  const bodyStartScripts = getBodyStartScripts(siteSettings);
  const siteUrl = (process.env.SITE_URL || siteSettings.siteUrl || "").replace(/\/+$/, "");

  if (!siteUrl) {
    console.warn("[SSG] WARNING: No site URL configured. Skipping canonical URL-dependent output.");
  } else {
    console.log("Resolved site URL:", siteUrl);
  }

  const { data: pages, error: pagesError } = await supabase
    .from("pages")
    .select("id, title, url_path, noindex, updated_at")
    .eq("status", "published");

  if (pagesError) {
    console.error("Error fetching pages:", pagesError);
    process.exit(1);
  }

  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("id, title, slug, noindex, updated_at")
    .eq("status", "published");

  if (postsError) {
    console.error("Error fetching posts:", postsError);
    process.exit(1);
  }

  const templatePath = path.join(process.cwd(), "dist/spa/index.html");
  if (!fs.existsSync(templatePath)) {
    console.error("Template not found at dist/spa/index.html. Run build:client first.");
    process.exit(1);
  }

  const template = sanitizeTemplateHtml(fs.readFileSync(templatePath, "utf-8"), renderSiteSettings);

  console.log(`Found ${pages?.length || 0} published pages`);
  for (const page of pages || []) {
    const urlPath = normalizeCmsUrlPath(page.url_path);
    const preloadState = await buildRoutePreload(urlPath, { siteSettings: renderSiteSettings });
    const rendered = renderRoute(urlPath, preloadState);
    const html = generatePageHtml(
      template,
      rendered.html,
      rendered.helmet,
      preloadState,
      renderSiteSettings,
      bodyStartScripts,
    );

    const outputPath = urlPath === "/"
      ? path.join(process.cwd(), "dist/spa/index.html")
      : path.join(process.cwd(), "dist/spa", urlPath.slice(1), "index.html");

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, html);
    console.log(`Generated: ${urlPath}`);
  }

  console.log(`Found ${posts?.length || 0} published posts`);
  for (const post of posts || []) {
    const normalizedSlug = normalizePostSlug(post.slug);
    if (!normalizedSlug) {
      continue;
    }

    const urlPath = `/blog/${normalizedSlug}/`;
    const preloadState = await buildRoutePreload(urlPath, { siteSettings: renderSiteSettings });
    const rendered = renderRoute(urlPath, preloadState);
    const html = generatePageHtml(
      template,
      rendered.html,
      rendered.helmet,
      preloadState,
      renderSiteSettings,
      bodyStartScripts,
    );
    const outputPath = path.join(process.cwd(), "dist/spa", "blog", normalizedSlug, "index.html");

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, html);
    console.log(`Generated post: ${urlPath}`);
  }

  await generateRedirects();
  generateRobotsTxt(siteSettings, siteUrl);

  console.log("SSG generation complete!");
}

async function generateRedirects() {
  const { data: redirects, error: redirectsError } = await supabase
    .from("redirects")
    .select("from_path, to_path, status_code")
    .eq("enabled", true);

  const functionRedirects = [
    "/sitemap.xml /.netlify/functions/sitemap 200",
    "/sitemap-pages.xml /.netlify/functions/sitemap-pages 200",
    "/sitemap-posts.xml /.netlify/functions/sitemap-posts 200",
    "/api/* /.netlify/functions/api/:splat 200",
  ].join("\n");

  if (redirectsError) {
    console.error("Error fetching redirects:", redirectsError);
    return;
  }

  const cmsRedirects = (redirects || [])
    .map((redirect: Redirect) => `${redirect.from_path} ${redirect.to_path} ${redirect.status_code}`)
    .join("\n");

  const redirectsContent = cmsRedirects
    ? `${functionRedirects}\n${cmsRedirects}\n/* /index.html 200`
    : `${functionRedirects}\n/* /index.html 200`;

  fs.writeFileSync(path.join(process.cwd(), "dist/spa/_redirects"), redirectsContent);
  console.log(`Generated _redirects with function routes${cmsRedirects ? " + CMS redirects" : ""} + SPA fallback`);
}

function generateRobotsTxt(siteSettings: SiteSettings, siteUrl: string) {
  if (!siteUrl) {
    console.warn("[SSG] Skipping robots.txt — no site URL configured.");
    return;
  }

  const robotsTxt = siteSettings.siteNoindex
    ? "User-agent: *\nDisallow: /"
    : `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml`;

  fs.writeFileSync(path.join(process.cwd(), "dist/spa/robots.txt"), robotsTxt);
  console.log(`Generated robots.txt (${siteSettings.siteNoindex ? "noindex" : "indexable"})`);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function removeNoscriptBlocks(html: string) {
  return html
    .replace(/<!--\s*Google Tag Manager \(noscript\)\s*-->[\s\S]*?<!--\s*End Google Tag Manager \(noscript\)\s*-->/gi, "")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, "")
    .trim();
}

function extractNoscriptBlocks(html: string) {
  return html.match(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi)?.join("\n") ?? "";
}

function htmlContainsGoogleTagId(html: string, tagId: string) {
  return Boolean(tagId) && html.includes(tagId) && /gtag|googletagmanager|google-analytics/i.test(html);
}

function removeGoogleTagSnippets(html: string, tagIds: string[]) {
  return tagIds.reduce((cleanedHtml, tagId) => {
    if (!tagId) {
      return cleanedHtml;
    }

    const escapedTagId = escapeRegExp(tagId);
    const gtagSrcPattern = new RegExp(
      `<script\\b(?=[^>]*\\bsrc=["'](?:https?:)?//www\\.googletagmanager\\.com/gtag/js\\?id=${escapedTagId}(?:[&"'][^"']*)?["'])[^>]*>[\\s\\S]*?<\\/script>`,
      "gi",
    );
    const inlineScriptPattern = new RegExp(
      `<script\\b(?![^>]*\\bsrc=)[^>]*>[\\s\\S]*?${escapedTagId}[\\s\\S]*?<\\/script>`,
      "gi",
    );

    return cleanedHtml
      .replace(gtagSrcPattern, "")
      .replace(inlineScriptPattern, (script) =>
        /gtag|dataLayer|googletagmanager|google-analytics/i.test(script) ? "" : script,
      )
      .trim();
  }, html);
}

function getBodyStartScripts(siteSettings: SiteSettings) {
  return [
    extractNoscriptBlocks(siteSettings.headScripts),
    extractNoscriptBlocks(siteSettings.footerScripts),
  ]
    .filter(Boolean)
    .join("\n");
}

function normalizeSiteSettingsForRender(siteSettings: SiteSettings): SiteSettings {
  const googleTagIds = [siteSettings.ga4MeasurementId, siteSettings.googleAdsId].filter(Boolean);

  return {
    ...siteSettings,
    headScripts: removeGoogleTagSnippets(removeNoscriptBlocks(siteSettings.headScripts), googleTagIds),
    footerScripts: removeGoogleTagSnippets(removeNoscriptBlocks(siteSettings.footerScripts), googleTagIds),
  };
}

function insertBodyStartHtml(html: string, bodyStartHtml: string) {
  if (!bodyStartHtml.trim()) {
    return html;
  }

  return html.replace(/<body([^>]*)>/i, `<body$1>\n${bodyStartHtml}`);
}

function generatePageHtml(
  template: string,
  appHtml: string,
  helmet: { title: string; meta: string; link: string; script: string },
  preloadState: CmsPreloadedState,
  siteSettings: SiteSettings,
  bodyStartScripts = "",
) {
  const footerScripts = siteSettings.footerScripts;
  const preloadScript = `<script>window.__CMS_PRELOADED_STATE__=${serializePreloadedState(preloadState)}</script>`;
  const analyticsScripts = buildAnalyticsMarkup(siteSettings);
  const headInjection = [
    helmet.title,
    helmet.meta,
    helmet.link,
    helmet.script,
    analyticsScripts,
    siteSettings.headScripts,
    preloadScript,
  ]
    .filter(Boolean)
    .join("\n");

  let html = replaceRootHtml(template, appHtml);
  html = html.replace("</head>", `${headInjection}\n</head>`);
  html = insertBodyStartHtml(html, bodyStartScripts);

  if (footerScripts) {
    html = html.replace("</body>", `${footerScripts}\n</body>`);
  }

  return html;
}

function sanitizeTemplateHtml(template: string, siteSettings: SiteSettings) {
  let html = template;

  html = html
    .replace(/<title[^>]*data-rh="true"[\s\S]*?<\/title>/g, "")
    .replace(/<meta[^>]*data-rh="true"[^>]*\/?>/g, "")
    .replace(/<link[^>]*data-rh="true"[^>]*\/?>/g, "")
    .replace(/<script[^>]*data-rh="true"[\s\S]*?<\/script>/g, "")
    .replace(/<script>window\.__CMS_PRELOADED_STATE__=[\s\S]*?<\/script>/g, "")
    .replace(/<script[^>]*src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=[^"]+"[^>]*><\/script>/g, "")
    .replace(/<script>\s*window\.dataLayer = window\.dataLayer \|\| \[\];[\s\S]*?<\/script>/g, "")
    .replace(/<script>\s*gtag\('config', '[^']+'\);\s*<\/script>/g, "")
    .replace(/<!--\s*Google Tag Manager \(noscript\)\s*-->[\s\S]*?<!--\s*End Google Tag Manager \(noscript\)\s*-->/gi, "")
    .replace(/<noscript\b[^>]*>\s*<iframe\b[^>]*src=["'][^"']*googletagmanager\.com\/ns\.html[^"']*["'][\s\S]*?<\/iframe>\s*<\/noscript>/gi, "");

  if (siteSettings.headScripts.trim()) {
    html = html.replace(siteSettings.headScripts, "");
  }

  if (siteSettings.footerScripts.trim()) {
    html = html.replace(siteSettings.footerScripts, "");
  }

  return replaceRootHtml(html, "");
}

function replaceRootHtml(template: string, appHtml: string) {
  const rootStart = template.indexOf('<div id="root">');
  if (rootStart === -1) {
    return template;
  }

  const rootTagEnd = template.indexOf(">", rootStart);
  const bodyClose = template.indexOf("</body>", rootTagEnd);
  if (rootTagEnd === -1 || bodyClose === -1) {
    return template;
  }

  const rootClose = template.lastIndexOf("</div>", bodyClose);
  if (rootClose === -1) {
    return template;
  }

  return `${template.slice(0, rootTagEnd + 1)}${appHtml}${template.slice(rootClose)}`;
}

function buildAnalyticsMarkup(siteSettings: SiteSettings) {
  let analyticsScripts = "";
  const cmsScripts = `${siteSettings.headScripts}\n${siteSettings.footerScripts}`;
  const hasCmsGa4 = htmlContainsGoogleTagId(cmsScripts, siteSettings.ga4MeasurementId);
  const hasCmsGoogleAds = htmlContainsGoogleTagId(cmsScripts, siteSettings.googleAdsId);

  if (siteSettings.ga4MeasurementId && !hasCmsGa4) {
    analyticsScripts += `
<script async src="https://www.googletagmanager.com/gtag/js?id=${escapeHtml(siteSettings.ga4MeasurementId)}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${escapeHtml(siteSettings.ga4MeasurementId)}');
</script>`;
  }

  if (siteSettings.googleAdsId && !hasCmsGoogleAds) {
    if (!siteSettings.ga4MeasurementId && !hasCmsGa4) {
      analyticsScripts += `
<script async src="https://www.googletagmanager.com/gtag/js?id=${escapeHtml(siteSettings.googleAdsId)}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
</script>`;
    }

    analyticsScripts += `
<script>
  gtag('config', '${escapeHtml(siteSettings.googleAdsId)}');
</script>`;
  }

  return analyticsScripts.trim();
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

generateSSG().catch((error) => {
  console.error("SSG generation failed:", error);
  process.exit(1);
});
