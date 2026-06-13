// ==UserScript==
// @name         Gmail
// @namespace    http://tampermonkey.net/
// @version      2025-09-30
// @description  try to take over the world!
// @author       You
// @match        https://mail.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    function setupUrlChangeObserver(
    callback = (url) => console.log("URL changed to:", url)
    ) {
        let lastUrl = location.href;

        const hookHistoryMethod = (method) => {
            const original = history[method];
            return function (...args) {
                const result = original.apply(this, args);
                window.dispatchEvent(new Event("urlchange"));
                return result;
            };
        };

        history.pushState = hookHistoryMethod("pushState");
        history.replaceState = hookHistoryMethod("replaceState");

        window.addEventListener("popstate", () =>
                                window.dispatchEvent(new Event("urlchange"))
                               );
        window.addEventListener("urlchange", () => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                callback(location.href);
            }
        });
    }

    function hideOlderEmails() {
        Array.from(
            document.querySelectorAll(
                "span[aria-label*='PM'], span[aria-label*='AM']"
            )
        ).forEach((item) => {
            const HIDE_OLDER_THAN = 7;
            const CLASS_TO_BE_ADDED = "sanjar-old-mail";
            const daysDiff = Math.floor(
                Math.abs(new Date() - new Date(item.getAttribute("aria-label"))) /
                (1000 * 60 * 60 * 24)
            );

            // console.log("Reached inside");
            const currentClassList = item.getAttribute("class") || "";
            const row = item.closest('tr[role="row"]');
            const isOldRow =
                  daysDiff > HIDE_OLDER_THAN &&
                  !currentClassList.includes(CLASS_TO_BE_ADDED);
            const isUnread = row.innerHTML.includes("unread")

            // console.log({ isOldRow, daysDiff, HIDE_OLDER_THAN, currentClassList });
            if (isOldRow) {
                // console.log("Reached row", row.textContent);
                row.classList.add(CLASS_TO_BE_ADDED);
            }
        });
    }

    function groupEmails() {
        const groupedEmail = new Map();
        const rows = Array.from(
            document.querySelectorAll(
                "[data-hovercard-id*='.com']"
            )
        );

        rows.forEach((item, index) => {
            const tr = item.closest("tr[role='row']");
            const key = item.getAttribute("data-hovercard-id").split("@").at(-1);
            groupedEmail.set(key, [...groupedEmail.get(key) || [], {nodeContent: tr.innerHTML, index}]);
        });


        if (!window.policyAverted && window.trustedTypes && window.trustedTypes.createPolicy) {
            window.policyAverted = true;
            window.trustedTypes.createPolicy('default', {
                createHTML: (string, sink) => string
            });
        }

        groupedEmail.entries().forEach(([key, rowItems]) => {
            rowItems.forEach((rowItem) => {
                rows[rowItem.index].innerHTML = rowItem.nodeContent;
            }
                            );
        })
    }

    setupUrlChangeObserver(hideOlderEmails);
    setTimeout(() => {
        console.log("Fired once");
        hideOlderEmails();
    }, 1500);

    // Your code here...
})();
