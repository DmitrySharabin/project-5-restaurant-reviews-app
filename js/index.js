if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js')
        .then(_ => console.log('Service worker successfully registered!'))
        .catch(err => console.log(`Error while registering service worker: ${err}`));
}
