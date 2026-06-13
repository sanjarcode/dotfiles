// ==UserScript==
// @name         ChatGPT Query catcher
// @namespace    http://tampermonkey.net/
// @version      2025-11-09
// @description  try to take over the world!
// @author       You
// @match        https://chatgpt.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  window.isSiteLoaded(() => {
    const url = new URL(window.location.href);
    const hadPrompt = url.searchParams.has("prompt");

    if (hadPrompt) {
      url.searchParams.delete("prompt");

      // Replace URL without reloading the page
      window.history.replaceState({}, "", url.toString());
    }

    if (hadPrompt) {
      const btn = document.querySelector('[aria-label="Send prompt"]');
      if (btn) {
        window.notify("Ran prompt from query param");
        btn.click();
      }
    } else {
      console.log("No prompt found, nothing to do")
    }
  });
})();
