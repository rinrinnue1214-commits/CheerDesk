// CheerDesk Service Worker - プッシュ通知処理

self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  const title = data.title || 'CheerDesk';
  const options = {
    body: data.body || '推しの新しい活動があります',
    icon: data.icon || '/icon-192.png',
    badge: '/badge-72.png',
    tag: data.tag || 'cheerdesk',
    data: { url: data.url || '/app.html' },
    vibrate: [200, 100, 200],
    actions: [
      { action: 'open', title: '確認する' },
      { action: 'close', title: '閉じる' }
    ]
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'close') return;
  const url = e.notification.data?.url || '/app.html';
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
    for (const client of clientList) {
      if (client.url.includes('cheerdesk.pages.dev') && 'focus' in client) {
        return client.focus();
      }
    }
    if (clients.openWindow) return clients.openWindow(url);
  }));
});

self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(clients.claim()); });
