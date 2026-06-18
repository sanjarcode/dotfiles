// ==UserScript==
// @name         HelloInterview
// @namespace    http://tampermonkey.net/
// @version      2025-12-04
// @description  try to take over the world!
// @author       You
// @match        https://www.hellointerview.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hellointerview.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  function getCallouts() {
    return (
      Array.from(document.querySelectorAll(".callout")),
      (item) =>
        item
          .getAttribute("class")
          .split(" ")
          .filter((class_) => class_.startsWith("callout-"))
          .map((item) => item.textContent)
    );
  }

  function scrollCallouts() {
    window.position ||= 0;
    const callOuts = Array.from(document.querySelectorAll(".callout"));
    callOuts[window.position].scrollIntoView({ block: "start" });
    window.position += 1;
    window.position %= callOuts.length;
  }

  window.attachToSanjarWindow(getCallouts, { callOnce: true });
  window.attachToSanjarWindow(scrollCallouts);

  // Your code here...
})();
