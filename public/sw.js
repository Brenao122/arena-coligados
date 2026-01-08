const CACHE_NAME = "arena-coligados-v1"
const OFFLINE_URL = "/offline.html"

const STATIC_ASSETS = [
  "/",
  "/offline.html",
  "/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg",
  "/manifest.json",
]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching static assets")
      return cache.addAll(STATIC_ASSETS)
    }),
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("[SW] Deleting old cache:", cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event - network first, fallback to cache
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return

  // Skip Chrome extensions and external requests
  if (!event.request.url.startsWith(self.location.origin)) return

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response
        const responseClone = response.clone()

        // Cache successful responses
        if (response.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
        }

        return response
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }

          // If no cache, return offline page for navigation requests
          if (event.request.mode === "navigate") {
            return caches.match(OFFLINE_URL)
          }

          return new Response("Network error", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
          })
        })
      }),
  )
})

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-reservations") {
    event.waitUntil(syncReservations())
  }
})

async function syncReservations() {
  console.log("[SW] Syncing reservations")
  // Implement your sync logic here
}

// Push notifications
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "Nova notificação da Arena Coligados",
    icon: "/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg",
    badge: "/images/design-mode/WhatsApp%20Image%202025-08-11%20at%2022.27.16.jpeg",
    vibrate: [200, 100, 200],
    tag: "arena-notification",
    requireInteraction: false,
  }

  event.waitUntil(self.registration.showNotification("Arena Coligados", options))
})

// Notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  event.waitUntil(clients.openWindow("/"))
})
