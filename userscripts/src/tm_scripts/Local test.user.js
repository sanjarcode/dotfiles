// ==UserScript==
// @name         Local test
// @namespace    http://tampermonkey.net/
// @version      2025-07-18
// @description  try to take over the world!
// @author       You
// @match        https://www.sbicard.com/creditcards/app/myaccount/transaction-history-page
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.
// @grant        none
// ==/UserScript==

(async function () {
  "use strict";

  // write a script to convert a <table> component to a CSV
  // pick headers from thead. If it doesnt exist, call the columns A, B, etc

  await new Promise((r) => setTimeout(r(), 1000));
  function clickToSeeAll(next = () => {}) {
    let count = 1;
    const interval = setInterval(() => {
      const loadMoreButton = document.querySelector("#loadMoreTxnhistLinkId");
      if (!loadMoreButton || loadMoreButton.className.includes("hide")) {
        console.log("no more buttons to press", { page: count });
        console.log("running next function");
        clearInterval(interval);
        next();
        return;
      }

      console.log("Load more", { page: count });
      count += 1;
      loadMoreButton.click();
    }, 400);
  }

  function tableToCsv(table, next = () => {}) {
    // pick headers from thead. If it doesnt exist, call the columns A, B, etc
    const headers = table
      .querySelector("thead")
      .querySelector("tr")
      .querySelectorAll("th");
    const rows = table.querySelector("tbody").querySelectorAll("tr");
    const csv = [];
    rows.forEach((row) => {
      if (headers.length != row.querySelectorAll("td").length) return; // flexipay
      csv.push(
        Array.from(row.querySelectorAll("td"))
          .map((cell, index, { length }) =>
            index + 1 === length
              ? cell.textContent.replaceAll(",", "")
              : cell.textContent
          )
          .join(",")
      );
    });
    const headerLine = Array.from(headers)
      .map((header) => header.textContent)
      .join(",");
    next();
    return headerLine + "\n" + csv.reverse().join("\n");
  }

  clickToSeeAll(() => {
    window.copyToClipboard(
      tableToCsv(document.querySelector("#txn-display-table"), () => {
        setTimeout(() => {
          console.log("Scrolling to top");
          window.scrollTo({ top: 0 });
        }, 300);
      })
    );
  });

  // Your code here...
})();
