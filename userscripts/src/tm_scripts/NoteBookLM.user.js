// ==UserScript==
// @name         NoteBookLM
// @namespace    http://tampermonkey.net/
// @version      2025-03-29
// @description  try to take over the world!
// @author       You
// @match        https://notebooklm.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @noframes
// ==/UserScript==

(function () {
  "use strict";

  async function expandAll(
    node,
    selector = ".expand-symbol",
    stoppingThreshold = 1000,
    gap = 100,
  ) {
    const interval = setInterval(() => {
      const buttons = document.querySelectorAll(selector);
      Array.from(buttons).forEach((btn) => btn.click());
      if (!buttons.length) clearInterval(interval);
    }, gap);
  }

  function setupSaveNoteShortcut() {
    window.controlPlusShiftPlusSomeKeyOnSubmit("u", () => {
      const lastNoteButton = Array.from(
        document.querySelectorAll("button[title='Pin this message to a Note']"),
      ).at(-1);

      if (lastNoteButton) {
        lastNoteButton.click();
        window.showNotification("Note saved");
      }
    });
  }

  function getFlashCards() {
    const flashCardNode = document.querySelector("[data-app-data]");
    if (!flashCardNode) {
      window.alert("Open a flashcard, inpsect and try again");
      console.log("Open a flashcard and try again");
    } else {
      window.alert("Copied flashcards as JSON");
      console.log("Copied flashcards as JSON");
      window.copy(
        (
          JSON.parse(flashCardNode.getAttribute("data-app-data"))?.flashcards ??
          []
        )
          .map((item) => `${item.f}|${item.b}`)
          .join("\n"),
      );
    }
  }

  function handleSourceOrder() {
    function setSourceOrder() {
      Array.from(
        Array.from(document.querySelector(".scroll-area-desktop").children),
      )
        .sort((a, b) =>
          a.textContent.localeCompare(b.textContent, undefined, {
            numeric: true,
          }),
        )
        .forEach((item, index) => {
          item.style.order = index;
          console.log(item.textContent);
        });
    }

    const targetSelector = ".scroll-area-desktop";

    // 1) fire once on load
    setSourceOrder();

    // 2) then observe forever
    const obs = new MutationObserver((muts) => {
      for (const m of muts) {
        for (const n of m.addedNodes) {
          if (n.nodeType !== 1) continue;

          if (n.matches(targetSelector)) {
            setSourceOrder(n);
          }

          const found = n.querySelector?.(targetSelector);
          if (found) setSourceOrder(found);
        }
      }
    });

    obs.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  window.expandAll = expandAll;
  window.getFlashCards = getFlashCards;
  window.expandAll();
  setTimeout(handleSourceOrder, 1000);

  setupSaveNoteShortcut();
  // Your code here...
})();
