// Cache name
const CACHE = 'restaurant-reviews-v1';

addEventListener('install', event => {
    event.waitUntil(async function () {
        // Create cache
        const cache = await caches.open(CACHE);
        // and cache necessary static assets.
        await cache.addAll([
            'js/dbhelper.js',
            'js/focus-visible.js',
            'js/restaurant_info.js',
            'js/index.js',
            'css/styles.css',
            'data/restaurants.json'
        ]);
        return skipWaiting();
    }());
});

// Use best practices from:
// https://developers.google.com/web/fundamentals/primers/service-workers/high-performance-loading
// and https://youtu.be/X8EQSy-ajo4
addEventListener('fetch', event => {
    fetchFromCacheOrNet(event);
});

function fetchFromCacheOrNet(event) {
    // Create promises for both the network response,
    // and a copy of the response that can be used in the cache.
    const fetchedVersion = fetch(event.request);
    const fetchedCopy = fetchedVersion.then(response => response.clone());

    const cachedVersion = caches.match(event.request);

    // Respond as fast as it is possible
    event.respondWith(async function () {
        try {
            // response is a promise (out of two) that settles first
            const response = await Promise.race([
                fetchedVersion.catch(_ => cachedVersion), // If fetchedVersion rejects, return cachedVersion
                cachedVersion
            ]);
            // If response is undefined try to fetch data from the net.
            if (!response)
                return await fetchedVersion;
            // Otherwise return response.
            return response;
        } catch (_) {
            // If there is no cached version of the data and
            // fetch from the net is rejected (i.e. there is no internet connection),
            // return custom response.
            return new Response(null, { status: 404 });
        }
   }());

    // Update cached data
    event.waitUntil(async function () {
        try {
            const response = await fetchedCopy;
            // Open cache.
            const cache = await caches.open(CACHE);
            // Caching data.
            return await cache.put(event.request, response);
        } catch (_) {
            console.error('Error updating cached data');
        }
    }());
}
