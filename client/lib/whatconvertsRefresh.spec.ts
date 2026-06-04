// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("whatconvertsRefresh", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
    document.head.innerHTML = "";
    document.body.innerHTML = "";
    delete (window as Window & { _wcq?: unknown })._wcq;
    delete (window as Window & { _wci?: unknown })._wci;
    delete (window as Window & { WhatConverts?: unknown }).WhatConverts;
    window.history.replaceState({}, "", "/");
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("returns absent readiness and stays quiet when no script is present", async () => {
    const module = await import("./whatconvertsRefresh");

    expect(module.getWhatConvertsReadiness().state).toBe("absent");
    expect(() => module.refreshWhatConvertsDni("no-script", { force: true })).not.toThrow();
    expect(document.querySelectorAll("script[data-wc-dni-copy]")).toHaveLength(0);
  });

  it("pushes full route context through the WhatConverts queue when available", async () => {
    window.history.replaceState({}, "", "/contact/?utm_source=test#faq");
    const wcq: Array<Record<string, unknown>> = [];
    (window as Window & { _wcq?: Array<Record<string, unknown>> })._wcq = wcq;

    const module = await import("./whatconvertsRefresh");
    module.refreshWhatConvertsDni("route-change", { force: true });

    expect(wcq).toHaveLength(1);
    expect(wcq[0]).toMatchObject({
      event: "pageview",
      reason: "route-change",
      path: "/contact/?utm_source=test#faq",
      pathname: "/contact/",
      search: "?utm_source=test",
      hash: "#faq",
    });
  });

  it("prefers the live runtime scan API when the queue also exists", async () => {
    const wcq: Array<Record<string, unknown>> = [];
    const run = vi.fn();
    (window as Window & { _wcq?: Array<Record<string, unknown>>; _wci?: { run: () => void } })._wcq = wcq;
    (window as Window & { _wci?: { run: () => void } })._wci = { run };

    const module = await import("./whatconvertsRefresh");
    module.refreshWhatConvertsDni("route-change", { force: true });

    expect(wcq).toHaveLength(1);
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("updates the WhatConverts page context before refreshing DNI", async () => {
    window.history.replaceState({}, "", "/family-law/?utm_source=test#top");
    const run = vi.fn();
    (window as Window & { _wci?: { run: () => void } })._wci = { run };
    (window as Window & { $wc_leads?: { doc?: Record<string, unknown> } }).$wc_leads = {};

    const module = await import("./whatconvertsRefresh");
    module.refreshWhatConvertsDni("route-change", { force: true });

    expect(window.$wc_leads?.doc).toMatchObject({
      search: "?utm_source=test",
      hash: "#top",
    });
    expect(String(window.$wc_leads?.doc?.url)).toContain("/family-law/");
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("detects the production WhatConverts external script host", async () => {
    const module = await import("./whatconvertsRefresh");
    const script = document.createElement("script");
    script.src = "https://s.ksrndkehqnwntyxlhgto.com/165912.js";

    expect(module.isWhatConvertsScript(script)).toBe(true);
  });

  it.each(["$wc_load", "$wc_leads", "wc_lead"])(
    "detects inline WhatConverts content containing %s",
    async (marker) => {
      const module = await import("./whatconvertsRefresh");
      const script = document.createElement("script");
      script.textContent = `window.marker = ${JSON.stringify(marker)};`;

      expect(module.isWhatConvertsScript(script)).toBe(true);
    },
  );

  it("waits until a WhatConverts script appears", async () => {
    const module = await import("./whatconvertsRefresh");
    const promise = module.waitForWhatConvertsReady({ timeoutMs: 500 });

    setTimeout(() => {
      const script = document.createElement("script");
      script.src = "https://s.ksrndkehqnwntyxlhgto.com/165912.js";
      document.head.appendChild(script);
    }, 100);

    await vi.advanceTimersByTimeAsync(150);
    await expect(promise).resolves.toBe(true);
  });

  it("times out safely when WhatConverts never appears", async () => {
    const module = await import("./whatconvertsRefresh");
    const promise = module.waitForWhatConvertsReady({ timeoutMs: 200 });

    await vi.advanceTimersByTimeAsync(250);
    await expect(promise).resolves.toBe(false);
  });

  it("registers WhatConverts script load handlers and refreshes once the script loads", async () => {
    const wcq: Array<Record<string, unknown>> = [];
    (window as Window & { _wcq?: Array<Record<string, unknown>> })._wcq = wcq;

    const module = await import("./whatconvertsRefresh");
    const script = document.createElement("script");
    script.src = "https://cdn.example.com/whatconverts.js";
    document.head.appendChild(script);

    module.registerWhatConvertsScriptNodes([script], "manual-register");
    script.dispatchEvent(new Event("load"));

    expect(wcq).toHaveLength(1);
    expect(String(wcq[0]["reason"])).toContain("script-load");
  });

  it("schedules repeated refresh attempts and cancels them when requested", async () => {
    const wcq: Array<Record<string, unknown>> = [];
    (window as Window & { _wcq?: Array<Record<string, unknown>> })._wcq = wcq;

    const module = await import("./whatconvertsRefresh");

    module.scheduleRefreshSeries("route-series");
    vi.advanceTimersByTime(3_100);
    expect(wcq).toHaveLength(4);

    wcq.length = 0;
    module.scheduleRefreshSeries("cancelled-series");
    module.cancelScheduledRefreshes();
    vi.advanceTimersByTime(3_100);
    expect(wcq).toHaveLength(0);
  });
});
