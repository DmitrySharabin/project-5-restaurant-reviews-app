// Cache name
const CACHE = 'restaurant-review-v1';

addEventListener('fetch', event => {
    event.waitUntil(fetchFromCacheOrNet(event.request));
});

async function fetchFromCacheOrNet(request) {
    // Open cache
    const cache = await caches.open(CACHE);

    // Check whether request response is in the cache
    let response = await cache.match(request);
    // If yes, return it
    if (response) return response;
    // otherwise fetch data from net (if it's possible)
    try {
        response = await fetch(request);
    } catch (err) {
        return console.error('There is a problem with Internet connection');
    }
    // cache it
    cache.put(request, response);
    // and return
    return response;
}
