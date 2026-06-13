// ==UserScript==
// @name         ChatGPT timestamper
// @namespace    http://tampermonkey.net/
// @version      2024-12-06
// @description  try to take over the world!
// @author       You
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        unsafeWindow
// @sandbox      JavaScript

// ==/UserScript==

/**
 * // @grant        none
 */
(function () {
  "use strict";

  function main() {
    function mutateFetch({
      routePattern = "",
      preRun = () => {},
      postRun = () => {},
    } = {}) {
      const originalFetch = window.fetch;

      window.fetch = async function (url, options) {
        debugger;
        // Check if the URL matches the given route pattern
        if (
          typeof routePattern === typeof ""
            ? url.includes(routePattern)
            : routePattern(url)
        ) {
          // Run preRun function if defined
          if (typeof preRun === "function") {
            preRun(url, options, originalFetch);
          }

          // Perform the fetch request
          const response = await originalFetch(url, options);

          // Run postRun function if defined
          if (typeof postRun === "function") {
            postRun(response, url, options, originalFetch);
          }

          return response; // Return the original response
        }

        // If route doesn't match, proceed with the original fetch
        return originalFetch(url, options);
      };
    }

    // Example usage:
    mutateFetch({
      routePattern: (url) => {
        const value =
          url.includes("backend-api/conversation") &&
          !url.includes("backend-api/conversation/init") &&
          !url.includes("textdocs");
        console.log({ value, url });
        return value;
      },
      // preRun: async (url, options) => {
      //     // Add any manipulation or logging here before the fetch call
      // },
      postRun: async (response, url, options, originalFetch) => {
        try {
          // 1 - use cloning
          // response = response.clone();
          // 2 - repeat the call.
          if (options.method === "GET") {
            const data = await (await originalFetch(url, options)).json();
            if (data?.conversation_id) {
              const bubblesData = data.mapping;
              const bubblesNodes = document.querySelectorAll(
                "[data-message-id][data-message-author-role]",
              );
              let firstTime, lastTime, totalTime;
              bubblesNodes.forEach((bubbleNode, idx, { length }) => {
                const bubbleId = bubbleNode.getAttribute("data-message-id");
                const currentData = bubblesData[bubbleId];
                if (!currentData?.message?.create_time) return;

                const role = currentData?.message?.author?.role;
                const createTime = new Date(
                  currentData?.message?.create_time * 1000 || "",
                );

                const newDiv = document.createElement("div");
                newDiv.textContent = createTime.toLocaleTimeString();
                bubbleNode.prepend(newDiv);
                newDiv.style.color = "green";
                newDiv.style.marginRight = "auto";
                if (role === "user") newDiv.style.marginLeft = "24px";
                newDiv.style.fontSize = "12px";

                if (!firstTime) {
                  firstTime = createTime;
                }

                if (length === idx + 1) {
                  lastTime = createTime;
                  totalTime = lastTime - firstTime;
                }
              });

              const totalTimeDiv = document.createElement("div");
              function timeDifference(date1, date2) {
                // Get the difference in milliseconds
                const diffMs = Math.abs(date2 - date1);

                // Calculate hours and minutes
                const hours = Math.floor(diffMs / 3600000); // 3600000 ms in an hour
                const minutes = Math.floor((diffMs % 3600000) / 60000); // 60000 ms in a minute

                // Construct the result
                if (hours > 0) {
                  return `${hours} hrs, ${minutes} min`;
                } else {
                  return `${minutes} min`;
                }
              }

              totalTimeDiv.textContent = `${timeDifference(
                lastTime,
                firstTime,
              )} since ${firstTime.toLocaleTimeString()}`; // formatTimeDifference(lastTime, firstTime);
              const switcherNode = document.querySelector(
                "div:has(> [data-testid='share-chat-button'])",
              );
              switcherNode.prepend(totalTimeDiv);
              totalTimeDiv.style.color = "greenyellow";
              totalTimeDiv.style.fontSize = "14px";
            }
          } else if (options.method === "POST") {
            debugger;
            const payload = JSON.parse(options.body);
            const createTime = new Date(
              payload.messages[0].create_time * 1000 || "",
            );
            const bubbleId = payload.messages[0].id;
            const newDiv = document.createElement("div");
            newDiv.textContent = createTime.toLocaleTimeString();

            const bubbleNode = document.querySelector(
              `[data-message-id='${bubbleId}']`,
            );
            bubbleNode.prepend(newDiv);
            newDiv.style.color = "green";
            newDiv.style.marginRight = "auto";
            if (role === "user") newDiv.style.marginLeft = "24px";
            newDiv.style.fontSize = "12px";
          }
        } catch (error) {
          // debugger;
          console.log(error);
        }

        // window.showNotification(url);
        // Add any manipulation or logging here after the fetch call
      },
    });
  }

  function timeStamper() {
    function logURL(requestDetails) {
      console.log(`Loading: ${requestDetails.url}`);
    }

    browser.webRequest.onBeforeRequest.addListener(logURL, {
      urls: [
        "https://chatgpt.com/backend-api/conversation/9130fb8c-e454-4158-9f35-e3d0367c769f",
      ],
    });
  }

  function httpInterceptor() {
    // console.log("GM_info.relaxedCsp: ", GM_info.relaxedCsp);
    // console.log("GM_info.sandboxMode: ", GM_info.sandboxMode)

    const originalFetch = window.fetch;
    const root = unsafeWindow || window;

    root.fetch = function (...args) {
      const url = args[0];
      console.log({ url });
      const options = args[1] || {};

      console.log("Intercepted fetch request:", url, options);

      return originalFetch.apply(this, args).then((response) => {
        // Clone the response, as it can only be read once.
        const clonedResponse = response.clone();

        // Log the response details.
        console.log("Fetch response:", clonedResponse);

        // If you want to log the JSON content, you'll need to clone and read it.
        if (
          clonedResponse.headers.get("Content-Type") &&
          clonedResponse.headers
            .get("Content-Type")
            .includes("application/json")
        ) {
          clonedResponse.json().then((json) => {
            console.log("Fetch response JSON:", json);
          });
        } else {
          clonedResponse.text().then((text) => {
            console.log("Fetch response text:", text);
          });
        }

        return response;
      });
    };
  }

  const interval = setInterval(() => {
    console.log("Ran the internval");
    // if (!window.showNotification) return;
    // return;
    try {
      window.clearInterval(interval);
      httpInterceptor();
      // timeStamper();

      // main();
      console.log("Fine");
    } catch (e) {
      console.log({ e });
    }
  }, 100);
})();
