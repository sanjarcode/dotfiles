// ==UserScript==
// @name         Google Calendar
// @namespace    http://tampermonkey.net/
// @version      2025-10-13
// @description  try to take over the world!
// @author       You
// @match        https://calendar.google.com/calendar/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  function detectEventCard() {
    document.addEventListener("click", async (event) => {
      if (!event.target.parentElement.getAttribute("data-opens-details"))
        return;

      await window.sleep(100);
      if (!!document.querySelector("[data-actions-expanded]")) {
        function buttonOnClick() {
          try {
            const timeText = document.querySelector(
              "[data-text]:has([role='heading']) + div span:last-child",
            ).textContent;

            function timeDiffInMinutes(range) {
              let [startStr, endStr] = range
                .split("–")
                .map((s) => s.trim().toLowerCase());

              // inherit meridian if missing in start
              if (!/[ap]m/.test(startStr)) {
                const meridian = endStr.match(/[ap]m/)[0];
                startStr += meridian;
              }

              const parse = (t) => {
                let [time, meridian] = t
                  .match(/(\d{1,2}:\d{2})(am|pm)/)
                  .slice(1);
                let [hours, minutes] = time.split(":").map(Number);
                if (meridian === "pm" && hours !== 12) hours += 12;
                if (meridian === "am" && hours === 12) hours = 0;
                return hours * 60 + minutes;
              };

              let start = parse(startStr);
              let end = parse(endStr);

              if (end < start) end += 24 * 60; // overnight handling

              return end - start;
            }

            const timeDiff = timeDiffInMinutes(timeText);

            const shortCutsUrl = `shortcuts://run-shortcut?name=Hello&input=${timeDiff}`;
            window.open(shortCutsUrl);
          } catch (e) {
            console.log({ e });
          }
        }

        window.addButton({
          selector: `div:has(> * > * > [aria-label="Edit event"])`,
          label: "Start",
          prepend: true,
          onClick: buttonOnClick,
          style: "margin-right: auto;",
        });
      } else {
        alert("box not found");
      }
    });
  }

  // detectEventCard();
  // Your code here...
})();
