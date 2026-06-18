// ==UserScript==
// @name         UpWork
// @namespace    http://tampermonkey.net/
// @version      2026-05-08
// @description  try to take over the world!
// @author       You
// @match        https://www.upwork.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=upwork.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  function markRichPeople() {
    document
      .querySelectorAll(`[data-test="formatted-amount"]`)
      .forEach((item) =>
        item.setAttribute("rich", item.textContent.toLowerCase().includes("k")),
      );
  }

  setInterval(markRichPeople, 2 * 1000);

  window.markRichPeople = markRichPeople;

  // Your code here...
})();
