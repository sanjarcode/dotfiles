// ==UserScript==
// @name         Perplexity.ai
// @namespace    http://tampermonkey.net/
// @version      2025-09-12
// @description  try to take over the world!
// @author       You
// @match        https://www.perplexity.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=perplexity.ai
// @grant    GM_getResourceText
// @resource stylebot_data https://drive.google.com/uc?id=1OE_C4lFkOo9yUlryZbEaMjebGjFCVG7q
// ==/UserScript==

(function() {
    'use strict';


    function injectStyle(css) {
        const style = document.createElement("style");
        style.type = "text/css";
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    // Example usage:
    injectStyle(`
  body {
    background-color: #111;
    color: #eee;
  }
  a {
    color: #4da3ff;
  }
`);

    const jsonText = GM_getResourceText('stylebot_data');
    const perplexityStyles = Object.entries(JSON.parse(jsonText)).find(([k, v]) => k.includes("perplexity.ai"))?.[1]?.css;
    injectStyle(perplexityStyles);
    console.log({perplexityStyles});
    // Your code here...
})();