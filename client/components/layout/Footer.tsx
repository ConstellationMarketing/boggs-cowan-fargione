import { Link } from "react-router-dom";
import { MapPin, Phone } from "lucide-react";
import { useSiteSettings, useGlobalPhone } from "@site/contexts/SiteSettingsContext";
import RichText from "@site/components/shared/RichText";
import MobileNavSheet from "./MobileNavSheet";
import NavDropdown from "./NavDropdown";

function FooterPolicyLink({ href, label }: { href: string; label: string }) {
  if (!href || !label) {
    return null;
  }

  const isExternal = /^https?:\/\//i.test(href);

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="hover:text-brand-accent transition-colors duration-300"
      >
        {label}
      </a>
    );
  }

  return (
    <Link
      to={href}
      className="hover:text-brand-accent transition-colors duration-300"
    >
      {label}
    </Link>
  );
}

export default function Footer() {
  const { settings } = useSiteSettings();
  const { phoneNumber, phoneDisplay } = useGlobalPhone();

  const logoUrl = settings.logoUrl?.trim() || "";
  const logoAlt = settings.logoAlt?.trim() || settings.siteName?.trim() || "Logo";
  const taglineHtml = settings.footerTaglineHtml || "";
  const footerDescription = settings.footerDescription?.trim() || "";
  const addressLine1 = settings.addressLine1?.trim() || "";
  const addressLine2 = settings.addressLine2?.trim() || "";
  const mapEmbedUrl = settings.mapEmbedUrl?.trim() || "";
  const disclaimerText = settings.footerDisclaimerText?.trim() || "";
  const privacyPolicyLabel = settings.privacyPolicyLabel?.trim() || "";
  const privacyPolicyUrl = settings.privacyPolicyUrl?.trim() || "";
  const termsOfServiceLabel = settings.termsOfServiceLabel?.trim() || "";
  const termsOfServiceUrl = settings.termsOfServiceUrl?.trim() || "";
  const copyrightRaw = settings.copyrightText?.trim() || "";
  const copyrightText = copyrightRaw.replace(/\{year\}/gi, String(new Date().getFullYear()));
  const navItems = [...(settings.navigationItems ?? [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  const hasAddress = Boolean(addressLine1 || addressLine2);
  const hasMap = Boolean(mapEmbedUrl);
  const hasLocationBand = hasAddress || hasMap;
  const hasLegalRow = disclaimerText || (privacyPolicyLabel && privacyPolicyUrl) || (termsOfServiceLabel && termsOfServiceUrl);

  return (
    <footer className="bg-black py-[44px] md:py-[64px]">
      <div className="mx-auto flex w-[92%] max-w-[1200px] flex-col items-center text-center">
        <Link to="/" className="block">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={logoAlt}
              className="mx-auto w-[320px] max-w-full brightness-0 invert md:w-[420px]"
              width={420}
              height={69}
            />
          ) : (
            <span className="font-inter text-[32px] font-semibold leading-none text-white md:text-[42px]">
              {settings.siteName || " "}
            </span>
          )}
        </Link>

        {taglineHtml ? (
          <RichText
            html={taglineHtml}
            className="mt-6 max-w-[760px] font-inter text-[17px] leading-[1.6] text-white [&_p]:my-0 [&_p+p]:mt-4"
          />
        ) : null}

        {phoneDisplay ? (
          <a
            href={`tel:${phoneNumber.replace(/\D/g, "")}`}
            className="mt-6 inline-flex items-center justify-center gap-3 transition-all duration-300"
          >
            <Phone className="h-7 w-7 text-accent" strokeWidth={1.5} />
            <span className="font-inter text-[28px] font-semibold text-white transition-all duration-300 hover:text-accent md:text-[36px]">
              {phoneDisplay}
            </span>
          </a>
        ) : null}

        {footerDescription ? (
          <RichText
            html={footerDescription}
            className="mt-6 max-w-[760px] font-inter text-[17px] leading-[1.6] text-white [&_p]:my-0 [&_p+p]:mt-4"
          />
        ) : null}

        {hasLocationBand ? (
          <section className="mt-10 w-full max-w-[980px] rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-6 md:mt-12 md:px-8 md:py-8">
            <div
              className={[
                "grid gap-6",
                hasAddress && hasMap ? "md:grid-cols-[minmax(0,320px)_minmax(0,1fr)] md:items-center" : "",
              ].join(" ").trim()}
            >
              {hasAddress ? (
                <div className="space-y-4 text-center md:text-left">
                  <div className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-accent/40 px-3 py-1 font-inter text-[12px] font-semibold uppercase tracking-[0.24em] text-brand-accent md:justify-start">
                    <MapPin className="h-4 w-4" strokeWidth={1.5} />
                    <span>Visit Our Office</span>
                  </div>
                  <div className="space-y-2 font-inter text-[18px] leading-[1.7] text-white md:text-[20px]">
                    {addressLine1 ? <p>{addressLine1}</p> : null}
                    {addressLine2 ? <p className="text-white/80">{addressLine2}</p> : null}
                  </div>
                </div>
              ) : null}

              {hasMap ? (
                <div className={hasAddress ? "w-full" : "mx-auto w-full max-w-[720px]"}>
                  <div className="overflow-hidden rounded-[24px] border border-white/10 bg-black/20 shadow-[0_24px_60px_rgba(0,0,0,0.25)]">
                    <div className="h-[260px] w-full md:h-[300px]">
                      <iframe
                        src={mapEmbedUrl}
                        title="Office location map"
                        className="h-full w-full"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {navItems.length > 0 ? (
          <>
            <div className="mt-8 lg:hidden">
              <MobileNavSheet
                navItems={navItems}
                phoneDisplay={phoneDisplay}
                phoneNumber={phoneNumber}
                variant="footer"
              />
            </div>

            <nav className="mt-8 hidden items-center justify-center lg:flex">
              <ul className="flex flex-wrap items-center justify-center -mx-[11px]">
                {navItems.map((item, index) => {
                  const hasChildren = item.children && item.children.length > 0;

                  return (
                    <li key={`footer-nav-${item.href}-${index}`} className="px-[11px] flex items-center justify-center">
                      {hasChildren ? (
                        <NavDropdown item={item} />
                      ) : (
                        <Link
                          to={item.href}
                          target={item.openInNewTab ? "_blank" : undefined}
                          rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                          className="font-inter text-[16px] text-white mr-[20px] whitespace-nowrap hover:opacity-80 transition-opacity duration-400"
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </>
        ) : null}

        <div className="mt-8 h-px w-[80%] bg-brand-accent" />

        {hasLegalRow ? (
          <div className="mt-6 max-w-[860px] space-y-3 font-inter text-[15px] leading-[1.6] text-white">
            {disclaimerText ? <p>{disclaimerText}</p> : null}
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
              <FooterPolicyLink href={privacyPolicyUrl} label={privacyPolicyLabel} />
              {privacyPolicyUrl && privacyPolicyLabel && termsOfServiceUrl && termsOfServiceLabel ? (
                <span aria-hidden="true">|</span>
              ) : null}
              <FooterPolicyLink href={termsOfServiceUrl} label={termsOfServiceLabel} />
            </div>
          </div>
        ) : null}

        {copyrightText ? (
          <p className="mt-6 font-inter text-[14px] leading-[1.6] text-white/50">
            {copyrightText}
          </p>
        ) : null}
      </div>
    </footer>
  );
}
