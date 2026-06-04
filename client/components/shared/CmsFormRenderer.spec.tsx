// @vitest-environment jsdom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CmsForm } from "@site/lib/cms/formTypes";

const { waitForWhatConvertsReady } = vi.hoisted(() => ({
  waitForWhatConvertsReady: vi.fn(),
}));

vi.mock("@site/lib/whatconvertsRefresh", () => ({
  waitForWhatConvertsReady,
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

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });

  return { promise, resolve, reject };
}

describe("CmsFormRenderer", () => {
  let container: HTMLDivElement;
  let root: Root;
  let requestSubmitSpy: ReturnType<typeof vi.spyOn>;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    waitForWhatConvertsReady.mockResolvedValue(true);
    fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    requestSubmitSpy = vi.spyOn(HTMLFormElement.prototype, "requestSubmit").mockImplementation(function requestSubmit() {
      const form = this as HTMLFormElement;
      queueMicrotask(() => {
        const iframe = document.querySelector<HTMLIFrameElement>(`iframe[name="${form.getAttribute("target")}"]`);
        iframe?.dispatchEvent(new Event("load"));
      });
    });
  });

  afterEach(() => {
    if (root) {
      act(() => {
        root.unmount();
      });
    }
    container?.remove();
    requestSubmitSpy?.mockRestore();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("renders netlify form markup with hidden tracking inputs during SSR", () => {
    const html = renderToString(<CmsFormRenderer form={TEST_FORM} />);

    expect(html).toContain('data-netlify="true"');
    expect(html).toContain('data-netlify-honeypot="bot-field"');
    expect(html).toContain('name="form-name"');
    expect(html).toContain('name="utm_source"');
    expect(html).toContain('name="landing_page"');
    expect(html).toContain('action="/"');
    expect(html).not.toContain('action="/thank-you/"');
    expect(html).toContain('name="fullName"');
  });

  it("submits to Netlify first, then runs auxiliary WhatConverts tracking with current field values", async () => {
    const netlifySubmit = createDeferred<Response>();
    fetchMock.mockReturnValueOnce(netlifySubmit.promise);
    let trackedFormData: FormData | null = null;
    requestSubmitSpy.mockImplementationOnce(function requestSubmit() {
      const form = this as HTMLFormElement;
      trackedFormData = new FormData(form);
      queueMicrotask(() => {
        document
          .querySelector<HTMLIFrameElement>(`iframe[name="${form.getAttribute("target")}"]`)
          ?.dispatchEvent(new Event("load"));
      });
    });

    await act(async () => {
      root.render(<CmsFormRenderer form={{ ...TEST_FORM, redirect_url: "" }} />);
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

    await act(async () => {
      netlifySubmit.resolve({ ok: true } as Response);
      await netlifySubmit.promise;
    });

    expect(waitForWhatConvertsReady).toHaveBeenCalledWith({ timeoutMs: 2000 });
    expect(requestSubmitSpy).toHaveBeenCalledTimes(1);
    expect(trackedFormData?.get("fullName")).toBe("Jane Doe");
  });

  it("keeps values until tracking finishes, then resets only after iframe load", async () => {
    let dispatchIframeLoad: (() => void) | undefined;
    requestSubmitSpy.mockImplementationOnce(function requestSubmit() {
      const form = this as HTMLFormElement;
      dispatchIframeLoad = () => {
        document
          .querySelector<HTMLIFrameElement>(`iframe[name="${form.getAttribute("target")}"]`)
          ?.dispatchEvent(new Event("load"));
      };
    });

    await act(async () => {
      root.render(<CmsFormRenderer form={{ ...TEST_FORM, redirect_url: "" }} />);
    });

    const form = container.querySelector("form") as HTMLFormElement;
    const input = container.querySelector<HTMLInputElement>('input[name="fullName"]')!;
    input.value = "Still Present";

    await act(async () => {
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(input.value).toBe("Still Present");

    await act(async () => {
      dispatchIframeLoad?.();
      await Promise.resolve();
    });

    expect(input.value).toBe("");
  });

  it("continues after the tracking iframe timeout if the iframe never loads", async () => {
    vi.useFakeTimers();
    requestSubmitSpy.mockImplementationOnce(() => undefined);

    await act(async () => {
      root.render(<CmsFormRenderer form={{ ...TEST_FORM, redirect_url: "" }} />);
    });

    const form = container.querySelector("form") as HTMLFormElement;
    const input = container.querySelector<HTMLInputElement>('input[name="fullName"]')!;
    input.value = "Timeout Reset";

    await act(async () => {
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });

    expect(input.value).toBe("Timeout Reset");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2_000);
    });

    expect(input.value).toBe("");
  });
});
