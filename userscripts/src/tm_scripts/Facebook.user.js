// ==UserScript==
// @name         Facebook
// @namespace    http://tampermonkey.net/
// @version      2026-05-16
// @description  try to take over the world!
// @author       You
// @match        https://www.facebook.com/groups/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const NEGATIVE_FILTERS = [
    "female",
    "varthur",
    "sarjapur",
    "aecs",
    "hsr",
    "bellandur",
    "Marathahalli",
    "Thippasandra",
    "Tippasandra",
  ].map((item) => item.toLowerCase());

  async function post(post) {
    post.classList.add("tm_flash");
    await window.wait(1000);
    post.classList.remove("tm_flash");

    if (post.getAttribute("tm_processed")) return;

    // expand
    let moreButton = document
      .querySelectorAll("[role='button']")
      .forEach((button) => {
        if (button.textContent.toLowerCase().includes("see more"))
          button.click();
      });

    // match negatives
    const postText = post.textContent.toLowerCase();
    let isNotRelevant = false;
    for (let negFilter of NEGATIVE_FILTERS) {
      if (postText.toLowerCase().includes(negFilter)) {
        isNotRelevant = true;
        post.setAttribute("style", "background-color: red");
        post.setAttribute("tm_irrelevant", true);
        break;
      }
    }

    // other thing per post
    post.setAttribute("tm_processed", true);
  }
  function processPosts() {
    window.setInterval(() => {
      Array.from(document.querySelector(`[role="feed"]`).children).forEach(
        post,
      );
    }, 1000);
  }

  window.processPosts = processPosts;
  processPosts();

  // Your code here...
})();
