// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://bit.ly/CRA-PWA

// const isLocalhost = Boolean(
//   window.location.hostname === 'localhost' ||
//     // [::1] is the IPv6 localhost address.
//     window.location.hostname === '[::1]' ||
//     // 127.0.0.0/8 are considered localhost for IPv4.
//     window.location.hostname.match(
//       /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
//     )
// );

// export function register(config) {
//   if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
//     // The URL constructor is available in all browsers that support SW.
//     const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
//     if (publicUrl.origin !== window.location.origin) {
//       // Our service worker won't work if PUBLIC_URL is on a different origin
//       // from what our page is served on. This might happen if a CDN is used to
//       // serve assets; see https://github.com/facebook/create-react-app/issues/2374
//       return;
//     }

//     window.addEventListener('load', () => {
//       const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

//       if (isLocalhost) {
//         // This is running on localhost. Let's check if a service worker still exists or not.
//         checkValidServiceWorker(swUrl, config);

//         // Add some additional logging to localhost, pointing developers to the
//         // service worker/PWA documentation.
//         navigator.serviceWorker.ready.then(() => {
//           console.log(
//             'This web app is being served cache-first by a service ' +
//               'worker. To learn more, visit https://bit.ly/CRA-PWA'
//           );
//         });
//       } else {
//         // Is not localhost. Just register service worker
//         registerValidSW(swUrl, config);
//       }
//     });
//   }
// }

// function registerValidSW(swUrl, config) {
//   navigator.serviceWorker
//     .register(swUrl)
//     .then(registration => {
//       registration.onupdatefound = () => {
//         const installingWorker = registration.installing;
//         if (installingWorker == null) {
//           return;
//         }
//         installingWorker.onstatechange = () => {
//           if (installingWorker.state === 'installed') {
//             if (navigator.serviceWorker.controller) {
//               // At this point, the updated precached content has been fetched,
//               // but the previous service worker will still serve the older
//               // content until all client tabs are closed.
//               console.log(
//                 'New content is available and will be used when all ' +
//                   'tabs for this page are closed. See https://bit.ly/CRA-PWA.'
//               );

//               // Execute callback
//               if (config && config.onUpdate) {
//                 config.onUpdate(registration);
//               }
//             } else {
//               // At this point, everything has been precached.
//               // It's the perfect time to display a
//               // "Content is cached for offline use." message.
//               console.log('Content is cached for offline use.');

//               // Execute callback
//               if (config && config.onSuccess) {
//                 config.onSuccess(registration);
//               }
//             }
//           }
//         };
//       };
//     })
//     .catch(error => {
//       console.error('Error during service worker registration:', error);
//     });
// }

// function checkValidServiceWorker(swUrl, config) {
//   // Check if the service worker can be found. If it can't reload the page.
//   fetch(swUrl, {
//     headers: { 'Service-Worker': 'script' }
//   })
//     .then(response => {
//       // Ensure service worker exists, and that we really are getting a JS file.
//       const contentType = response.headers.get('content-type');
//       if (
//         response.status === 404 ||
//         (contentType != null && contentType.indexOf('javascript') === -1)
//       ) {
//         // No service worker found. Probably a different app. Reload the page.
//         navigator.serviceWorker.ready.then(registration => {
//           registration.unregister().then(() => {
//             window.location.reload();
//           });
//         });
//       } else {
//         // Service worker found. Proceed as normal.
//         registerValidSW(swUrl, config);
//       }
//     })
//     .catch(() => {
//       console.log(
//         'No internet connection found. App is running in offline mode.'
//       );
//     });
// }

// export function unregister() {
//   if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.ready.then(registration => {
//       registration.unregister();
//     });
//   }
// }



const staticCacheName = 'site-static-v2';
const dynamicCacheName = 'site-dynamic-v1';
const assets = [
  '/',
  '/index.html',
  '../src/index.js',
  '../src/index.css',
  '/image/ridesharebg.gif',
  'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-beta/js/materialize.min.js',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://kit.fontawesome.com/fbe9fc69ff.js',
  'https://fonts.googleapis.com/css2?family=Roboto&display=swap',
  'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
  '/pages/fallback.html'
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size){
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// install event
self.addEventListener('install', evt => {
  //console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener('activate', evt => {
  //console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      //console.log(keys);
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// fetch events
self.addEventListener('fetch', evt => {
  if(evt.request.url.indexOf('firestore.googleapis.com') === -1){
    evt.respondWith(
      caches.match(evt.request).then(cacheRes => {
        return cacheRes || fetch(evt.request).then(fetchRes => {
          return caches.open(dynamicCacheName).then(cache => {
            cache.put(evt.request.url, fetchRes.clone());
            // check cached items size
            limitCacheSize(dynamicCacheName, 15);
            return fetchRes;
          })
        });
      }).catch(() => {
        if(evt.request.url.indexOf('.html') > -1){
          return caches.match('/fallback');
        } 
      })
    );
  }
});

