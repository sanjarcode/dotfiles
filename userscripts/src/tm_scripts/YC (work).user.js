// ==UserScript==
// @name         YC (work)
// @namespace    http://tampermonkey.net/
// @version      2026-01-30
// @description  try to take over the world!
// @author       You
// @match        https://www.workatastartup.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=workatastartup.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const formatRelativeDate = window.formatRelativeDate;

    function addAgoDate() {
        // Adds created at to jobs
        if (window.location.href.includes("/jobs/")) {
            const datePosted = JSON.parse(document.querySelector(`script[type="application/ld+json"]`).textContent).datePosted;
            document.querySelector(".company-name").innerHTML = document.querySelector(".company-name").innerHTML.split("{").at(0) + ` <span style="color: red;" title="${new Date(datePosted).toDateString().split(" ").slice(1).join(" ")}">{${formatRelativeDate(new Date(datePosted))}}</span>`
        } else {
            console.log("/jobs/ not relevant");
        }

        if (window.location.href.includes("/companies/")) {
            const jobs = JSON.parse(document.querySelector(`[id*='Full'][data-page]`).getAttribute("data-page")).props.rawCompany.jobs;

            document.querySelectorAll(".job-name").forEach((item, idx) => {
                const created_at = jobs[idx].jobs_search.created_at;
                item.innerHTML = item.innerHTML.split("{").at(0) + ` <span style="color: red;" title="${new Date(created_at).toDateString().split(" ").slice(1).join(" ")}">{${formatRelativeDate(new Date(created_at))}}</span>` + ` <span style="color: green; font-size: 12px;">{${formatRelativeDate(new Date(jobs[idx].pretty_updated_at))}}</span>`;
            })
        } else {
            console.log("/companies/ not relevant");
        }
    };

    window.addAgoDate = addAgoDate;
    addAgoDate()
    // Your code here...
})();