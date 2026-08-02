const CACHE_NOME = "pomodoro-cache-v4";
const ARQUIVOS_PARA_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png",
    "./alarme.mp3"
];

self.addEventListener("install", function (evento) {
    evento.waitUntil(
        caches.open(CACHE_NOME).then(function (cache) {
            return cache.addAll(ARQUIVOS_PARA_CACHE);
        })
    );
});

self.addEventListener("fetch", function (evento) {
    evento.respondWith(
        caches.match(evento.request).then(function (respostaCache) {
            return respostaCache || fetch(evento.request);
        })
    );
});