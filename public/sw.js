// HotelConnect dashboard service worker: makes the app installable and shows
// push notifications (new tenders, compliance deadlines, repair requests…).
// No offline caching: the dashboard always loads live data.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: event.data ? event.data.text() : "HotelConnect" };
  }
  event.waitUntil(
    self.registration.showNotification(data.title || "HotelConnect", {
      body: data.body || "",
      icon: new URL("icons/icon-192.png", self.registration.scope).href,
      badge: new URL("icons/badge-96.png", self.registration.scope).href,
      data: { url: data.url || "/notifications" },
    }),
  );
});

// Tapping a notification opens (or focuses) the dashboard on the right page.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  // Links are dashboard paths ("/hotel/…"); the scope carries the base path (production: /dashboard/).
  const url = new URL((event.notification.data?.url || "/notifications").replace(/^\//, ""), self.registration.scope).href;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      for (const client of windows) {
        if (client.url.startsWith(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    }),
  );
});
