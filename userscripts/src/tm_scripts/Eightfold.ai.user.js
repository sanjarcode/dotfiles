// ==UserScript==
// @name         Eightfold.ai
// @namespace    http://tampermonkey.net/
// @version      2026-03-18
// @description  try to take over the world!
// @author       You
// @match        https://*.eightfold.ai/careers*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eightfold.ai
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    async function msw(delayMs = 500) {
        await window.importHelper(`
        import { FetchInterceptor } from 'https://esm.sh/@mswjs/interceptors/fetch';
        window.FetchInterceptor = FetchInterceptor;
`);

        const interceptor = new window.FetchInterceptor()

        interceptor.on('request', ({ request }) => {
            console.log({ request });
            if (request.url.includes('/api/users')) {
                console.log('users request')
            }
        });

        interceptor.on('response', ({ response, request }) => {
            console.log({ response });
            if (request.url.includes('/api/users')) {
                console.log('users response')
            }
        });

        interceptor.apply();
    }

    async function grecept() {
        await window.importHelper(`
        import * as fetchIntercept from 'https://esm.sh/fetch-intercept';
        window.fetchIntercept = fetchIntercept;
`);

        const unregister = window.fetchIntercept.register({
            request: function (url, config) {
                const modifiedUrl = `https://jsonplaceholder.typicode.com/todos/2`;
                return [modifiedUrl, config];
            },

            requestError: function (error) {
                return Promise.reject(error);
            },

            response: function (response) {
                const clonedResponse = response.clone();
                const json = () =>
                clonedResponse
                .json()
                .then((data) => ({ ...data, title: `Intercepted: ${data.title}` }));

                response.json = json;
                return response;
            },

            responseError: function (error) {
                return Promise.reject(error);
            },
        });
    }

    msw();
    grecept();


    // Your code here...
})();