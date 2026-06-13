// ==UserScript==
// @name         Notion
// @namespace    http://tampermonkey.net/
// @version      2025-10-29
// @description  try to take over the world!
// @author       You
// @match        https://www.notion.so/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=notion.so
// @grant        none
// ==/UserScript==

(function() {
    'use strict';


    function toggleCommentOrder() {
        const commentContainer = document.querySelector(".notion-update-sidebar-tab-comments-comments-scroller > div[role='menu']");
        if (!commentContainer) {
            window.showNotification("Comments not found!");
            return;
        }

        commentContainer.style.display = "flex";
        commentContainer.style.flexDirection = commentContainer.style.flexDirection == "column-reverse" ? "column" : "column-reverse";
        window.showNotification("Comment order toggled!");
    }

    window.toggleCommentOrder = toggleCommentOrder;
    window.controlPlusSomeKeyOnSubmit("u", toggleCommentOrder);

    async function editShortcut() { // doesnt work
        console.log("Ran edit shorctut");
        if (!window.cursorElement) {
            document.addEventListener('mousemove', e => {
                const elem = document.elementFromPoint(e.clientX, e.clientY);
                window.cursorElement = elem.parent;
            });
        }
        try {
            debugger;
            const uiScope = window.cursorElement || document;
            function getOverlappingElements(containerSelector, targetSelector = `[aria-label="Comment actions"] [aria-label="More actions"]`) {
                const container = window.cursorElement || document;
                if (!container) return [];

                const containerRect = container.getBoundingClientRect();
                const targets = document.querySelectorAll(targetSelector);
                console.log({targets});

                return [...targets].filter(el => {
                    const r = el.getBoundingClientRect();
                    const overlap = !(
                        r.right < containerRect.left ||
                        r.left > containerRect.right ||
                        r.bottom < containerRect.top ||
                        r.top > containerRect.bottom
                    );
                    return overlap;
                });
            }
            window.getOverlappingElements = getOverlappingElements;
            console.log({
                uiScope
            });
            const kebabButton = uiScope.querySelector(`[aria-label="Comment actions"] [aria-label="More actions"]`);
            if (!kebabButton) {
                console.log("Kebab button not found!")
                window.showNotification("Kebab button not found!");
                return;
            }
            kebabButton.click();
            await window.waitForMilliseconds(100);
            document.querySelector(`.notion-comment-overflow-menu .pencilLine`).closest("div").click();
        } catch (e) {
            console.log(e);
        }
    }
//     window.editShortcut = editShortcut;

   //  window.controlPlusSomeKeyOnSubmit("e", editShortcut);
    // Your code here...
})();