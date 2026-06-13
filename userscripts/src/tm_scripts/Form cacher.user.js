// ==UserScript==
// @name         Form cacher
// @namespace    http://tampermonkey.net/
// @version      2025-10-31
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(async function () {
  "use strict";

  // ---------- Core handler ----------
  async function handleSubmit(form) {
    try {
      const fields = [...form.querySelectorAll("input, select, textarea")];
      const data = {};

      for (const f of fields) {
        if (!f.name && !f.id) continue;
        const key = f.name || f.id;
        let val = f.value;
        if (f.type === "checkbox") val = f.checked;
        if (f.type === "radio" && !f.checked) continue;
        data[key] = val;
      }

      const siteKey = location.hostname;
      const storeKey = `form_data_${siteKey}`;
      const storedLocal = JSON.parse(localStorage.getItem(storeKey) || "{}");
      const merged = { ...storedLocal, ...data };

      // Store in localStorage
      localStorage.setItem(storeKey, JSON.stringify(merged));

      // Store in TM storage
      const allTMData = (await GM_getValue("autofillData", {})) || {};
      allTMData[siteKey] = merged;
      await GM_setValue("autofillData", allTMData);

      console.log(`✅ Saved form data for ${siteKey}`, merged);
    } catch (err) {
      console.error("❌ handleSubmit failed:", err);
    }
  }

  // ---------- Hook form submissions ----------
  document.addEventListener(
    "submit",
    (e) => {
      handleSubmit(e.target);
    },
    true,
  );

  // ---------- Hook button clicks ----------
  document.addEventListener(
    "click",
    (e) => {
      const btn = e.target.closest(
        'button, input[type="button"], input[type="submit"]',
      );
      if (!btn) return;

      const text = (btn.innerText || btn.value || "").toLowerCase();
      const name = (btn.name || "").toLowerCase();
      if (text.includes("submit") || name.includes("submit")) {
        // try to find nearest form
        const form = btn.closest("form");
        if (form) handleSubmit(form);
      }
    },
    true,
  );

  console.log("🧩 Submission catcher active");
})().catch(console.log);
