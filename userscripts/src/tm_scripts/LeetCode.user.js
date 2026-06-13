// ==UserScript==
// @name         LeetCode
// @namespace    http://tampermonkey.net/
// @version      2024-12-09
// @description  try to take over the world!
// @author       You
// @match        https://leetcode.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  function main() {
    if (window.location.href.includes("/problems/")) {
      addButtons();
      addEditorialPageLink();
    }

    if (window.location.href.includes("/editorial/")) {
      addEditorialSectionLinks();
    }

    function addButtons() {
      const IS_DIFFICULTY_HIDDEN_VARIABLE = `--isDifficultyHidden`;
      function setStyles(isSwitch = false) {
        const existingValue = localStorage.getItem(IS_DIFFICULTY_HIDDEN_VARIABLE) || "initial";
        const newValue = isSwitch ? (existingValue == "initial" ? "none" : "initial") : (existingValue);
        localStorage.setItem(IS_DIFFICULTY_HIDDEN_VARIABLE, newValue);
        const root = document.documentElement; // Get the root element (html)

        // Set a CSS variable
        root.style.setProperty(IS_DIFFICULTY_HIDDEN_VARIABLE, localStorage.getItem(IS_DIFFICULTY_HIDDEN_VARIABLE));
      }

      setStyles(false);
      window.addButton({
        label: "Toggle difficulty",
        style:
          "border: 1px solid chocolate; padding: 4px; border-radius: 4px; margin-left: auto; margin-right: 4px; background-color: gray;",
        selector: "*[data-track-load='description_content']",
        onClick: () => {
          setStyles(true)
        },
      });

      window.addButton({
        label: "Copy problem ❓",
        style:
          "border: 1px solid red; padding: 4px; border-radius: 4px; margin-left: auto; margin-right: 4px; background-color: gray;",
        selector: "*[data-track-load='description_content']",
        onClick: () => {
          const problemDescription = document.querySelector(
            "*[data-track-load='description_content']"
          )?.textContent;
          const problemCopyText = `# Problem\n\n${problemDescription}`;

          window.copyToClipboard(problemCopyText, "Problem copied!");
        },
      });

      window.addButton({
        label: "Copy code 🧑🏼‍💻",
        style:
          "border: 1px solid green; padding: 4px; border-radius: 4px; margin-left: auto; margin-right: 4px; background-color: gray;",
        selector: "*[data-track-load='description_content']",
        onClick: () => {
          const codeSolution = Array.from(
            document.querySelectorAll("[role='code'] .view-line")
          )
            .map((lineNode) => lineNode?.textContent)
            .join("\n");
          const codeCopyText = `# Solution \n\n${codeSolution}`;

          window.copyToClipboard(codeCopyText, "Solution copied!");
        },
      });

      window.addButton({
        label: "Copy aug code (❓+🧑🏼‍💻)",
        style:
          "border: 1px solid yellow; padding: 4px; border-radius: 4px; margin-left: auto; margin-right: 4px; background-color: gray;",
        selector: "*[data-track-load='description_content']",
        onClick: () => {
          const problemDescription = document.querySelector(
            "*[data-track-load='description_content']"
          )?.textContent;
          const problemCopyText = `# Problem\n\n${problemDescription}`;

          const codeSolution = Array.from(
            document.querySelectorAll("[role='code'] .view-line")
          )
            .map((lineNode) => lineNode?.textContent)
            .join("\n");
          const codeCopyText = `# Solution \n\n${codeSolution}`;

          window.copyToClipboard(
            [problemCopyText, codeCopyText].join("\n\n---\n\n") + "\n---\n",
            "Both copied"
          );
        },
      });
      window.addButton({
        label: "Copy aug approach (❓+💡)",
        style:
          "border: 1px solid yellow; padding: 4px; border-radius: 4px; margin-left: auto; margin-right: 4px; background-color: gray;",
        selector: "*[data-track-load='description_content']",
        onClick: () => {
          const problemDescription = document.querySelector(
            ".EasyMDEContainer"
          )?.textContent;
          const problemCopyText = `# Problem\n\n${problemDescription}`;

          const codeSolution = Array.from(
            document.querySelectorAll("[role='code'] .view-line")
          )
            .map((lineNode) => lineNode?.textContent)
            .join("\n");
          const approachCopyText = `# Approach (I'm considering) \n\n${codeSolution}`;

          window.copyToClipboard(
            [problemCopyText, approachCopyText].join("\n\n---\n\n") + "\n---\n",
            "Both copied"
          );
        },
      });
    }

    function setupAlarmClockClickOnFocus() {
      const editor = document.querySelector(".monaco-editor");
      if (!editor) return; // Exit if no editor is found

      const onFocus = () => {
        const alarmClockElement = document.querySelector(
          '[data-icon="alarm-clock"]'
        );
        if (alarmClockElement) {
          alarmClockElement.click(); // Click the alarm clock element
        }
        editor.removeEventListener("focus", onFocus); // Deregister after first focus
      };

      editor.addEventListener("focus", onFocus, { once: true }); // Use once: true for auto-deregistration
    }
    setupAlarmClockClickOnFocus();

    async function addEditorialSectionLinks() {
      await window.wait(2000);
      const solutionLinks = Array.from(document.querySelectorAll(`[class*="group/heading"][id*='approach']`)).map(item => `<a href="#${item.id}">${item.textContent}</a>`).join("<br />");
      document.querySelector("#solution").innerHTML += "<br />" + solutionLinks;
    }

    function addEditorialPageLink() {
      const div = document.querySelector(`div:has(> * > * > [data-icon="lightbulb"])`);
      const editorialLink = structuredClone(window.location.href).replace("description", "editorial");
      div.innerHTML += `<a href="${editorialLink}" target="_blank" style="color: red; text-decoration: underline;">Editorial</a>`;
    }
  }

  const interval = setInterval(() => {
    if (!window.showNotification) return;
    window.clearInterval(interval);
    main();
  }, 500);

  // Your code here...
})();
