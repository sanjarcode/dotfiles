// ==UserScript==
// @name         Utils
// @namespace    http://tampermonkey.net/
// @version      2024-11-01
// @description  Try to take over the world!
// @author       You
// @match        *://*/*
// @match        *:///*/*
// @grant        none
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://gist.githubusercontent.com/sanjarcode/cf8210ee6c7f741460e91109daa2ba2e/raw/7bb80d9668790bae4e96a40e45b8cb6b295b8516/externalUtil.js
// @noframes
// @run-at document-start
// ==/UserScript==

(function () {
  "use strict";
  // highest precedence (runs early on)

  function attachToSanjarWindow(
    f,
    { callOnce = false, alias = "", keepOriginal = false } = {},
  ) {
    // wraps functions in try catch
    const safeF = (...args) => {
      try {
        return f(...args);
      } catch (e) {
        console.log(e);
      }
    };

    try {
      const name = alias || f.name;
      // check if current website already has it.
      // but also, make attaching idempotent, so if we ourselves have attached previously let it happen again.
      // if (!!window[name] && window[name] != f) {
      //     if (f.name === 'copyToClipboard') {
      //         // some issue with this
      //         window.copyToClipboard = (...args) => {
      //             window.showNotification("Pasted to console");
      //             console.log(...args)
      //         };
      //     }

      //     throw new Error("Attaching util failed for", f);
      // }
      window[alias || f.name] = safeF;
      if (keepOriginal) {
        window[f.name] = safeF;
      }

      if (callOnce) {
        if (f == isSiteLoaded)
          isSiteLoaded(); // run itself.
        else isSiteLoaded(safeF); // wait and run when relevant
      }
    } catch (e) {
      console.log(e);
    }
  }
  window.attachToSanjarWindow = attachToSanjarWindow;
  async function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async function sleep(...args) {
    return wait(...args);
  }
  async function showNotification(
    message = "",
    timeout = 1500,
    { loader = false, position = "br" } = {},
  ) {
    // create the nofication UI node
    const notification = document.createElement("div");
    notification.id = "sanjar";
    notification.style.position = "fixed";

    switch (position) {
      case "br":
        notification.style.bottom = "10px";
        notification.style.right = "10px";
        break;
      case "tl":
        notification.style.top = "10px";
        notification.style.left = "10px";
        break;
      case "tr":
        notification.style.top = "10px";
        notification.style.right = "10px";
        break;

      case "bl":
        notification.style.bottom = "10px";
        notification.style.left = "10px";
        break;

      default:
        break;
    }

    notification.style.padding = "10px";
    notification.style.background = "rgba(0, 0, 0, 0.8)";
    notification.style.color = "white";
    notification.style.borderRadius = "5px";
    notification.style.zIndex = "9999";
    notification.style.fontSize = "18px"; // Increase font size
    notification.textContent = message;
    console.log(message);
    notification.style.border = "3px solid skyblue";

    if (loader) {
      notification.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><radialGradient id="a8" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)"><stop offset="0" stop-color="#FF156D"></stop><stop offset=".3" stop-color="#FF156D" stop-opacity=".9"></stop><stop offset=".6" stop-color="#FF156D" stop-opacity=".6"></stop><stop offset=".8" stop-color="#FF156D" stop-opacity=".3"></stop><stop offset="1" stop-color="#FF156D" stop-opacity="0"></stop></radialGradient><circle transform-origin="center" fill="none" stroke="url(#a8)" stroke-width="15" stroke-linecap="round" stroke-dasharray="200 1000" stroke-dashoffset="0" cx="100" cy="100" r="70"><animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="2" values="360;0" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite"></animateTransform></circle><circle transform-origin="center" fill="none" opacity=".2" stroke="#FF156D" stroke-width="15" stroke-linecap="round" cx="100" cy="100" r="70"></circle></svg>`;
    }

    // attach notification node to page
    document.body.appendChild(notification);

    // remove after timeout
    // but let it be if timeout is negative
    if (timeout < 0) return;

    await wait(timeout);
    document.body.removeChild(notification);
    // console.log("Notification removed successfully", { message, timeout });
  }
  async function copyToClipboard(
    variable,
    message = (mainText) => `${mainText} copied!`,
  ) {
    let valueToCopy;

    // If it's a string, copy it without quotes
    if (typeof variable === "string") {
      valueToCopy = variable;
    }
    // If it's a function, stringify it as code
    else if (typeof variable === "function") {
      valueToCopy = variable.toString();
    }
    // If it's an object or array, stringify it
    else {
      valueToCopy = JSON.stringify(variable);
    }

    try {
      await navigator.clipboard.writeText(valueToCopy);
      const finalMessage =
        typeof message === typeof "" ? message : message(valueToCopy);

      await window.showNotification(finalMessage);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }

  function handlePhoneLinks() {
    // Event delegation proxy for all anchor tags that shows alert but allows bubbling
    async function interceptor(event) {
      const target =
        event.target.closest("a[data-phone-number]") ||
        event.target.closest('a[href*="tel:"]');

      if (!target) return;

      event.preventDefault();

      // Show alert with link information
      const phoneNumber =
        target.getAttribute("data-phone-number") ||
        target.getAttribute("href").replaceAll("tel:", "");

      try {
        const resp = await (
          await window.fetch(
            `http://localhost:8321/exec?command=` +
            window.encodeURIComponent(`dial ${phoneNumber}`),
          )
        ).json();
        window.showNotification("Dial succesful ✅ ", phoneNumber);
      } catch (error) {
        window.showNotification(
          "Dial failed ❌. Copied to clipboard!" + phoneNumber + "...",
        );
        try {
          // window.open(`https://wa.me/${phoneNumber}?closeFast=true`);
          // window.open(`https://api.whatsapp.com/send/?phone=${encodeURIComponent(phoneNumber)}&text&type=phone_number&app_absent=0&closeFast=true`);
          window.open(
            `whatsapp://send/?phone=${encodeURIComponent(phoneNumber)}&text&type=phone_number&app_absent=0&closeFast=true`,
          );
        } catch (whatsappError) {
          window.showNotification(
            "WhatsApp failed ❌. Copied to clipboard!" + phoneNumber + "...",
          );
          window.copyToClipboard(phoneNumber);
        }
      }
    }
    document.addEventListener("click", interceptor);
    document.addEventListener("a", interceptor);

    console.log("Interceptor set up");
    handlePhoneLinks.test = () => {
      document.querySelectorAll("a").forEach((item) => {
        item.textContent = "Ammi";
        item.setAttribute("href", "tel:8329363955");
      });

      window.showNotification(
        "TM: Anchor tag proxy installed - will alert on any <a> tag click",
      );
    };
  }

  function getNodeSizes(
    elementOrSelector,
    isComputed = false,
    callback = null,
  ) {
    let container;

    // Determine if the argument is a string (selector) or a DOM element
    if (typeof elementOrSelector === "string") {
      container = document.querySelector(elementOrSelector);
      if (!container) {
        console.error("No element found with the selector:", elementOrSelector);
        return [];
      }
    } else if (elementOrSelector instanceof Element) {
      container = elementOrSelector;
    } else {
      console.error(
        "Invalid argument: must be a selector string or a DOM element.",
      );
      return [];
    }

    // Find all descendant nodes
    const allNodes = container.querySelectorAll("*");

    // Map sizes, styles, and attributes to an array of objects
    const sizes = Array.from(allNodes).map((node) => {
      let width, height;

      if (isComputed) {
        // Use computed styles
        const styles = window.getComputedStyle(node);
        width = parseFloat(styles.width);
        height = parseFloat(styles.height);
      } else {
        // Use bounding rect
        const rect = node.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
      }

      // Create the result object
      const result = {
        width,
        height,
      };

      // Add existing attributes if they exist
      const id = node.getAttribute("id");
      if (id) result.id = id;

      const ariaLabel = node.getAttribute("aria-label");
      if (ariaLabel) result["aria-label"] = ariaLabel;

      const classList = node.classList;
      if (classList.length > 0)
        result.classes = Array.from(classList).join(" ");

      // Add computed styles
      const computedStyles = window.getComputedStyle(node);
      const styles = {};
      for (let i = 0; i < computedStyles.length; i++) {
        const prop = computedStyles[i];
        styles[prop] = computedStyles.getPropertyValue(prop);
      }
      result.styles = styles;

      // Execute the callback if provided
      if (typeof callback === "function") {
        const callbackResult = callback(node);
        if (callbackResult && typeof callbackResult === "object") {
          Object.assign(result, callbackResult);
        }
      }

      return result;
    });

    // Log and return the sizes
    return sizes;
  }

  function addButton({
    parent = null,
    selector = "",
    label = "butttton",
    prepend = true,
    attributes = {},
    onClick = () => { },
    style = "",
  } = {}) {
    const buttonParent = (parent || document).querySelectorAll(selector)[0];
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = typeof label === typeof "" ? label : label();
    button.style.color = "greenyellow";
    button.style.border = "1px solid greenyellow";
    // button.style.borderRadius = "4px";
    // button.style.padding = "4px";
    // button.style.margin = "4px";
    button.style = style;
    button.onclick = onClick;
    for (let attr_key in attributes) {
      button.setAttribute(attr_key, attributes[attr_key]);
    }

    window.addButtonOrderState ||= {};
    const currentButtonRow = window.addButtonOrderState; // current button row of same selector

    if (true || !currentButtonRow[selector]) {
      // first time, add it
      if (prepend) {
        buttonParent.prepend(button);
      } else {
        buttonParent.append(button);
      }
    } else {
      // more buttons? add after (nothing to do with append now)
      currentButtonRow[selector].insertAdjacentElement("afterend", button);
    }
    currentButtonRow[selector] = button;

    return button;
  }

  function attachGoToButton(
    targetViewSelector,
    buttonParentSelector,
    text = "Go to",
    prepend = true,
    afterOnClick = () => { },
  ) {
    const targetView = document.querySelector(targetViewSelector);

    console.assert(targetView, "targetViewSelector is wrong");
    const buttonParent = document.querySelector(buttonParentSelector);
    console.assert(buttonParentSelector, "buttonParentSelector is wrong");

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    button.style.color = "red";

    const backButton = document.createElement("button");
    backButton.type = "button";
    backButton.textContent = "Back";
    backButton.style.color = "green";

    targetView.prepend(backButton);

    if (prepend) {
      buttonParent.prepend(button);
    } else {
      buttonParent.append(button);
    }

    backButton.onclick = () => {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      // button.scrollIntoView();
    };
    button.onclick = () => {
      targetView.scrollIntoView();
      targetView.focus();
      afterOnClick(targetView);
    };
  }

  function attachGoToButton2(
    targetViewSelector,
    buttonParentSelector,
    text = "Go to",
    prepend = true,
    onClick = () => { },
  ) {
    const targetView = document.querySelector(targetViewSelector);

    console.assert(targetView, "targetViewSelector is wrong");
    const buttonParent = document.querySelector(buttonParentSelector);
    console.assert(buttonParentSelector, "buttonParentSelector is wrong");

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    button.style.color = "red";

    const backButton = document.createElement("button");
    backButton.type = "button";
    backButton.textContent = "Back";
    backButton.style.color = "green";

    targetView.prepend(backButton);

    if (prepend) {
      buttonParent.prepend(button);
    } else {
      buttonParent.append(button);
    }

    backButton.onclick = () => {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      // button.scrollIntoView();
    };
    button.onclick = (event) => {
      targetView.scrollIntoView();
      onClick(event, targetView);
    };
  }

  function addScrollProgressBar() {
    // Create the fixed div
    const progressBar = document.createElement("div");
    progressBar.style.position = "fixed";
    progressBar.style.top = "10px";
    progressBar.style.right = "10px";
    progressBar.style.backgroundColor = "black";
    progressBar.style.color = "white";
    progressBar.style.padding = "5px 10px";
    progressBar.style.borderRadius = "5px";
    progressBar.style.zIndex = "1000";
    progressBar.style.fontSize = "14px";
    progressBar.textContent = "0%";

    document.body.appendChild(progressBar);

    // Update scroll progress
    function updateScrollProgress({ granularity = 1 } = {}) {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      let scrollPercentage = Math.round((scrollTop / scrollHeight) * 100);
      scrollPercentage =
        Math.round(scrollPercentage / granularity) * granularity; // Round to nearest 5
      progressBar.textContent = `${scrollPercentage}%`;
    }

    // Attach scroll event
    window.addEventListener("scroll", updateScrollProgress);

    // Initial update
    updateScrollProgress();
  }

  // If u have a CDN link.
  async function loadScriptFromCDN(
    url = "https://cdn.jsdelivr.net/npm/command-pal",
    options = {
      onLoad: function () {
        const c = new CommandPal({
          hotkey: "ctrl+k",
          commands: [
            {
              name: "Send Message",
              shortcut: "ctrl+m",
              handler: () => alert("Send Message"),
            },
            {
              name: "Search Contacts",
              handler: () => alert("Searching contacts..."),
            },
            {
              name: "Goto Profile",
              shortcut: "ctrl+4",
              handler: () => (window.location.hash = "profile"),
            },
          ],
        });
        c.start();
      },
    },
  ) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = url;
      script.async = true;

      script.onload = () => {
        resolve(`Script loaded successfully from ${url}`);
        options.onLoad();
      };
      script.onerror = (error) =>
        reject(`Failed to load script from ${url}: ${error.message}`);

      document.head.appendChild(script);
    });
  }

  /*
   * Make sure all external imports are from esm.sh site.
   * for checking, run https://esm.sh/package-name, if that loads you're good
   */
  // Usage: `await importHelper(); your code;`
  async function importHelper(
    code = `
            import confetti from "https://esm.sh/canvas-confetti";
            window.confetti = confetti;
        `,
  ) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.type = "module";

      // Using a data URL to pass the code as a string
      const blob = new Blob([code], {
        type: "application/javascript",
      });
      const url = URL.createObjectURL(blob);

      script.src = url;
      script.onload = () => {
        console.log("Module script loaded and executed");
        resolve();
      };
      script.onerror = (e) => {
        console.error("Error loading the module:", e);
        reject();
      };

      document.body.appendChild(script);
    });
  }

  // run sync code with difference
  async function setupClickNQueue(delayMs = 500) {
    await importHelper(
      `import pLimit from "https://esm.sh/p-limit"; window.pLimit = pLimit;`,
    );
    const limiter = window.pLimit(1); // one at a time

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    window.q = function queued(fn) {
      return limiter(async () => {
        try {
          return await fn();
        } finally {
          // enforce spacing before next job
          await sleep(delayMs);
        }
      });
    };
  }

  function multiCopyConcatenatePaste() {
    // Array to store multiple selections
    let selections = [];

    // Event listener for clicks to add selection ranges
    document.addEventListener("click", (event) => {
      const selection = window.getSelection();
      if (!selection.rangeCount) return; // Ensure there's a range selected

      const range = selection.getRangeAt(0);
      selections.push(range); // Add the selection range to the array

      // Create a cursor dot (red circle)
      const cursor = document.createElement("span");
      cursor.classList.add("cursor");
      cursor.style.position = "absolute";
      cursor.style.width = "10px";
      cursor.style.height = "10px";
      cursor.style.backgroundColor = "red";
      cursor.style.borderRadius = "50%";
      cursor.style.left = `${event.pageX}px`;
      cursor.style.top = `${event.pageY}px`;
      document.body.appendChild(cursor);

      // Create a green box (finish button) next to the cursor
      const finishBox = document.createElement("div");
      finishBox.style.position = "absolute";
      finishBox.style.backgroundColor = "green";
      finishBox.style.padding = "5px";
      finishBox.style.color = "white";
      finishBox.style.borderRadius = "5px";
      finishBox.style.left = `${event.pageX + 15}px`;
      finishBox.style.top = `${event.pageY - 5}px`;
      finishBox.textContent = "Finish";
      document.body.appendChild(finishBox);

      // Attach event to the finish box to copy the selected text
      finishBox.addEventListener("click", () => {
        let copiedText = selections.map((range) => range.toString()).join("\n");

        // Create a temporary textarea to copy the text
        const textarea = document.createElement("textarea");
        textarea.value = copiedText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);

        // Optional: Alert the user
        alert("Text copied to clipboard!");
      });
    });
  }

  function controlPlusSomeKeyOnSubmit(givenKey, actionCallback) {
    document.addEventListener("keydown", function (event) {
      if ((event.ctrlKey || event.metaKey) && event.key === givenKey) {
        actionCallback(event);
      }
    });
  }

  function controlPlusShiftPlusSomeKeyOnSubmit(givenKey, actionCallback) {
    document.addEventListener("keydown", function (event) {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key === givenKey
      ) {
        actionCallback(event);
      }
    });
  }

  function shiftEnterKeyOnSubmit(actionCallback) {
    document.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && e.shiftKey) {
        actionCallback(e);
      }
    });
  }

  function setUpStrictAssert() {
    console.strictAssert = (condition, ...remargs) => {
      if (!condition) throw new Error("Strict assertion failed", ...remargs);
    };
  }

  /**
   * Function to detect if site has finished loading
   * There are some default ways but not every site follows best practices
   * If it does not, we'll add the criteria here
   * @param {*} criteria
   * @param {*} timeout
   * @param {*} freq
   */
  async function isSiteLoaded(
    f = () => { },
    extraCriteria = () => true,
    timeout = 1000,
    freq = 10,
  ) {
    const defaultCriteria = [() => document.readyState == "complete"]; //
    let timeSpent = 0;
    const interval = setInterval(() => {
      if (timeSpent >= timeout) {
        const message =
          timeSpent >= timeout
            ? "isSiteLoaded check timed out"
            : "Site loaded detected";
        localStorage.removeItem("TM:isSiteLoaded");
        clearInterval(interval);
        f(false);
        return;
      } else if ([...defaultCriteria, extraCriteria].some(Boolean)) {
        clearInterval(interval);
        localStorage.setItem("TM:isSiteLoaded", "true");
        f(true);
        return;
      }
    }, freq);
  }

  function getRawLink(link) {
    if (link.includes("drive.google.com")) {
      const ID = link.split("d/").at(1).split("/").at(0);
      return `https://drive.google.com/uc?id=${ID}`;
    } else {
      console.log("original link returned");
      return link;
    }
  }

  function hideLinks(time = 5 * 60 * 1000) {
    if (document.querySelector("style#link-hider")) return;

    const styleElement = document.createElement("style");
    styleElement.setAttribute("id", "link-hider");

    // Add CSS rules to the element
    styleElement.textContent = `
        a[href] {
            color: unset;
            text-decoration: unset;
        }
        `;
    document.head.appendChild(styleElement);
    console.log("Links hidden for time", time / 1000, "seconds");
    setTimeout(() => {
      styleElement.remove();
    }, time);
  }

  function splitLines(target = document.body) {
    // polymorphic: accept selector string or element
    const ancestor =
      typeof target === "string" ? document.querySelector(target) : target;

    if (!ancestor) {
      console.warn("splitSentencesToNewLines: element not found for", target);
      return;
    }

    const walker = document.createTreeWalker(
      ancestor,
      NodeFilter.SHOW_TEXT,
      null,
    );
    const textNodes = [];

    while (walker.nextNode()) textNodes.push(walker.currentNode);

    for (const node of textNodes) {
      const text = node.textContent;
      if (!text.includes(".")) continue; // only touch nodes that have a period

      const parts = text.split(/(?<=\.)/); // keep the period at end
      const sentences = parts.map((s) => s.trim()).filter(Boolean);

      const frag = document.createDocumentFragment();
      sentences.forEach((s, i) => {
        frag.appendChild(document.createTextNode(s));
        if (i !== sentences.length - 1)
          frag.appendChild(document.createElement("br"));
      });

      node.replaceWith(frag);
    }
  }

  async function type(sentence) {
    const target = document.activeElement;
    if (!target) return;

    let i = 0;

    while (i < sentence.length) {
      const ch = sentence[i++];

      // newline → Enter
      if (ch === "\n") {
        if ("value" in target) {
          const pos = target.selectionStart;
          const v = target.value;
          target.value = v.slice(0, pos) + "\n" + v.slice(pos);
          target.selectionStart = target.selectionEnd = pos + 1;
          target.dispatchEvent(new Event("input", { bubbles: true }));
        } else {
          document.execCommand("insertLineBreak");
        }
        await new Promise((r) => setTimeout(r, 20));
        continue;
      }

      // normal char typing
      if ("value" in target) {
        target.value += ch;
        target.dispatchEvent(new Event("input", { bubbles: true }));
      } else {
        document.execCommand("insertText", false, ch);
      }

      await new Promise((r) => setTimeout(r, 20));
    }
  }

  async function getCityName(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const res = await fetch(url, { headers: { "User-Agent": "Test/1.0" } });
    const data = await res.json();
    return {
      city:
        data.address.county ||
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.suburb ||
        data.display_name,
      data,
    };
  }

  function toggleStudyPauseMode() {
    function toggleTutorialModeSetting(localStorageKey) {
      const currentValue = JSON.parse(
        localStorage.getItem(localStorageKey) || "false",
      );
      const newValue = !currentValue;
      localStorage.setItem(localStorageKey, JSON.stringify(newValue));
      console.log(
        `Tutorial mode is now ${newValue ? "ON" : "OFF"}, localStorage toggled`,
        location.host,
      );
      window.showNotification(`Tutorial mode ${newValue ? "ON" : "OFF"}`, 1e3);
    }

    function windowTabSwitchWatcherSetup(localStorageKey) {
      function toggleVideo(value = null) {
        const videoElements = document.querySelectorAll("video");
        if (!videoElements?.length) throw new Error("No video elements found");
        const mainVideoElement = Array.from(videoElements).find(
          (videoElement) => videoElement.src.includes("blob:https"),
        );
        if (!mainVideoElement) throw new Error("Main video not found");
        switch (value) {
          case "play":
            mainVideoElement.play();
            break;
          case "pause":
            mainVideoElement.pause();
            break;
          default:
            mainVideoElement.getAttribute("paused")
              ? mainVideoElement.play()
              : mainVideoElement.pause();
            break;
        }
      }
      window.addEventListener("focus", function () {
        if (JSON.parse(localStorage.getItem(localStorageKey)))
          toggleVideo("play");
      });
      window.addEventListener("blur", function () {
        if (JSON.parse(localStorage.getItem(localStorageKey)))
          toggleVideo("pause");
      });
    }
    const TUTORIAL_MODE_TOGGLE_KEY = "tutorial-mode-sanjar";
    windowTabSwitchWatcherSetup(TUTORIAL_MODE_TOGGLE_KEY);
    window.controlPlusShiftPlusSomeKeyOnSubmit("u", () =>
      toggleTutorialModeSetting(TUTORIAL_MODE_TOGGLE_KEY),
    );
  }

  function extractForm(
    formEl = document.querySelector("form"),
    useStore = true,
  ) {
    const out = {};

    formEl.querySelectorAll("input, select, textarea").forEach((el) => {
      const id = el.id?.trim();
      const val =
        el.type === "checkbox"
          ? el.checked
          : el.type === "radio"
            ? el.checked
              ? el.value
              : undefined
            : el.value;

      if (val === undefined) return;

      // 1. Save under ID
      if (id) out[id] = val;

      // 2. Save under Label
      const label =
        formEl.querySelector(`label[for="${CSS.escape(id)}"]`) ||
        el.closest("label");

      if (label) {
        const text = label.textContent.trim();
        if (text) out[text] = val;
      }
    });

    if (useStore)
      localStorage.setItem("tm_extracted_form", JSON.stringify(out));
    return out;
  }

  function fillForm(
    formEl = document.querySelector("form"),
    values = null,
    useStore = true,
  ) {
    if (values == null && useStore) {
      values = JSON.parse(localStorage.getItem("tm_extracted_form"));
    }
    if (!formEl || !values) return;

    for (const [key, val] of Object.entries(values)) {
      let el = null;

      // --- 1. Try ID match ---
      el = formEl.querySelector(`#${CSS.escape(key)}`);

      // --- 2. Try label match (exact text) ---
      if (!el) {
        const label = [...formEl.querySelectorAll("label")].find(
          (l) =>
            l.textContent.trim().toLowerCase() === key.trim().toLowerCase(),
        );

        if (label) {
          // case A: label has "for"
          if (label.htmlFor) {
            el = formEl.querySelector(`#${CSS.escape(label.htmlFor)}`);
          } else {
            // case B: control is inside the label
            el = label.querySelector("input, select, textarea");
          }
        }
      }

      if (!el) continue; // both id+label failed → skip safely

      try {
        switch (el.type) {
          case "checkbox":
            el.checked = Boolean(val);
            break;

          case "radio":
            el.checked = el.value == val;
            break;

          default:
            if ("value" in el) el.value = val;
        }
      } catch {
        // silently ignore odd stuff
      }
    }
  }

  function wordCount(
    root = "body", // element or selector
    exclusions = ["footer", "script", "style", "noscript"],
  ) {
    if (typeof root == typeof "") root = document.querySelector(root);

    // Build exclusion selector
    const exclSelector = exclusions.join(",");

    // Clone root (cheap way to remove excluded nodes cleanly)
    const clone = root?.cloneNode?.(true);
    if (!clone) {
      console.error("wordCount failed");
      return;
    }

    // Remove excluded elements
    clone.querySelectorAll(exclSelector).forEach((el) => el.remove());

    // Remove elements that are not visible
    const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        // Skip empty/whitespace
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;

        // Check visibility
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_ACCEPT;

        const style = window.getComputedStyle(parent);
        if (style.display === "none" || style.visibility === "hidden") {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      },
    });

    let text = "";
    let n;
    while ((n = walker.nextNode())) text += " " + n.nodeValue;

    return text.trim().split(/\s+/).filter(Boolean).length;
  }

  function setupEmojiAnnotator() {
    class EmojiAnnotator {
      constructor({ logger_enabled = false } = {}) {
        this.seg = new Intl.Segmenter("en", { granularity: "grapheme" });
        this.emojiRegex = /[\p{Emoji_Presentation}\p{Emoji}]/u;
        this.boundInputHandler = this.inputHandler.bind(this);
        this.logger_enabled = logger_enabled;
      }

      /** -------- Helpers -------- */

      isSingleEmoji(text) {
        const trimmed = text.trim();
        if (!trimmed) return null;

        const clusters = [...this.seg.segment(trimmed)].map((s) => s.segment);
        if (clusters.length !== 1) return null;

        const cluster = clusters[0];
        return this.emojiRegex.test(cluster) ? cluster : null;
      }

      annotateNode(node) {
        if (!node || node.children.length > 0) return null;

        const emoji = this.isSingleEmoji(node.textContent || "");
        if (emoji) {
          node.setAttribute("_emoji", emoji);
          return emoji;
        } else {
          node.removeAttribute("_emoji");
          return null;
        }
      }

      /** -------- Whole Page Scan -------- */

      wholePage(root = document.body) {
        const walker = document.createTreeWalker(
          root,
          NodeFilter.SHOW_ELEMENT,
          null,
          false,
        );

        let node,
          count = 0;

        while ((node = walker.nextNode())) {
          const detected = this.annotateNode(node);
          if (detected) count++;
        }

        if (this.logger_enabled) {
          console.log(
            `[EmojiAnnotator] wholePage: annotated ${count} emoji nodes.`,
          );
        }

        return count;
      }

      /** -------- Keystroke Listener -------- */

      inputHandler(e) {
        const el = e.target;
        if (!el) return;

        const emoji = this.annotateNode(el);
        if (emoji && this.logger_enabled) {
          console.log(`[EmojiAnnotator] keystroke detected emoji: ${emoji}`);
        }
      }

      onKeyStroke() {
        document.removeEventListener("input", this.boundInputHandler);
        document.addEventListener("input", this.boundInputHandler);

        if (this.logger_enabled) {
          console.log("[EmojiAnnotator] keystroke listener active.");
        }
      }

      setup() {
        this.wholePage();
        this.onKeyStroke();
      }
    }

    const annotator = new EmojiAnnotator({ logger_enabled: true });
    window.annotator = annotator;
    annotator.setup();
  }

  async function uploadFile(
    selector = "input#resume",
    file_url = "http://localhost:8085/sanjar-afaq-resume.pdf",
  ) {
    const lastRunKey = "resumeUploadLastRun";
    const today = new Date().toISOString().slice(0, 10);
    const runAlways = true;
    if (!runAlways && localStorage.getItem(lastRunKey) === today) {
      console.log("Resume upload already done today, skipping.");
      document.body.style.backgroundColor = "gray";
      return;
    }

    let resumeBlob;
    try {
      const resp = await fetch(file_url);
      if (!resp.ok) throw new Error(`Fetch failed: ${resp.status}`);
      resumeBlob = await resp.blob();
    } catch (err) {
      console.error("Failed to fetch file:", file_url, err);
      // window.alert("Failed to fetch file:", file_url)
      return;
    }

    const startTime = Date.now();
    const timeout = 2000;

    const bodyColor = document.body.style.backgroundColor;
    const interval = setInterval(() => {
      const input = document.querySelector(selector);
      if (!input) {
        if (Date.now() - startTime > timeout) {
          clearInterval(interval);
          console.warn("Polling timed out: upload input not found.");
        }
        return;
      }

      clearInterval(interval);

      try {
        document.body.style.backgroundColor = bodyColor;
        const file = new File([resumeBlob], "sanjar-afaq-resume.pdf", {
          type: "application/pdf",
        });

        const dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;

        input.dispatchEvent(new Event("change", { bubbles: true }));

        localStorage.setItem(lastRunKey, today);
        console.log("Resume injected successfully!");
        window.notify("Resume injected successfully!!");
        console.log("Upload success");
        // window.close();
      } catch (err) {
        console.error("Failed to inject file:", err);
      }
    }, 200);
  }

  function formatRelativeDate(date, locale = "en") {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

    const now = new Date();
    const diffMs = date - now;

    const seconds = Math.round(diffMs / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);
    const weeks = Math.round(days / 7);
    const months = Math.round(days / 30);
    const years = Math.round(days / 365);

    if (Math.abs(seconds) < 60) {
      return rtf.format(seconds, "second");
    }

    if (Math.abs(minutes) < 60) {
      return rtf.format(minutes, "minute");
    }

    if (Math.abs(hours) < 24) {
      return rtf.format(hours, "hour");
    }

    if (Math.abs(days) < 7) {
      return rtf.format(days, "day");
    }

    if (Math.abs(weeks) < 4) {
      return rtf.format(weeks, "week");
    }

    if (Math.abs(months) < 12) {
      return rtf.format(months, "month");
    }

    return rtf.format(years, "year");
  }

  function dateDiff(first, second) {
    return Math.round((first - second) / (1000 * 60 * 60 * 24));
  }
  function ttl() {
    const selectors = JSON.parse(localStorage.getItem("ttl_selectors") || "[]");
    for (let selector of selectors)
      document.querySelectorAll(selector).forEach((item) => item.click());
  }
  function ttl_add(item) {
    localStorage.setItem(
      "ttl_selectors",
      JSON.stringify([
        ...JSON.parse(localStorage.getItem("ttl_selectors") || "[]"),
        item,
      ]),
    );
  }
  function ttl_show() {
    console.log([...JSON.parse(localStorage.getItem("ttl_selectors") || "[]")]);
  }
  function ttl_clear() {
    localStorage.removeItem("ttl_selectors");
  }

  async function flash(element) {
    element.classList.add("tm_flash");
    await wait(1000);
    element.classList.remove("tm_flash");
  }

  async function ai(
    prompt,
    systemPrompt = "",
    params = {},
    // JSON Schema for structured output. Common types:
    //   { type: "boolean" }                          → true / false
    //   { type: "number" }                           → numeric value
    //   { type: "string" }                           → plain string
    //   { type: "string", enum: ["a", "b", "c"] }   → one of a fixed set
    //   { type: "object", properties: { ... } }      → structured object
    //   { type: "array", items: { type: "string" } } → list of values
    schema = { type: "string" },
  ) {
    // Check model availability
    const availability = await LanguageModel.availability({
      expectedInputs: [{ type: "text", languages: ["en"] }],
      expectedOutputs: [{ type: "text", languages: ["en"] }],
    });

    if (availability === "unavailable") {
      throw new Error("Language model is not available on this device.");
    }

    // Build session options
    const sessionOptions = {};

    if (systemPrompt) {
      sessionOptions.initialPrompts = [
        { role: "system", content: systemPrompt },
      ];
    }

    // Apply optional model parameters (Chrome Extensions / Origin Trial only)
    if (params.temperature !== undefined)
      sessionOptions.temperature = params.temperature;
    if (params.topK !== undefined) sessionOptions.topK = params.topK;
    if (params.signal !== undefined) sessionOptions.signal = params.signal;

    const session = await LanguageModel.create(sessionOptions);

    // Build prompt options
    const promptOptions = { responseConstraint: schema };
    if (params.signal !== undefined) promptOptions.signal = params.signal;

    const result = await session.prompt(prompt, promptOptions);
    session.destroy();
    return JSON.parse(result);
  }

  async function aidemo() {
    // Basic usage
    const reply = await ai("What is the capital of France?");

    // With a system prompt
    const reply2 = await ai("What is the capital of France?", "You are a concise geography tutor.");

    // With parameters (Chrome Extensions / Origin Trial only)
    const reply3 = await ai(
      "Write a creative story opener.",
      "You are a creative writing assistant.",
      { temperature: 1.5, topK: 8 }
    );

    // With structured JSON output
    const schema = { type: "boolean" };
    const reply4 = await ai(
      "Is this about cooking? 'I grilled some salmon tonight.'",
      "",
      { responseConstraint: schema }
    );
    console.log(JSON.parse(reply)); // true or false
  }

  window.attachToSanjarWindow(wait);
  window.attachToSanjarWindow(flash);
  window.attachToSanjarWindow(sleep);
  window.attachToSanjarWindow(showNotification, {
    alias: "notify",
    keepOriginal: true,
  });
  window.attachToSanjarWindow(copyToClipboard, {
    alias: "c",
    keepOriginal: true,
  });
  window.attachToSanjarWindow(handlePhoneLinks, {
    callOnce: true,
  });
  window.attachToSanjarWindow(getNodeSizes);
  window.attachToSanjarWindow(addButton);
  window.attachToSanjarWindow(attachGoToButton);
  window.attachToSanjarWindow(attachGoToButton2);
  window.attachToSanjarWindow(controlPlusSomeKeyOnSubmit);
  window.attachToSanjarWindow(controlPlusShiftPlusSomeKeyOnSubmit);
  window.attachToSanjarWindow(shiftEnterKeyOnSubmit);
  // window.attachToSanjarWindow(addScrollProgressBar, { callOnce: true });
  window.attachToSanjarWindow(loadScriptFromCDN);
  window.attachToSanjarWindow(importHelper);
  window.attachToSanjarWindow(setUpStrictAssert, {
    callOnce: true,
  });
  window.attachToSanjarWindow(isSiteLoaded, {
    callOnce: true,
  });
  // window.attachToSanjarWindow(multiCopyConcatenatePaste, { callOnce: true });
  window.attachToSanjarWindow(getRawLink);
  window.attachToSanjarWindow(hideLinks);
  window.attachToSanjarWindow(splitLines);
  window.attachToSanjarWindow(type);
  window.attachToSanjarWindow(getCityName);
  window.attachToSanjarWindow(toggleStudyPauseMode, {
    callOnce: true,
  });
  window.attachToSanjarWindow(extractForm);
  window.attachToSanjarWindow(fillForm);
  window.attachToSanjarWindow(setupEmojiAnnotator, { callOnce: true });
  window.attachToSanjarWindow(wordCount, { callOnce: true });
  window.attachToSanjarWindow(uploadFile);
  window.attachToSanjarWindow(ttl);
  window.attachToSanjarWindow(ttl_add);
  window.attachToSanjarWindow(ttl_show);
  window.attachToSanjarWindow(ttl_clear);
  window.attachToSanjarWindow(setupClickNQueue, { callOnce: true });
  window.attachToSanjarWindow(formatRelativeDate);
  window.attachToSanjarWindow(dateDiff);
  window.attachToSanjarWindow(uploadFile);
  window.attachToSanjarWindow(ai);
  window.showNotification("TM: Utils attached", 500);

  // Your code here...
})();
