// NFL Pick'em service worker: shows push notifications and opens the app when tapped.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let d = {};
  try { d = event.data ? event.data.json() : {}; } catch (e) { d = { body: event.data && event.data.text() }; }
  event.waitUntil(self.registration.showNotification(d.title || "NFL Pick'em", {
    body: d.body || "",
    icon: "icon-192.png",
    badge: "icon-192.png",
    tag: "pickem-reminder",
    renotify: true,
    data: { url: d.url || "./" },
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL((event.notification.data && event.notification.data.url) || "./", self.registration.scope).href;
  event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
    for (const c of list) { if ("focus" in c) return c.focus(); }
    return self.clients.openWindow(target);
  }));
});
