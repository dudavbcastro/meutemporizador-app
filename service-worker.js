const CACHE_NOME = "pomodoro-cache-v2";
const ARQUIVOS_PARA_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
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