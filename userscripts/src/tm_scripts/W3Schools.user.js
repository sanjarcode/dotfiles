// ==UserScript==
// @name         W3Schools
// @namespace    http://tampermonkey.net/
// @version      2024-11-10
// @description  try to take over the world!
// @author       You
// @match        https://www.w3schools.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=w3schools.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  window.attachGoToButton("#w3-exerciseform", "h1", "exercises"); // div:has(> #mainLeaderboard)

  async function correctSubmitClosePage() {
    if (!window.location.href.includes("exercise.asp")) return;

    const answerButton = document.querySelector("#answerbutton");
    answerButton.addEventListener("click", async () => {
      // check if its correct
      await window.waitForMilliseconds(0);

      if (!answerButton.innerText.includes("Try")) {
        await window.showNotification("Success, closing tab....", 100);
        window.close();
      }
    });
  }
  correctSubmitClosePage();
  // Your code here...
})();
