// ==UserScript==
// @name         Instahyre
// @namespace    http://tampermonkey.net/
// @version      2026-01-30
// @description  try to take over the world!
// @author       You
// @match        https://www.instahyre.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instahyre.com
// @grant        none
// ==/UserScript==
(function () {
  "use strict";

  async function fetchAndProcessHTML(url) {
    return fetch(url)
      .then((response) => {
        // Check if the request was successful
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // When the page is loaded, convert it to text
        return response.text();
      })
      .then((html) => {
        // Initialize the DOM parser
        const parser = new DOMParser();

        // Parse the text into a new HTML Document object
        const doc = parser.parseFromString(html, "text/html");

        // You can now select elements from the parsed document
        const date = JSON.parse(
          Array.from(
            doc.querySelectorAll(`script[type="application/ld+json"]`),
          ).find((item) => item.textContent.includes("title")).textContent,
        ).datePosted;
        return date;

        // Example of injecting an element into the current page's body
        // document.body.appendChild(doc.querySelector('article'));
      })
      .catch((error) => {
        console.error("Failed to fetch or parse page:", error);
      });
  }

  async function addAgoDate(hideOlder = true) {
    await wait(500);
    // Adds created at to jobs
    if (window.location.href.includes("/job-")) {
      const datePosted = JSON.parse(
        Array.from(
          document.querySelectorAll(`script[type="application/ld+json"]`),
        ).find((item) => item.textContent.includes("title")).textContent,
      ).datePosted;
      document.querySelector(".company-name").innerHTML =
        document.querySelector(".company-name").innerHTML.split("{").at(0) +
        ` <span style="color: red;" title="${new Date(datePosted).toDateString().split(" ").slice(1).join(" ")}">{${formatRelativeDate(new Date(datePosted))}}</span>`;
    } else {
      console.log("/jobs/ not relevant");
    }

    const onResultsPage = !!document.querySelectorAll(".employer-row").length;
    if (onResultsPage) {
      let jobs = [];
      try {
        jobs = JSON.parse(
          Array.from(
            document.querySelectorAll(`[type="application/ld+json"]`),
          )?.find?.((item) => item.textContent.includes("/job-"))?.textContent,
        )?.itemListElement;
        document.querySelectorAll(".employer-row").forEach(async (row, idx) => {
          const title = row.querySelector(".company-name");

          // await wait(200);

          if (!jobs[idx]?.url) return;
          //
          // if (!!title.querySelector(".added-date")) {
          //     console.log(title.textContent, "skipped as already done!");
          //     return;
          // }
          //
          const gottenDate = await fetchAndProcessHTML(jobs[idx].url);
          const isOld = window.dateDiff(new Date(), new Date(gottenDate)) >= 32;
          await q(() => {
            title.innerHTML =
              ` <span style="color: red;" class="added-date" title="${new Date(gottenDate).toDateString().split(" ").slice(1).join(" ")}">{${formatRelativeDate(new Date(gottenDate))}}</span>}` +
              (title.innerHTML.split("</span>}").at(1) || title.innerHTML);
          });
          console.log(
            `Trying job idx / ${jobs.length} ${gottenDate}`,
            jobs[idx]?.url,
          );
          if (hideOlder && isOld) {
            //
            // document.querySelector(`.employer-row:has([title='${title.getAttribute("title")}'])`)?.remove?.();
            //
            const notInterested = row.querySelector(
              `[id="not-interested-btn"]`,
            );
            console.log("Clicking " + title.textContent);
            await q(() => notInterested?.click?.());
            // await wait(200);
          }
        });
      } catch (e) {
        console.log("Metadata not found.");
        console.log("onResultsPage not relevant");
      }
    }
  }

  if (document.querySelectorAll(`button#show-results`).length)
    Array.from(
      document.querySelectorAll(`button#show-results`),
    )[0].addEventListener("click", addAgoDate);

  const inviteButton = document.querySelector("#nav-invite-friends");
  inviteButton.removeAttribute("href");
  inviteButton.addEventListener("click", addAgoDate);

  window.addAgoDate = addAgoDate;
  addAgoDate();
  // Your code here...
})();
