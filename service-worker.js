// service-worker.js

// Define o nome e a versão do cache. Mudar a versão invalida o cache antigo.
const CACHE_NAME = 'missionlab-cache-v1';

// Lista de todos os arquivos e recursos que o aplicativo precisa para funcionar offline.
// Isso inclui o HTML principal, scripts, fontes, e imagens.
const URLS_TO_CACHE = [
  '/', // A raiz do site, geralmente o index.html
  'index.html',
  'manifest.json',
  
  // Scripts de bibliotecas externas (CDN)
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  
  // Fontes do Google
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  
  // Imagens das bandeiras
  'https://flagcdn.com/br.svg',
  'https://flagcdn.com/es.svg',
  'https://flagcdn.com/us.svg'
];

// Evento 'install': é acionado quando o service worker é instalado pela primeira vez.
// Aqui, abrimos nosso cache e adicionamos todos os arquivos da lista URLS_TO_CACHE.
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');
  
  // O event.waitUntil() garante que o service worker não será considerado "instalado"
  // até que o código dentro dele seja concluído com sucesso.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Abrindo cache e adicionando arquivos principais.');
        return cache.addAll(URLS_TO_CACHE);
      })
      .then(() => {
        console.log('Service Worker: Todos os arquivos foram cacheados com sucesso.');
        // Força o novo service worker a se tornar ativo imediatamente.
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Falha ao cachear arquivos durante a instalação.', error);
      })
  );
});

// Evento 'activate': é acionado quando o service worker é ativado.
// É um bom lugar para limpar caches antigos que não são mais necessários.
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
        // Assume o controle da página imediatamente, sem precisar recarregar.
        return self.clients.claim();
    })
  );
});

// Evento 'fetch': é acionado toda vez que a página faz uma requisição de rede
// (seja para buscar uma imagem, um script, uma API, etc.).
// Aqui implementamos a estratégia "Stale-While-Revalidate".
self.addEventListener('fetch', event => {
    // Ignora requisições que não são GET
    if (event.request.method !== 'GET') {
        return;
    }

    // Estratégia Stale-While-Revalidate:
    // 1. Responde o mais rápido possível com o recurso do cache (se disponível).
    // 2. Em paralelo, faz uma requisição à rede para obter a versão mais recente.
    // 3. Se a requisição de rede for bem-sucedida, atualiza o cache para a próxima visita.
    event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(event.request).then(cachedResponse => {
                // Faz a requisição à rede em paralelo
                const fetchPromise = fetch(event.request).then(networkResponse => {
                    // Se a resposta da rede for válida, atualiza o cache
                    if (networkResponse.ok) {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                }).catch(error => {
                    // A requisição de rede falhou, provavelmente offline.
                    console.warn('Service Worker: Requisição de rede falhou.', event.request.url, error);
                });

                // Retorna a resposta do cache imediatamente (se houver), ou espera a rede.
                return cachedResponse || fetchPromise;
            });
        })
    );
});
