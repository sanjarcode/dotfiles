// ==UserScript==
// @name         Job application
// @namespace    http://tampermonkey.net/
// @version      2025-09-21
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @match        *:///*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trakstar.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function saveForm() {
        document.querySelectorAll("form").forEach(form => {
            form.addEventListener("submit", (e) => {
                e.preventDefault(); // optional, block native submit
                console.log("Form submitted");

                // collect form data
                const fd = new FormData(form);
                const data = {};
                for (const [key, value] of fd.entries()) {
                    data[key] = value;
                }

                console.log("Collected data:", data);
                localStorage.setItem("filledForm", JSON.stringify(data));

                // allow real submission if needed
                // form.submit();
            }, true); // capture = true ensures middleware runs first
        });
    }

    window.saveForm = saveForm;

})();