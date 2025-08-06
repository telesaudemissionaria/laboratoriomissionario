// Define um nome e versão para o cache.
// Mudar a versão (ex: 'v2') fará com que o service worker atualize o cache.
const CACHE_NAME = 'missionlab-cache-v1';

// Lista de todos os arquivos que o aplicativo precisa para funcionar offline.
const urlsToCache = [
  '/', // A página principal
  'index.html',
  'manifest.json',
  // Arquivos de CDN (essenciais para o layout e funcionalidade)
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  // Ícones e imagens
  'icons/icon-192x192.png',
  'icons/icon-512x512.png',
  'https://flagcdn.com/br.svg',
  'https://flagcdn.com/es.svg',
  'https://flagcdn.com/us.svg'
];

// Evento 'install': é acionado quando o service worker é registrado pela primeira vez.
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');
  // Espera até que o cache seja aberto e todos os arquivos sejam adicionados a ele.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache aberto. Adicionando arquivos ao cache.');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Todos os arquivos foram cacheados com sucesso.');
        // Força o novo service worker a se tornar ativo imediatamente.
        return self.skipWaiting();
      })
  );
});

// Evento 'fetch': é acionado toda vez que o aplicativo faz uma requisição de rede (ex: carregar uma imagem, um script).
self.addEventListener('fetch', event => {
  // Responde à requisição com uma estratégia "cache-first".
  event.respondWith(
    // Tenta encontrar a resposta no cache primeiro.
    caches.match(event.request)
      .then(response => {
        // Se a resposta for encontrada no cache, a retorna.
        if (response) {
          // console.log('Service Worker: Servindo do cache:', event.request.url);
          return response;
        }
        // Se não estiver no cache, faz a requisição à rede.
        // console.log('Service Worker: Buscando da rede:', event.request.url);
        return fetch(event.request);
      })
  );
});

// Evento 'activate': é acionado quando um novo service worker se torna ativo.
// É usado para limpar caches antigos e garantir que o app use a versão mais recente.
self.addEventListener('activate', event => {
  console.log('Service Worker: Ativando...');
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Se o nome do cache não estiver na lista de permissões, ele é deletado.
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Limpando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
        // Garante que a página que registrou o service worker seja controlada por ele imediatamente.
        return self.clients.claim();
    })
  );
});
