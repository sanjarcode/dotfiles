// ==UserScript==
// @name         Naukri.com
// @namespace    http://tampermonkey.net/
// @version      2025-10-15
// @description  try to take over the world!
// @author       You
// @match        https://www.naukri.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=naukri.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    window.uploadFile('input#resume', 'http://localhost:8085/sanjar-afaq-resume.pdf');
})();
