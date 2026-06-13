// ==UserScript==
// @name         NoBroker
// @namespace    http://tampermonkey.net/
// @version      2024-11-21
// @description  try to take over the world!
// @author       You
// @match        https://www.nobroker.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nobroker.in
// @grant        none
// ==/UserScript==

(async function () {
  "use strict";

  async function main() {
    async function existing() {
      await window.waitForMilliseconds(600);
      if (!document.getElementById("categoryLocation")) {
        try {
          const textBox = document.querySelector("#getDirection");
          window.showNofification("Hello", 200);
          textBox.value = "Volopa";
          await window.waitForMilliseconds(200);
          const dropdownElement = document.querySelector(
            "#autocomplete-dropdown-container > [role='option']"
          );
          dropdownElement.click();
        } catch (e) {
          console.log(e);
          window.showNotification("Something went wrong, prefill failed");
        }
      }

      //
      await window.waitForMilliseconds(1000);

      try {
        const tickerDiv = document.createElement("div");
        tickerDiv.appendChild(
          document.createTextNode(
            window.location.pathname.split("/").at(-2).substring(-6)
          )
        );
        tickerDiv.style.color = "red";
        tickerDiv.style.fontWeight = 700;
        tickerDiv.style.fontSize = "48px";

        document.getElementById("propertyDetails").prepend(tickerDiv);
      } catch (e2) {
        console.log(e2);
      }
      // Your code here...
    }

    async function addDirButton() {
      window.attachGoToButton(
        "#categoryLocation",
        "#property-summary-container",
        "Distance ^",
        true,
        () => {
          document.querySelector("#getDirection").focus();
        }
      );
    }

    await window.waitForMilliseconds(1000);
    window.attachToSanjarWindow(addDirButton, { callOnce: true });
  }

  const interval = setInterval(() => {
    if (!window.showNotification) return;
    window.clearInterval(interval);
    main();
  }, 500);
})();
