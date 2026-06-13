// ==UserScript==
// @name         Arxiv
// @namespace    http://tampermonkey.net/
// @version      2025-09-24
// @description  try to take over the world!
// @author       You
// @match        https://arxiv.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arxiv.org
// @grant        none
// ==/UserScript==

(async function () {
  "use strict";

  await new Promise((r) => setTimeout(r, 200));
  function arxivChunkLines(node = document.querySelector(".abstract")) {
    if (window.ranChunkLines) return;
    const textNode = node;
    let breakSeen = false;
    let r = Math.random();
    textNode.innerHTML =
      `<ol><li>` + textNode.innerHTML.split(". ").join(".</li><li>") + `</ol>`;

    window.ranChunkLines = true;
  }
  arxivChunkLines();
  // Your code here...
})();
