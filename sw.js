/* Service worker : met l'application en cache (les données viennent du relais, hors SW). */
const CACHE = "pilotage-v11";
const ASSETS = ["./", "./index.html", "./manifest.json", "./icon.svg", "./icon-512.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (url.hostname.includes("script.google.com")) return;   // ne jamais intercepter le relais
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((c) => c || fetch(e.request)));
});
