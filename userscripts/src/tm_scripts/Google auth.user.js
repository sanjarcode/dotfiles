// ==UserScript==
// @name         Google auth
// @namespace    http://tampermonkey.net/
// @version      2025-11-09
// @description  try to take over the world!
// @author       You
// @match        https://accounts.google.com/o/oauth2/v2/auth/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    try {
        Array.from(document.querySelectorAll(`[data-identifier]`)).find(item => item.textContent.toLowerCase().includes("sanjarcode@gmail.com")).click();
        window.showNotification("Clicked on sanjarcode@gmail.com");
    } catch(e) {
        window.showNotification("Some error");
        console.log({e});
    }

    try {
        if(document.body.textContent.includes("access this info") && document.body.textContent.includes("will allow") && document.querySelector("[data-profile-identifier]").textContent.toLowerCase().includes("sanjarcode@gmail.com")) {
            Array.from(document.querySelectorAll("button")).find(item => item.textContent.toLowerCase().includes("continue")).click();
        }
    } catch(e) {
        window.showNotification("Some error");
        console.log({e});
    }

    // Your code here...
})();