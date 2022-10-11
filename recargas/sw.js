self.importScripts('data/games.js');

// Files to cache
const cacheName = 'js13kPWA-v1';
const appShellFiles = [
    '/',
    'img/bk2.jpg',
    'img/bk3.jpg',
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
    'favicon/android-icon-144x144.png',
    'favicon/android-icon-192x192.png',
    'favicon/android-icon-36x36.png',
    'favicon/android-icon-48x48.png',
    'favicon/android-icon-72x72.png',
    'favicon/android-icon-96x96.png',
    'favicon/apple-icon-114x114.png',
    'favicon/apple-icon-120x120.png',
    'favicon/apple-icon-144x144.png',
    'favicon/apple-icon-152x152.png',
    'favicon/apple-icon-180x180.png',
    'favicon/apple-icon-57x57.png',
    'favicon/apple-icon-60x60.png',
    'favicon/apple-icon-72x72.png',
    'favicon/apple-icon-76x76.png',
    'favicon/apple-icon.png',
    'favicon/apple-icon-precomposed.png',
    'favicon/browserconfig.xml',
    'favicon/favicon-16x16.png',
    'favicon/favicon-32x32.png',
    'favicon/favicon-96x96.png',
    'favicon/favicon.ico',
    'favicon/manifest.json',
    'favicon/ms-icon-144x144.png',
    'favicon/ms-icon-150x150.png',
    'favicon/ms-icon-310x310.png',
    'favicon/ms-icon-70x70.png',
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