// ==UserScript==
// @name         LinkedIn
// @namespace    http://tampermonkey.net/
// @version      2025-08-29
// @description  try to take over the world!
// @author       You
// @match        https://www.linkedin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js
// @grant        none
// ==/UserScript==

(async function () {
  "use strict";

  function easyApplyNextKeyboardShortcut() {
    document.addEventListener("keydown", async function (e) {
      try {
        if (e.key === "Enter" && e.shiftKey) {
          e.preventDefault(); // stops default newline
          console.log("Shift + Enter pressed!");

          const isEasyApplyModalShowing = !!document.querySelector(
            "[data-test-modal-container]",
          );

          if (!isEasyApplyModalShowing) {
            // when done, move to next
            const recentlyAppliedText =
              document
                .querySelector(
                  ".job-details-jobs-unified-top-card__container--two-pane .artdeco-inline-feedback--success",
                )
                ?.textContent?.toLowerCase?.() || "";
            if (recentlyAppliedText.includes("applied")) {
              const nextItem = document
                .querySelector(
                  "li:has(.jobs-search-results-list__list-item--active) + li",
                )
                ?.querySelector?.(".job-card-container__link");
              if (!nextItem) console.log("next item now found");
              nextItem?.click?.();
            } else {
              // apply button easy
              document
                .querySelector(
                  ".jobs-apply-button--top-card [data-live-test-job-apply-button]",
                )
                ?.click?.();

              // hit yes if that didnt work
              document
                .querySelector('[aria-label="Did you apply?, Yes"]')
                ?.click?.();
            }
            return;
          }

          const button = document.querySelector(
            "[data-test-modal-container] .artdeco-button--primary",
          );

          if (!button) {
            console.log("Next button not found");
            return;
          }

          if (button.textContent.toLowerCase().includes("submit")) {
            document.querySelector("#follow-company-checkbox")?.click(); // unfollow
            console.log("Checkbox clicked, hopefully unticked now");
            button.click();
          } else if (button.textContent.toLowerCase().includes("show jobs")) {
            // dismiss
            document
              .querySelector(
                "[data-test-modal-container] [aria-label='Dismiss']",
              )
              ?.click?.();
          } else {
            console.log("Next pressed");
            button.click();
          }
        }

        if (e.key === "|" && e.shiftKey) {
          e.preventDefault(); // stops default newline
          console.log("Shift + Enter pressed!");

          const isEasyApplyModalShowing = !!document.querySelector(
            "[data-test-modal-container]",
          );

          if (!isEasyApplyModalShowing) {
            // when done, move to next
            const recentlyAppliedText =
              document
                .querySelector(
                  ".job-details-jobs-unified-top-card__container--two-pane .artdeco-inline-feedback--success",
                )
                ?.textContent?.toLowerCase?.() || "";
            if (recentlyAppliedText.includes("applied")) {
              const nextItem = document
                .querySelector(
                  "li:has(.jobs-search-results-list__list-item--active) + li",
                )
                ?.querySelector?.(".job-card-container__link");
              if (!nextItem) console.log("next item now found");
              nextItem?.click?.();
            } else {
              // apply button easy
              document
                .querySelector(
                  ".jobs-apply-button--top-card [data-live-test-job-apply-button]",
                )
                ?.click?.();

              // hit yes if that didnt work
              document
                .querySelector('[aria-label="Did you apply?, Yes"]')
                ?.click?.();
            }
            return;
          }

          const button = document.querySelector(
            "[data-test-modal-container] .artdeco-button--secondary",
          );

          if (!button) {
            console.log("Next button not found");
            return;
          }

          if (button.textContent.toLowerCase().includes("submit")) {
            document.querySelector("#follow-company-checkbox")?.click(); // unfollow
            console.log("Checkbox clicked, hopefully unticked now");
            button.click();
          } else if (button.textContent.toLowerCase().includes("show jobs")) {
            // dismiss
            document
              .querySelector(
                "[data-test-modal-container] [aria-label='Dismiss']",
              )
              ?.click?.();
          } else {
            console.log("Next pressed");
            button.click();
          }
        }
      } catch (e) {
        console.log(e);
      }
    });
    console.log("Shift + Enter setup complete");
  }
  window.easyApplyNextKeyboardShortcut = easyApplyNextKeyboardShortcut;
  easyApplyNextKeyboardShortcut();

  async function handleTabOpenings() {
    console.log("Job ran");
    function addTabs() {
      const currentKeys = Array.from(
        document.querySelectorAll("[href*='jobs/view']"),
      ).map((item) => item.href);
      const existingKeys = JSON.parse(
        localStorage.getItem("pending_tabs") || "[]",
      );

      localStorage.setItem(
        "pending_tabs",
        JSON.stringify(
          Array.from(new Set([...currentKeys, ...existingKeys]).keys()),
        ),
      );
    }

    function openTab() {
      const keys = JSON.parse(localStorage.getItem("pending_tabs") || "[]");
      if (keys.length > 0) {
        const key = keys.shift();
        window.open(key, "_blank");
        localStorage.setItem("pending_tabs", JSON.stringify(keys));
      }
    }

    window.waitForMilliseconds(2000);

    if (window.location.pathname.includes("/saved-jobs/")) {
      addTabs();
      openTab();
    } else if (window.location.pathname.includes("/jobs/view")) {
      openTab();
    }
  }

  window?.isSiteLoaded?.(function hideApplied() {
    window.sleep(1500);
    const jobs = Array.from(
      document.querySelectorAll("[data-occludable-job-id]"),
    ).map((job) => ({
      item: job,
      title: ".job-card-list__title--link",
      company: document.querySelector(".artdeco-entity-lockup__subtitle"),
      applied: job
        .querySelector(
          ".job-card-container__footer-item.job-card-container__footer-job-state.t-bold",
        )
        .textContent.toLowerCase()
        .includes("applied"),
    }));
    jobs.forEach((box) => {
      if (box.applied) {
        console.log("Hiding", { company: box.company, title: box.title });
        box.style.display = "hidden";
      }
    });
  });

  window?.isSiteLoaded?.(function hideApplied() {
    window.sleep(1500);
    const button = document.querySelector(
      "[aria-label='Click to see more description']",
    );
    button?.click?.();
  });

  function markAppliedViewed() {
    document
      .querySelectorAll(".job-card-container--clickable")
      .forEach((item) => {
        if (!item.getAttribute("done-tag")) {
          item.addEventListener("click", () => {
            if (item.textContent.toLowerCase().includes("applied")) {
              item.querySelector(`[aria-label*="Dismiss"]`)?.click?.();
              item.remove();
            } else if (item.textContent.toLowerCase().includes("viewed")) {
              item.setAttribute("style", "opacity: 0.5;");
            }
          });
          item.setAttribute("done-tag", true);
        }
      });
  }
  window.markAppliedViewed = markAppliedViewed;

  function downloadWhenReady() {
    const TIMEOUT = 3 * 1000;
    const FREQUENCY = 100;
    let timePassed = 0;
    const interval = setInterval(() => {
      if (timePassed > TIMEOUT) clearInterval(interval);
      timePassed += FREQUENCY;
      const button = document.querySelector(
        "[aria-label='Click to see more description']",
      );
      button?.click?.();
      clearInterval(interval);
      button.click();
    }, FREQUENCY);
  }

  async function hideAll() {
    for (const item of Array.from(
      document.querySelectorAll(`button[aria-label*="Dismiss "]`),
    )) {
      item.click();
      console.log(item.getAttribute("aria-label").replace("Dismiss ", ""));
      await wait(500 + 500 * Math.random());
    }
  }
  window.hideAll = hideAll;
})();
