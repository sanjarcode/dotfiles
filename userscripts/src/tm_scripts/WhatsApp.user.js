// ==UserScript==
// @name         WhatsApp
// @namespace    http://tampermonkey.net/
// @version      2025-12-08
// @description  try to take over the world!
// @author       You
// @match        https://*.whatsapp.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=whatsapp.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    async function close() {
        if (window.location.search.includes("closeFast")) {
            await window.wait(1000);
            window.close();
        }
    }

    // close();

    // Your code here...
})();