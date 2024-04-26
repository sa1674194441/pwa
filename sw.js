const CACHE_NAME = 'v2';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/main.js'
]

self.addEventListener('install', event => {
    event.waitUntil(
        // 缓存文件
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        }).then(() => {
            self.skipWaiting(); // 强制进行激活
        })
    );
});


self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
