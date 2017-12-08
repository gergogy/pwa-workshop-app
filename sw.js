importScripts('workbox-sw.prod.v2.1.2.js');

const workboxSW = new WorkboxSW({
  skipWaiting: true,
  clientsClaim: true
});
workboxSW.precache([
  {
    "url": "static/images/android-icon-144x144.png",
    "revision": "60da4ff33ced1870609711a79c3c09b4"
  },
  {
    "url": "static/images/android-icon-192x192.png",
    "revision": "3672b87266e795e88ceeaa344527bf95"
  },
  {
    "url": "static/images/android-icon-36x36.png",
    "revision": "ecdadea1526a69b1273f57f762886d4a"
  },
  {
    "url": "static/images/android-icon-48x48.png",
    "revision": "bba16fa79c5132926088e11d45d09683"
  },
  {
    "url": "static/images/android-icon-72x72.png",
    "revision": "532c7d84e004d59784666609943d8a26"
  },
  {
    "url": "static/images/android-icon-96x96.png",
    "revision": "92f15ec258c6612789584cce6495ae9a"
  },
  {
    "url": "static/images/apple-icon-114x114.png",
    "revision": "12d918d7c14786df63012439bc43f77c"
  },
  {
    "url": "static/images/apple-icon-120x120.png",
    "revision": "4936cbf4f6649f7c15ac979b62baa4ba"
  },
  {
    "url": "static/images/apple-icon-144x144.png",
    "revision": "60da4ff33ced1870609711a79c3c09b4"
  },
  {
    "url": "static/images/apple-icon-152x152.png",
    "revision": "37fa2ee5838e66b60e467e0aa4674511"
  },
  {
    "url": "static/images/apple-icon-180x180.png",
    "revision": "64a5eb46048c67a7cb005302a43fe49c"
  },
  {
    "url": "static/images/apple-icon-57x57.png",
    "revision": "05e2cf28095200df44846d498d4de161"
  },
  {
    "url": "static/images/apple-icon-60x60.png",
    "revision": "d7dc0dc8a32d5598a1e93d8201a09e8d"
  },
  {
    "url": "static/images/apple-icon-72x72.png",
    "revision": "532c7d84e004d59784666609943d8a26"
  },
  {
    "url": "static/images/apple-icon-76x76.png",
    "revision": "33197a19cf84b55c38303b1b07cd62e7"
  },
  {
    "url": "static/images/apple-icon-precomposed.png",
    "revision": "029da81f4b03071dcfc252e136a194a0"
  },
  {
    "url": "static/images/apple-icon.png",
    "revision": "029da81f4b03071dcfc252e136a194a0"
  },
  {
    "url": "static/images/favicon-16x16.png",
    "revision": "577732806b885620b6d9610bcfabf193"
  },
  {
    "url": "static/images/favicon-32x32.png",
    "revision": "d26bf8698ffc3176dc48ac31fca9d7b6"
  },
  {
    "url": "static/images/favicon-96x96.png",
    "revision": "92f15ec258c6612789584cce6495ae9a"
  },
  {
    "url": "static/images/favicon.ico",
    "revision": "469c0b6ee447dc27193997d511b94905"
  },
  {
    "url": "static/images/ms-icon-144x144.png",
    "revision": "60da4ff33ced1870609711a79c3c09b4"
  },
  {
    "url": "static/images/ms-icon-150x150.png",
    "revision": "f14a7805cc85d3494c035a826c58412d"
  },
  {
    "url": "static/images/ms-icon-310x310.png",
    "revision": "4972c6f733b8a4cdebfe1126f5592e4c"
  },
  {
    "url": "static/images/ms-icon-70x70.png",
    "revision": "a0315e0333277d6e930695da1d79028a"
  },
  {
    "url": "/index.html",
    "revision": "e255e6bd81d999aed76a5971287abd29"
  },
  {
    "url": "manifest.json",
    "revision": "13d892b9f458b6703970ddec8ac67a9e"
  }
]);

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