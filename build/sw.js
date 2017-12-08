importScripts('workbox-sw.prod.v2.1.2.js');

const workboxSW = new WorkboxSW({
  skipWaiting: true,
  clientsClaim: true
});
workboxSW.precache([]);

//Google Fonts caching
workboxSW.router.registerRoute(/(https:\/\/fonts.googleapis.com\/.*|https:\/\/fonts.gstatic.com\/.*)/,
  workboxSW.strategies.cacheFirst({
    cacheName: 'fonts-googleapis',
    cacheExpiration: {
      maxEntries: 20
    },
    cacheableResponse: {statuses: [0, 200]}
  })
);

//App caching
workboxSW.router.registerRoute(/\/app.js/,
  workboxSW.strategies.staleWhileRevalidate({
    cacheName: 'app-cache',
    cacheExpiration: {
      maxEntries: 10
    },
    cacheableResponse: {statuses: [200]}
  })
);

// API caching
workboxSW.router.registerRoute(/http:\/\/localhost:81\/api\/.*/,
  workboxSW.strategies.networkFirst({
    cacheName: 'api-cache',
    cacheExpiration: {
      maxEntries: 50
    },
    cacheableResponse: {statuses: [200]}
  })
);