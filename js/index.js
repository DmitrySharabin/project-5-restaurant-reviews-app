if ('serviceWorker' in navigator) {
    window.addEventListener('load', _ => {
        navigator.serviceWorker.register('../sw.js');
    });
}
