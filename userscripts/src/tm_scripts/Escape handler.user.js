// ==UserScript==
// @name         Escape handler
// @namespace    http://tampermonkey.net/
// @version      2025-09-15
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @match        *:///*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=notion.so
// @grant        none
// ==/UserScript==

(function() {
    'use strict';


    function autoClose() { if (Boolean(new URLSearchParams(window.location.search).get("sanjar_close") || window.location.origin == "null")) window.close() };
    autoClose();
    // Your code here...
})();