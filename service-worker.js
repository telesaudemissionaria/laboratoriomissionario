// service-worker.js

// Define um nome e versão para o cache. Mudar a versão limpará o cache antigo.
const CACHE_NAME = 'missionlab-cache-v1';

// Lista de todos os arquivos e recursos que a aplicação precisa para funcionar offline.
const URLS_TO_CACHE = [
  '/', // A página principal
  'index.html',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://flagcdn.com/br.svg',
  'https://flagcdn.com/es.svg',
  'https://flagcdn.com/us.svg',
  'icons/icon-192x192.png',
  'icons/icon-512x512.png',
  'manifest.json'
  // Adicione aqui outros recursos estáticos que seu app possa precisar.
];

// Evento 'install': É disparado quando o service worker é instalado pela primeira vez.
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');
  // O service worker espera até que o cache seja completamente preenchido.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Abrindo cache e adicionando arquivos essenciais.');
        return cache.addAll(URLS_TO_CACHE);
      })
      .then(() => {
        // Força o novo service worker a se tornar ativo imediatamente.
        return self.skipWaiting();
      })
  );
});

// Evento 'activate': É disparado quando o service worker se torna ativo.
// É usado para limpar caches antigos e garantir que a versão mais recente esteja em uso.
self.addEventListener('activate', event => {
  console.log('Service Worker: Ativando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Limpando cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
        // Garante que o service worker ativo tome controle da página imediatamente.
        return self.clients.claim();
    })
  );
});

// Evento 'fetch': É disparado toda vez que a página faz uma requisição de rede.
// Esta é a mágica do offline-first.
self.addEventListener('fetch', event => {
  // Ignora requisições que não são GET (ex: POST para a API da IA)
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    // 1. Tenta encontrar o recurso no cache.
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Se encontrou no cache, retorna a resposta do cache.
          // console.log('Service Worker: Recurso encontrado no cache:', event.request.url);
          return cachedResponse;
        }

        // 2. Se não encontrou no cache, vai para a rede.
        // console.log('Service Worker: Recurso não encontrado no cache, buscando na rede:', event.request.url);
        return fetch(event.request).then(
          networkResponse => {
            // Clona a resposta da rede, pois ela só pode ser lida uma vez.
            const responseToCache = networkResponse.clone();
            
            // Abre o cache e armazena a nova resposta para uso futuro.
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            // Retorna a resposta da rede para a página.
            return networkResponse;
          }
        );
      }).catch(error => {
        // Em caso de falha total (sem cache e sem rede), você pode retornar uma página de fallback.
        console.error('Service Worker: Erro ao buscar recurso.', error);
        // Retornar uma página de erro offline genérica seria uma boa prática aqui.
      })
  );
});
