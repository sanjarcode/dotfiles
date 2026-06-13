// ==UserScript==
// @name         MagicBricks
// @namespace    http://tampermonkey.net/
// @version      2024-10-31
// @description  try to take over the world!
// @author       You
// @match        https://www.magicbricks.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=magicbricks.com
// @grant        none
// ==/UserScript==

(async function () {
  async function main() {
    async function oldMBStuff() {
      await window?.waitForMilliseconds?.(600);
      ("use strict");
      function expandInfo() {
        document
          .querySelectorAll(".mb-srp__card__summary__action")
          .forEach((button) => {
            if (!button.parentElement.classList.contains("open")) {
              button.click();
            }
          });
      }

      await window?.waitForMilliseconds?.(1000);
      try {
        const tickerDiv = document.createElement("div");
        tickerDiv.appendChild(
          document.createTextNode(
            window.location.pathname.split("&id=").at(-1).substring(-4),
          ),
        );
        tickerDiv.style.color = "red";
        tickerDiv.style.fontWeight = 700;
        tickerDiv.style.fontSize = "48px";

        document.getElementById("details").prepend(tickerDiv);
      } catch (e2) {
        console.log(e2);
      }

      function sanjarClass() {
        const cardClass = "mb-srp__list";
        document.querySelectorAll(`.${cardClass}`).forEach((divItem) => {
          if (divItem.classList.contains("sanjar-class")) return;
          divItem.classList.add("sanjar-class");
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.checked = localStorage.getItem(divItem.id);
          checkbox.onchange = () => {
            const isChecked = JSON.parse(localStorage.getItem(divItem.id));
            if (isChecked) divItem.classList.add("sanjar-class-closed");
            localStorage.setItem(divItem.id, !isChecked);
          };
          divItem.insertBefore(checkbox, divItem.firstChild);
        });
      }

      setTimeout(() => {
        setInterval(() => {
          expandInfo();
          sanjarClass();
        }, 1000);

        window.showNotification("Tampermonkey Ran", 500);

        window.attachGoToButton2(
          ".mb-ldp__dtls__action",
          ".mb-ldp__dtls__action",
          "Open photos",
          false,
          () => {
            const imageResources = performance
              .getEntriesByType("resource")
              .filter(
                (entry) =>
                  entry.initiatorType === "img" &&
                  entry.name.includes(".staticmb."),
              )
              .map((entry) => entry.name);

            [...new Set(imageResources).keys()]
              .toSorted()
              .forEach((imageUrl) => {
                window.open(imageUrl, "_blank");
                console.log(imageUrl);
              });
          },
        );
      }, 1000);
    }

    async function getReturnPolicies({ limit = Infinity } = {}) {
      const listing = Array.from(document.querySelectorAll(".mb-srp__list"));

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
          const itemLink = JSON.parse(
            item.querySelector('script[type="application/ld+json"]')
              ?.textContent || "{}",
          )["@id"];
          const itemPage = await (await fetch(itemLink)).text();
          await window.waitForMilliseconds(100);

          // Add the fetched content to the hidden container
          const offscreenNewDiv = document.createElement("div");
          offscreenNewDiv.innerHTML = itemPage;
          hiddenContainer.appendChild(offscreenNewDiv);

          // Query and extract the relevant section
          const relevantContent =
            offscreenNewDiv.querySelector("#more-details");

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

    // env
    const IN_LISTING = !!document.querySelector(".mb-srp__list");

    // window.attachToSanjarWindow(oldMBStuff, { callOnce: IN_LISTING });
    window.attachToSanjarWindow(getReturnPolicies, { callOnce: IN_LISTING });
  }

  // const interval = setInterval(
  //     () => {
  //         if (!window.showNotification) return;
  //         window.clearInterval(interval);
  //         main();
  //     }, 500);
})();
