// ==UserScript==
// @name         Wikipedia
// @namespace    http://tampermonkey.net/
// @version      2025-09-16
// @description  try to take over the world!
// @author       You
// @match        https://*.wikipedia.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// ==/UserScript==

(async function () {
    'use strict';
    /*
    await window.waitForMilliseconds(100);
    const tocContents = document.querySelector("#toc ul").innerHTML;
    const mainBody = document.querySelector("#bodyContent");
    const tocToAdd = `<div style="visibility: hidden; height: 100vh;">${tocContents}<div id="added-toc" style="position: sticky; visibility: visible;">${tocContents}</div></div>`;
    mainBody.innerHTML = tocToAdd + mainBody.innerHTML;
    mainBody.setAttribute("style", (mainBody.getAttribute("style") || "") + ` display: flex;`);

    window.hideLinks();*/

    // Save the original attachShadow
    const _attachShadow = Element.prototype.attachShadow;

    // Monkey patch
    Element.prototype.attachShadow = function(init) {
        // Call original
        const shadow = _attachShadow.call(this, init);

        // Fire your hook
        try {
            onShadowCreated(this, shadow, init);
        } catch (err) {
            console.error("Shadow hook error:", err);
        }

        return shadow;
    };

    // Your callback: runs *only for shadow DOM*
    function onShadowCreated(host, shadowRoot, init) {
        console.log("Shadow DOM detected on:", host);
        console.log("Mode:", init.mode); // "open" or "closed"
        console.log("Shadow root:", shadowRoot);

        // If you want to skip closed shadows:
        // if (init.mode === "closed") return;

        // Example: add a marker attribute
        // host.setAttribute("shadow-patched", "");

        // Example: run logic only on specific components
        // if (host.tagName === "MY-COMPONENT") { ... }
    }

})();