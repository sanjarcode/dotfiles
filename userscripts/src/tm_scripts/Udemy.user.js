// ==UserScript==
// @name         Udemy
// @namespace    http://tampermonkey.net/
// @version      2024-10-02
// @description  try to take over the world!
// @author       You
// @match        https://www.udemy.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=udemy.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const CSJ_UTILS = {
        controlPlusSomeKeyOnSubmit(givenKey, actionCallback) {
            document.addEventListener("keydown", function(event) {
                if ((event.ctrlKey || event.metaKey) && event.key === givenKey) {
                    actionCallback(event)
                }
            })
        },
        controlPlusShiftPlusSomeKeyOnSubmit(givenKey, actionCallback) {
            document.addEventListener("keydown", function(event) {
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
    const runOnces = [function toggleUdemySideBar() {
        const toggleUdemySideBarAction = () => {
            try {
                theatreModeButton = document.querySelector('*[data-purpose="theatre-mode-toggle-button"]');
                theatreModeButton?.click();
                console.log("Udemy sidebar toggle successful")
            } catch (error) {
                console.log("Sidebar toggle shortcut error");
                console.log(error)
            }
        };
        CSJ_UTILS.controlPlusSomeKeyOnSubmit("b", toggleUdemySideBarAction)
    }, function addTitleToTOTLExtension() {
        function addTitleBox(text = "") {
            let gottenTitle = document.querySelector('[class*="lecture-view--container"]')?.getAttribute("aria-label") || document.querySelector('[class*="video-viewer--title-overlay"]')?.textContent || "title not found";
            let existingVideoTitle = document.querySelector("#sanjarTOTLtitle");
            let panelNotFound;
            const usingExisting = !!existingVideoTitle;
            if (!existingVideoTitle) {
                const sanjarPanels = [...document.querySelectorAll(".stefanvdvis")];
                const sanjarLastPanel = sanjarPanels.at(-1);
                const sanjarVideoTitle = document.createElement("span");
                sanjarVideoTitle.setAttribute("id", "sanjarTOTLtitle");
                sanjarVideoTitle.style.color = "white";
                sanjarVideoTitle.style.fontWeight = "600";
                sanjarVideoTitle.style.fontSize = "18px";
                sanjarLastPanel?.appendChild(sanjarVideoTitle);
                panelNotFound = !sanjarLastPanel;
                existingVideoTitle = sanjarVideoTitle
            }
            existingVideoTitle.textContent = text || gottenTitle;
            console.log("addTitleBox Ran", {
                panelNotFound: panelNotFound,
                existingVideoTitle: existingVideoTitle
            });
            return {
                existingVideoTitle: existingVideoTitle,
                id: "sanjarTOTLtitle",
                existingText: existingVideoTitle.textContent,
                usingExisting: usingExisting,
                extensionFound: !!document.querySelector(".stefanvdvis")
            }
        }

        function updater() {
            addTitleBox();
            const t = setTimeout(() => {
                updater();
                clearTimeout(t)
            }, 1e3)
            }
        updater()
    }, function toggleStudyPauseMode() {
        function toggleTutorialModeSetting(localStorageKey) {
            const currentValue = JSON.parse(localStorage.getItem(localStorageKey) || "false");
            const newValue = !currentValue;
            localStorage.setItem(localStorageKey, JSON.stringify(newValue));
            console.log(`Tutorial mode is now ${newValue?"ON":"OFF"}, localStorage toggled`, location.host);
            CSJ_UTILS.showNotification(`Tutorial mode ${newValue?"ON":"OFF"}`, 1e3)
        }

        function windowTabSwitchWatcherSetup(localStorageKey) {
            function toggleVideo(value = null) {
                const videoElements = document.querySelectorAll("video");
                if (!videoElements?.length) throw new Error("No video elements found");
                const mainVideoElement = Array.from(videoElements).find(videoElement => videoElement.src.includes("blob:https"));
                if (!mainVideoElement) throw new Error("Main video not found");
                switch (value) {
                    case "play":
                        mainVideoElement.play();
                        break;
                    case "pause":
                        mainVideoElement.pause();
                        break;
                    default:
                        mainVideoElement.getAttribute("paused") ? mainVideoElement.play() : mainVideoElement.pause();
                        break
                }
            }
            window.addEventListener("focus", function() {
                if (JSON.parse(localStorage.getItem(localStorageKey))) toggleVideo("play")
            });
            window.addEventListener("blur", function() {
                if (JSON.parse(localStorage.getItem(localStorageKey))) toggleVideo("pause")
            })
        }
        const TUTORIAL_MODE_TOGGLE_KEY = "tutorial-mode-sanjar";
        windowTabSwitchWatcherSetup(TUTORIAL_MODE_TOGGLE_KEY);
        CSJ_UTILS.controlPlusShiftPlusSomeKeyOnSubmit("u", () => toggleTutorialModeSetting(TUTORIAL_MODE_TOGGLE_KEY))
    }];
    runOnces.forEach(f => f());
})();