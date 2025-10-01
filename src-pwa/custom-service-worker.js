/* eslint-env serviceworker */

/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.config file > pwa > workboxMode is set to "InjectManifest"
 */

import { clientsClaim } from 'workbox-core'
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
// import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching'
// import { registerRoute, NavigationRoute } from 'workbox-routing'

// disable workbox logs
self.__WB_DISABLE_DEV_LOGS = true

self.skipWaiting()
clientsClaim()

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

cleanupOutdatedCaches()

// Non-SSR fallbacks to index.html
// Production SSR fallbacks to offline.html (except for dev)
// if (process.env.MODE !== 'ssr' || process.env.PROD) {
//   registerRoute(
//     new NavigationRoute(
//       createHandlerBoundToURL(process.env.PWA_FALLBACK_HTML),
//       { denylist: [new RegExp(process.env.PWA_SERVICE_WORKER_REGEX), /workbox-(.)*\.js$/] }
//     )
//   )
// }

// Push Notifications Received
self.addEventListener('push', event => {
  if (event.data){
    let data = JSON.parse(event.data.text())
    event.waitUntil(
      self.registration.showNotification(
        data.title,
        {
          body: data.body,
          icon: "icons/icon-128x128.png",
          badge: "icons/icon-128x128.png",
          data: {
            openUrl: data.openUrl
          }
        }
      )
    )
  }
})

// Push Notifications Clicked
self.addEventListener('notificationclick', event => {
  let notification = event.notification
  let action = event.action
  if (action == ''){
    event.waitUntil(
      clients.matchAll().then(match => {
        let clientUsingApp = match.find(client => {
          return client.visibilityState === 'visible'
        })
        if (clientUsingApp) {
          clientUsingApp.navigate(notification.data.openUrl)
          clientUsingApp.focus()
        } else {
          clients.openWindow(notification.data.openUrl)
        }
      })
    )
  }
  notification.close()
})

self.addEventListener('notificationclose', event => {
  console.log('Notfication Closed', event)
})
