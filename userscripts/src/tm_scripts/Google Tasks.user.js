// ==UserScript==
// @name         Google Tasks
// @namespace    http://tampermonkey.net/
// @version      2025-08-19
// @description  try to take over the world!
// @author       You
// @match        https://tasks.google.com/tasks/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    function sortByRelevance() {
        const lists = Array.from(document.querySelectorAll("[data-num-completed]"));
        const routineList = lists.findIndex(item => item.querySelector("[data-title]").textContent.startsWith("Routine"));
        const listItems = Array.from(routineList.querySelectorAll("[role='listitem']"));
        listItems.sort((a, b) => {
            const aTime = a.querySelectorAll("[role='listitem']")[0].querySelector("[data-first-date-el]").getAttribute("aria-label").split(", ").at(-1);
            const BTime = b.querySelectorAll("[role='listitem']")[0].querySelector("[data-first-date-el]").getAttribute("aria-label").split(", ").at(-1);
        });


    }
    // Your code here...
})();