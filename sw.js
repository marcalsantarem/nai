// Service worker do Nai's Cafe (T-046, decisão 11).
// A versão vem da própria URL: o index.html registra `sw.js?v=<VERSION>` com
// VERSION importada de js/version.js. Cada versão tem o seu cache; os antigos
// são apagados no activate. Troque a versão em js/version.js a cada publicação.

const VERSION = new URL(self.location.href).searchParams.get('v') || 'dev';
const PREFIX = 'nais-cafe-';
const CACHE = PREFIX + VERSION;

// Tudo o que o jogo precisa para abrir sem internet.
// ATUALIZE esta lista ao criar, renomear ou apagar um arquivo do jogo.
// './' é o index.html (start_url); não liste 'index.html' à parte, porque o
// host pode redirecionar /index.html para / e resposta redirecionada não serve
// para navegação.
const FILES = [
  './',
  'manifest.webmanifest',
  'css/tokens.css',
  'css/ui.css',
  'fonts/fonts.css',
  'fonts/baloo2-latin.woff2',
  'fonts/nunito-latin.woff2',
  'icons/apple-touch-icon.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'js/main.js',
  'js/version.js',
  'js/state.js',
  'js/data.js',
  'js/iso.js',
  'js/art.js',
  'js/decor.js',
  'js/icons.js',
  'js/sim.js',
  'js/audio.js',
  'js/screens/cafeteria.js',
  'js/screens/preparo.js',
  'js/screens/decorar.js',
  'js/screens/clientes.js',
  'js/screens/cardapio.js',
  'js/screens/ajustes.js',
];

const HOME = new URL('./', self.location.href).href;
const VERSION_FILE = new URL('js/version.js', self.location.href).href;

// Só guarda resposta boa, do próprio site e sem redirecionamento.
const storable = (res) => res && res.ok && res.type === 'basic' && !res.redirected;

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // cache: 'reload' ignora o cache HTTP; se um arquivo falhar, a instalação
    // falha inteira e o service worker anterior (ou nenhum) continua valendo.
    const responses = await Promise.all(FILES.map(async (path) => {
      const res = await fetch(new Request(path, { cache: 'reload' }));
      if (!storable(res)) throw new Error('sw: falha ao guardar ' + path);
      return [path, res];
    }));
    await Promise.all(responses.map(([path, res]) => cache.put(path, res)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter((key) => key.startsWith(PREFIX) && key !== CACHE)
      .map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

// Rede primeiro; guarda a cópia nova (na chave `key`) e cai para a guardada.
async function networkFirst(request, key, fallbackKey) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(request);
    if (storable(res)) cache.put(key, res.clone()).catch(() => {});
    return res;
  } catch (err) {
    const hit = (await cache.match(key, { ignoreSearch: true }))
      || (fallbackKey && await cache.match(fallbackKey));
    if (hit) return hit;
    throw err;
  }
}

// Cache primeiro (o cache da versão é preenchido de uma vez no install, então
// os arquivos ficam coerentes entre si); se faltar, busca na rede e guarda.
async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  if (storable(res)) cache.put(request, res.clone()).catch(() => {});
  return res;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    // A página é única: a cópia guardada fica sempre em './'.
    event.respondWith(networkFirst(request, HOME, HOME));
  } else if (url.href.split('?')[0] === VERSION_FILE) {
    // Rede primeiro para a versão: uma publicação nova é registrada já na
    // primeira abertura com internet.
    event.respondWith(networkFirst(request, request, null));
  } else {
    event.respondWith(cacheFirst(request));
  }
});
