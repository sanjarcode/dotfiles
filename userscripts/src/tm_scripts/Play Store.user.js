// ==UserScript==
// @name         Play Store
// @namespace    http://tampermonkey.net/
// @version      2025-08-29
// @description  try to take over the world!
// @author       You
// @match        https://play.google.com/store/apps/details*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const CSJ_UTILS = {
        controlPlusSomeKeyOnSubmit(givenKey, actionCallback) {

            document.addEventListener("keydown", function (event) {
                if ((event.ctrlKey || event.metaKey) && event.key === givenKey) {
                    actionCallback(event)
                }
            })
        },
        controlPlusShiftPlusSomeKeyOnSubmit(givenKey, actionCallback) {
            document.addEventListener("keydown", function (event) {
                if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === givenKey) {
                    actionCallback(event)
                }
            })
        },
        showNotification(message = "", timeout = 1500) {
            const notification = document.createElement("div");
            notification.id = "sanjar";
            notification.style.position = "fixed";
            notification.style.top = "10px";
            notification.style.right = "10px";
            notification.style.padding = "10px";
            notification.style.background = "rgba(0, 0, 0, 0.8)";
            notification.style.color = "white";
            notification.style.borderRadius = "5px";
            notification.style.zIndex = "9999";
            notification.style.fontSize = "18px";
            notification.textContent = message;
            notification.style.border = "3px solid skyblue";
            document.body.appendChild(notification);
            console.log("Notification attached successfully", {
                message: message,
                timeout: timeout
            });
            if (timeout < 0) return;
            setTimeout(() => {
                try {
                    document.body.removeChild(notification);
                    console.log("Notification removed successfully", {
                        message: message,
                        timeout: timeout
                    })
                } catch (error) {
                    console.error("Error removing notification:", {
                        error: error,
                        message: message,
                        timeout: timeout
                    })
                }
            }, timeout)
        }
    };
    const AI_MODE_TOGGLE_KEY = "ai-mode-sanjar";


    function copyAppId() {
        setTimeout(() => {
            const appId = new URLSearchParams(window.location.search).get("id");
            window.copyToClipboard(appId);
        }, 200);
    }

    const featuresToRun = [copyAppId];
    featuresToRun.forEach(f => f());
})();