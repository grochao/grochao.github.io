//self.importScripts('data/games.js');

// Files to cache
const cacheName = 'update-recargas-app-v5';
const appShellFiles = [
    '/',
    'index.html',
    'app.js',
    'css/style-landing.min.css',
    'script/jquery-2.2.4.min.js',
    'script/input.mask.js',
    'script/script.js',
    'fonts/icomoon.eot',
    'fonts/icomoon.svg',
    'fonts/icomoon.ttf',
    'fonts/icomoon.woff',
    'favicons/android-icon-144x144.png',
    'favicons/android-icon-192x192.png',
    'favicons/android-icon-36x36.png',
    'favicons/android-icon-48x48.png',
    'favicons/android-icon-72x72.png',
    'favicons/android-icon-96x96.png',
    'favicons/apple-icon-114x114.png',
    'favicons/apple-icon-120x120.png',
    'favicons/apple-icon-144x144.png',
    'favicons/apple-icon-152x152.png',
    'favicons/apple-icon-180x180.png',
    'favicons/apple-icon-57x57.png',
    'favicons/apple-icon-60x60.png',
    'favicons/apple-icon-72x72.png',
    'favicons/apple-icon-76x76.png',
    'favicons/apple-icon.png',
    'favicons/apple-icon-precomposed.png',
    'favicons/browserconfig.xml',
    'favicons/favicon-16x16.png',
    'favicons/favicon-32x32.png',
    'favicons/favicon-96x96.png',
    'favicons/favicon.ico',
    'favicons/manifest.json',
    'favicons/ms-icon-144x144.png',
    'favicons/ms-icon-150x150.png',
    'favicons/ms-icon-310x310.png',
    'favicons/ms-icon-70x70.png',
    'favicon.ico',
    'js13kPAW.webanifest'
];
/*'
 */
const contentToCache = appShellFiles
    // Installing Service Worker
self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil((async() => {
        const cache = await caches.open(cacheName);
        console.log('[Service Worker] Caching all: app shell and content');
        await cache.addAll(contentToCache);
    })());
});

// Fetching content using Service Worker
self.addEventListener('fetch', (e) => {
    e.respondWith((async() => {

        const r = await caches.match(e.request);
        console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
        if (r) return r;
        const response = await fetch(e.request);
        const cache = await caches.open(cacheName);
        console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        cache.put(e.request, response.clone());
        return response;
    })());
});