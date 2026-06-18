// ==UserScript==
// @name         Amazon
// @namespace    http://tampermonkey.net/
// @version      2024-10-02
// @description  try to take over the world!
// @author       You
// @match        https://www.amazon.sa/*
// @match        https://www.amazon.ae/*
// @match        https://www.amazon.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.in
// @grant        none
// ==/UserScript==

(async function () {
  "use strict";

  function main() {
    function addReviewAndInfo() {
      // add reviews button for quick going and coming back
      const button = document.createElement("button");
      button.textContent = "See reviews";
      button.style.color = "red";
      button.onclick = () => {
        document.querySelector("#cm_cr_dp_d_rating_histogram").scrollIntoView();
      };
      const titleElement = document.querySelector("#title");
      let backButton2Added = false;

      const priceTrackerButton = document.createElement("button");
      priceTrackerButton.textContent = "Price diff";
      priceTrackerButton.style.color = "red";
      priceTrackerButton.onclick = () => {
        document.querySelector("#keepaContainer").scrollIntoView();
        if (!backButton2Added) addBackButton2();
      };
      titleElement.prepend(priceTrackerButton);
      titleElement.prepend(button);

      // click see more
      const basicDescriptionExpander = document.querySelector("#poExpander");
      if (
        basicDescriptionExpander.querySelectorAll("[data-expanded='false']")
          .length
      ) {
        basicDescriptionExpander.querySelector("#poToggleButton a").click();
      }
      const seeMoreLink = document.querySelector("#seeMoreDetailsLink");
      seeMoreLink.onclick = () => {
        const prodDetails = document.querySelector("#prodDetails");
        prodDetails
          .querySelectorAll("a[aria-expanded='false']")
          .forEach((item) => item.click());
      };
      const productDetailsButton = document.createElement("button");
      productDetailsButton.textContent = "Spec";
      productDetailsButton.style.color = "blue";
      productDetailsButton.onclick = () => {
        const prodDetails = document.querySelector("#prodDetails");
        prodDetails
          .querySelectorAll("a[aria-expanded='false']")
          .forEach((item) => item.click());
        prodDetails.scrollIntoView();
        if (!backButton2Added) addBackButton2();
      };
      titleElement.prepend(productDetailsButton);
      titleElement.prepend(button);

      const backButton = document.createElement("button");
      backButton.onclick = () => {
        // button.scrollIntoView();
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        titleElement.focus();
      };
      backButton.classList.add("sanjar-back-button");
      backButton.textContent = "Go back";
      backButton.style.color = "red";
      backButton.style.fontSize = "16px";

      function addBackButton2() {
        const backButton2 = document.createElement("button");
        backButton2.onclick = backButton.onclick;
        backButton2.classList.add("sanjar-back-button");
        backButton2.textContent = "Go back";
        backButton2.style.color = "red";
        backButton2.style.fontSize = "16px";
        backButton2.style.marginLeft = "50%";
        document.querySelector("#keepaContainer").prepend(backButton2);
        backButton2Added = true;
      }
      // document.querySelector("#product-summary").prepend(backButton);
      document
        .querySelector(
          "#reviewsMedley > div > div.a-fixed-left-grid-col.a-col-right",
        )
        .prepend(backButton);
      // Your code here...
    }
    function convertCurrency(country = "in", params = {}) {
      debugger;
      const {
        defaultCountry = "in",
        countryCurrencyMap = { sa: 23.25, ae: 22.86 },
      } = params;
      if (country === defaultCountry) return;
      const intoINR = countryCurrencyMap[country];
      document.querySelectorAll(".a-price-whole").forEach((ele) => {
        ele.textContent =
          Math.floor((+ele.textContent.replaceAll(",", "") * intoINR) / 1000) +
          "k";
      });
    }
    async function getReturnPolicies({ limit = Infinity } = {}) {
      const listing = Array.from(
        document.querySelectorAll("[data-cy='title-recipe'] a[href*='/']"),
      );

      // Create a hidden container if it doesn't already exist
      let hiddenContainer = document.querySelector("#hiddenContainer");
      if (!hiddenContainer) {
        hiddenContainer = document.createElement("div");
        hiddenContainer.setAttribute("id", "hiddenContainer");
        hiddenContainer.style.display = "none"; // Ensure it's not rendered
        document.body.appendChild(hiddenContainer);
      }

      await Promise.all(
        listing.slice(0, limit).map(async (item, i) => {
          const itemLink = new URL(
            item.getAttribute("href"),
            window.location.origin,
          ).href;
          const itemPage = await (await fetch(itemLink)).text();
          await window.waitForMilliseconds(100);

          // Add the fetched content to the hidden container
          const offscreenNewDiv = document.createElement("div");
          offscreenNewDiv.innerHTML = itemPage;
          hiddenContainer.appendChild(offscreenNewDiv);

          // Query and extract the relevant section
          const relevantContent = offscreenNewDiv.querySelector(
            ".a-carousel-has-buttons:has([data-name='FREE_DELIVERY'])",
          );
          if (relevantContent) {
            const newDiv = document.createElement("div");
            newDiv.innerHTML = relevantContent.innerHTML;

            // Remove useless icons
            newDiv
              .querySelectorAll(".a-manually-loaded")
              .forEach((uselessIcon) => uselessIcon.remove());

            // Append the filtered content to the actual item
            item.appendChild(newDiv);
          }

          // Clean up the temporary content in the hidden container
          hiddenContainer.removeChild(offscreenNewDiv);
        }),
      );
    }

    const IN_LISTING = !!document.querySelector("[id*='refinements']");
    window.attachToSanjarWindow(getReturnPolicies, { callOnce: IN_LISTING });
    window.attachToSanjarWindow(addReviewAndInfo, { callOnce: !IN_LISTING });
    window.attachToSanjarWindow(
      convertCurrency,
      window.location.host.split(".").at(-1),
    );
  }

  const interval = setInterval(() => {
    if (!window.showNotification) return;
    window.clearInterval(interval);
    main();
  }, 500);
})();
