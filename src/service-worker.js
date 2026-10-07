import { precacheAndRoute } from "workbox-precaching";
import {
  registerRoute,
  setCatchHandler,
} from "workbox-routing";
import {
  StaleWhileRevalidate,
  NetworkFirst,
  CacheFirst,
} from "workbox-strategies";
import { CacheableResponse } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";
import { BackgroundSyncPlugin } from "workbox-background-sync";
import { RangeRequestsPlugin } from "workbox-range-requests";

precacheAndRoute([
  ...self.__WB_MANIFEST,
  {
    url: "https://ga.jspm.io/npm:@js-temporal/polyfill@0.4.4/dist/index.esm.js",
    revision: null,
  },
  {
    url: "https://ga.jspm.io/npm:idb-keyval@6.2.1/dist/index.js",
    revision: null,
  },
  {
    url: "https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js",
    revision: null,
  },
  { url: "https://ga.jspm.io/npm:jsbi@4.3.0/dist/jsbi-umd.js", revision: null },
]);

setCatchHandler(({ event, request }) => {
  console.log(event, request);
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// @link https://flaviocopes.com/push-api/
// @link https://web.dev/push-notifications-handling-messages/
self.addEventListener("push", function (event) {
  if (!event.data) {
    console.log("This push event has no data.");
    return;
  }
  if (!self.registration) {
    console.log("Service worker does not control the page");
    return;
  }
  if (!self.registration || !self.registration.pushManager) {
    console.log("Push is not supported");
    return;
  }

  const eventText = event.data.text();
  // Specify default options
  let options = {
    badge: "./badge.png",
    icon: "./badge.png",
    image: "./icon512_maskable.png",
  };
  let title = "";

  // Support both plain text notification and json
  if (eventText.substr(0, 1) === "{") {
    const eventData = JSON.parse(eventText);
    title = eventData.title;

    // Set specific options
    // @link https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification#parameters
    if (eventData.options) {
      options = Object.assign(options, eventData.options);
    }

    // Check expiration if specified
    if (eventData.expires && Date.now() > eventData.expires) {
      console.log("Push notification has expired");
      return;
    }
  } else {
    title = eventText;
  }

  // Warning: this can fail silently if notifications are disabled at system level
  // The promise itself resolve to undefined and is not helpful to see if it has been displayed properly
  const promiseChain = self.registration.showNotification(title, options);

  // With this, the browser will keep the service worker running until the promise you passed in has settled.
  event.waitUntil(promiseChain);
});

registerRoute(
  ({ request }) => request.destination === "audio",
  new CacheFirst({
    cacheName: "audio-cache",
    plugins: [
      new CacheableResponse({
        statuses: [200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 60,
      }),
      new BackgroundSyncPlugin(),
      new RangeRequestsPlugin(),
    ],
  })
);

registerRoute(
  ({ url }) => /oracle.mone.dev\/podsurfer\/$/.test(url.toString()),
  new StaleWhileRevalidate({
    cacheName: "podcast-cache",
    plugins: [
      new CacheableResponse({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 60,
      }),
      {
        cacheDidUpdate: async ({ request, event, cacheName }) => {
          const freshResponse = await caches.match(request, { cacheName });
          const responseJson = await freshResponse.json();
          const client = await self.clients.get(event.clientId);
          if (!client) return;
          client.postMessage({
            type: "PODCAST_CACHE_UPDATE",
            podcasts: responseJson,
          });
        },
      },
    ],
  })
);

registerRoute(
  ({ url }) => /oracle.mone.dev\/podsurfer\/episode/.test(url.toString()),
  new NetworkFirst({
    cacheName: "episode-cache",
    plugins: [
      new CacheableResponse({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 60,
        maxEntries: 60,
      }),
    ],
  })
);

registerRoute(
  ({ url }) => /oracle.mone.dev\/podsurfer\/recent/.test(url.toString()),
  new NetworkFirst({
    cacheName: "recent-cache",
    plugins: [
      new CacheableResponse({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 60,
      }),
    ],
  })
);

registerRoute(
  ({ request }) => {
    console.log(request.destination);
    return request.destination === "image";
  },
  new CacheFirst({
    cacheName: "image-cache",
    plugins: [
      {
        requestWillFetch: async ({ request }) => {
          console.log(`requesting, url: ${request.url}`);
          return new Request(
            `https://oracle.mone.dev/image/?url=${request.url}`,
            { ...request }
          );
        },
      },
      new CacheableResponse({
        headers: {
          "Cross-Origin-Resource-Policy": "cross-origin",
        },
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 60,
      }),
    ],
  })
);
