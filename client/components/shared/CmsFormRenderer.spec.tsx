/* @vitest-environment jsdom */

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CmsForm } from "@site/lib/cms/formTypes";

const { getWhatConvertsReadiness } = vi.hoisted(() => ({
  getWhatConvertsReadiness: vi.fn(),
}));

vi.mock("@site/lib/whatconvertsRefresh", () => ({
  getWhatConvertsReadiness,
}));

import CmsFormRenderer from "./CmsFormRenderer";

const TEST_FORM: CmsForm = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  name: "contact",
  display_name: "Contact Form",
  fields: [
    {
      id: "f1",
      type: "text",
      name: "fullName",
      label: "Full Name",
      required: true,
    },
  ],
  submit_button_text: "Send",
  success_message: "Thanks",
  redirect_url: "/thank-you/",
  created_at: "",
  updated_at: "",
};

describe("CmsFormRenderer", () => {
  let container: HTMLDivElement;
  let root: Root;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    getWhatConvertsReadiness.mockReturnValue({ state: "script-pending", scripts: [] });
    fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    window.history.replaceState({}, "", "/");
  });

  afterEach(() => {
    if (root) {
      act(() => {
        root.unmount();
      });
    }
    container?.remove();
    vi.unstubAllGlobals();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders Netlify form markup with visible contact form id during SSR", () => {
    const html = renderToString(<CmsFormRenderer formElementId="wc-contact-form" form={TEST_FORM} />);

    expect(html).toContain('id="wc-contact-form"');
    expect(html).toContain('name="contact"');
    expect(html).toContain('data-netlify="true"');
    expect(html).toContain('data-netlify-honeypot="bot-field"');
    expect(html).toContain('name="form-name"');
    expect(html).toContain('name="utm_source"');
    expect(html).toContain('name="landing_page"');
    expect(html).toContain('action="/"');
    expect(html).not.toContain('action="/thank-you/"');
    expect(html).toContain('name="fullName"');
  });

  it("keeps the working Netlify POST and does not use the auxiliary wc-track submit", async () => {
    vi.useFakeTimers();
    const requestSubmitSpy = vi.spyOn(HTMLFormElement.prototype, "requestSubmit");

    await act(async () => {
      root.render(<CmsFormRenderer formElementId="wc-contact-form" form={{ ...TEST_FORM, redirect_url: "" }} />);
    });

    const form = container.querySelector("form") as HTMLFormElement;
    const input = container.querySelector<HTMLInputElement>('input[name="fullName"]')!;
    input.value = "Jane Doe";

    await act(async () => {
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/",
      expect.objectContaining({ method: "POST" }),
    );
    expect(requestSubmitSpy).not.toHaveBeenCalled();
    expect(input.value).toBe("Jane Doe");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2_000);
    });

    expect(input.value).toBe("");
  });

  it("does not reset fields before the WhatConverts observation delay finishes", async () => {
    vi.useFakeTimers();

    await act(async () => {
      root.render(<CmsFormRenderer formElementId="wc-contact-form" form={{ ...TEST_FORM, redirect_url: "" }} />);
    });

    const form = container.querySelector("form") as HTMLFormElement;
    const input = container.querySelector<HTMLInputElement>('input[name="fullName"]')!;
    input.value = "Still Present";

    await act(async () => {
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1_999);
    });

    expect(input.value).toBe("Still Present");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });

    expect(input.value).toBe("");
  });

  it("emits tracking debug logs when debugTracking is enabled", async () => {
    vi.useFakeTimers();
    window.history.replaceState({}, "", "/contact/?debugTracking=1");
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => undefined);

    await act(async () => {
      root.render(<CmsFormRenderer formElementId="wc-contact-form" form={{ ...TEST_FORM, redirect_url: "" }} />);
    });

    const form = container.querySelector("form") as HTMLFormElement;

    await act(async () => {
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });

    expect(infoSpy).toHaveBeenCalledWith("[Tracking] submit handler started");
    expect(infoSpy).toHaveBeenCalledWith("[Tracking] WhatConverts script present");
    expect(infoSpy).toHaveBeenCalledWith("[Tracking] visible form id");
    expect(infoSpy).toHaveBeenCalledWith("[Tracking] visible form id: wc-contact-form");
    expect(infoSpy).toHaveBeenCalledWith("[Tracking] Netlify POST success");
    expect(infoSpy).toHaveBeenCalledWith("[Tracking] redirect delayed");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2_000);
    });
  });
});
