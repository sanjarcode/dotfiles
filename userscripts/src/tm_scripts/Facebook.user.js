// ==UserScript==
// @name         Facebook
// @namespace    http://tampermonkey.net/
// @version      2026-05-16
// @description  try to take over the world!
// @author       You
// @match        https://www.facebook.com
// @match        https://www.facebook.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const FEED_SELECTOR = `[role="feed"]`;


  async function getRelevance(post, USE_AI = false, MINIMUM_RELEVANCE = 3) {
    const NEGATIVE_FILTERS = [
      "female",
      "varthur",
      "sarjapur",
      "aecs",
      "hsr",
      "bellandur",
      "Marathahalli",
      "Thippasandra",
      "Tippasandra"
    ].map((item) => item.toLowerCase()); // must not be there
    const POSITIVE_FILTERS = ["indiranagar", "domlur"]; // must be there

    if (USE_AI) {
      const SYSTEM_PROMPT = "I am a male working professional looking for a flat to rent for price between 16k to 28k INR. I eat non-veg. The relevance score of a property is a number out of 5 (worst being 0 out of 5 and best being 5 out of 5). The property needs to be in Indiranagar or Domlur.";
      const relevanceScore = await window.ai(SYSTEM_PROMPT, "Rate this property: " + post.textContent, {}, { type: "number" });
      return { irrelevant: relevanceScore > MINIMUM_RELEVANCE, score: relevanceScore, ai: USE_AI };
    } else {
      const postText = post.textContent.toLowerCase();
      let isNegative = false;
      for (let negFilter of NEGATIVE_FILTERS) {
        if (postText.toLowerCase().includes(negFilter)) {
          isNegative = true;
          break;
        }
      }

      let isPositive = POSITIVE_FILTERS.length == 0;
      for (let posFilter of POSITIVE_FILTERS) {
        if (postText.toLowerCase().includes(posFilter)) {
          isPositive = true;
          break;
        }
      }

      const isIrrelevant = !isPositive || isNegative;;
      return { irrelevant: isIrrelevant, score: null, ai: USE_AI };
    }

  }

  async function postManual(post) {
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

    const relevanceObject = await getRelevance(post);
    console.log({ relevanceObject });

    if (relevanceObject.irrelevant) {
      post.setAttribute("tm_irrelevant", true);
    }

    // other thing per post
    post.setAttribute("tm_processed", true);
  }

  function processPosts() {
    window.setInterval(() => {
      Array.from(document.querySelector(FEED_SELECTOR).children).forEach(postManual);
    }, 1000);
  }

  window.processPosts = processPosts;
  processPosts();

  // Your code here...
})();
