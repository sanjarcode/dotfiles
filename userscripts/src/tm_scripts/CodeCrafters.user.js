// ==UserScript==
// @name         CodeCrafters
// @namespace    http://tampermonkey.net/
// @version      2024-10-20
// @description  try to take over the world!
// @author       You
// @match        https://app.codecrafters.io/tracks/javascript
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codecrafters.io
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll(".vertical-mask").forEach(ele => ele.remove())
    document.querySelectorAll(".h-60.overflow-hidden").forEach(ele => ele.setAttribute("class", "overflow-auto"))
    document.querySelectorAll("img").forEach(ele => ele.remove())
    // Your code here...
})();