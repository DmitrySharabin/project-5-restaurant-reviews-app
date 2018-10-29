// Cache name
const CACHE = 'restaurant-reviews-v1';

addEventListener('install', event => {
    event.waitUntil(async function () {
        // Create cache
        const cache = await caches.open(CACHE);
        // and cache necessary static assets.
        return await cache.addAll([
            'js/dbhelper.js',
            'js/focus-visible.js',
            'js/restaurant_info.js',
            'js/index.js',
            'css/styles.css',
            'data/restaurants.json'
        ]);
    }());
});

// Use best practices from: https://developers.google.com/web/fundamentals/primers/service-workers/high-performance-loading
addEventListener('fetch', event => {
    event.respondWith(async function () {
        // Create promises for both the network response,
        // and a copy of the response that can be used in the cache.
        const response = fetch(event.request);
        const responseClone = response.then(r => r.clone());

        // event.waitUntil() ensures that the service worker is kept alive
        // long enough to complete the cache update.
        event.waitUntil(async function () {
            // Open cache.
            const cache = await caches.open(CACHE);
            // Caching data.
            await cache.put(event.request, await responseClone);
        }());

        // Prefer the cached response, falling back to the fetch response.
        return (await caches.match(event.request)) || response;
    }());
});
