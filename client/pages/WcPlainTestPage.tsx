import { useEffect, useState } from "react";
import Seo from "@site/components/Seo";
import Layout from "@site/components/layout/Layout";

export default function WcPlainTestPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted">("idle");

  useEffect(() => {
    const form = document.getElementById("wc-plain-test");
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    const handleNativeSubmit = () => {
      setStatus("submitting");
    };

    form.addEventListener("submit", handleNativeSubmit);

    return () => {
      form.removeEventListener("submit", handleNativeSubmit);
    };
  }, []);

  return (
    <Layout>
      <Seo
        title="WhatConverts Plain Form Test"
        description="Temporary plain form test page."
        noindex={true}
      />

      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-accent">
            Temporary test page
          </p>
          <h1 className="mb-4 text-3xl font-bold text-slate-950">
            Plain WhatConverts Form Test
          </h1>
          <p className="mb-8 text-slate-600">
            This form intentionally has no React submit handler, no fetch submission,
            no Netlify capture attributes, and no redirect. It submits natively into
            a hidden iframe so the page can show a success message without leaving
            this test page.
          </p>

          {status !== "idle" && (
            <div
              role="status"
              aria-live="polite"
              className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800"
            >
              {status === "submitting"
                ? "Submitting test form..."
                : "Test form submitted. Check DevTools Network for a WhatConverts/Iconnode lead beacon."}
            </div>
          )}

          <form
            id="wc-plain-test"
            method="POST"
            action="/"
            target="wc-plain-test-target"
            className="space-y-5"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                First Name
                <input
                  type="text"
                  name="firstName"
                  autoComplete="given-name"
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Last Name
                <input
                  type="text"
                  name="lastName"
                  autoComplete="family-name"
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950"
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                Email
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Phone
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950"
                />
              </label>
            </div>

            <label className="block text-sm font-medium text-slate-700">
              Message
              <textarea
                name="message"
                rows={5}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950"
              />
            </label>

            <button
              type="submit"
              className="rounded-md bg-brand-accent px-6 py-3 font-semibold text-white transition hover:bg-brand-accent/90"
            >
              Submit plain test form
            </button>
          </form>

          <iframe
            title="Plain WhatConverts test submission target"
            name="wc-plain-test-target"
            src="about:blank"
            className="hidden"
            onLoad={() => setStatus((currentStatus) => currentStatus === "submitting" ? "submitted" : currentStatus)}
          />
        </div>
      </main>
    </Layout>
  );
}
