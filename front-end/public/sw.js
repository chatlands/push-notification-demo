function receivePushNotification(event) {
  console.log("[Service Worker] Push Received.", event);

  const { image, tag, url, title, text } = event.data.json();

  const options = {
    data: url,
    body: text,
    icon: image,
    vibrate: [200, 100, 200],
    tag: tag,
    image: image,
    badge: "https://chatwitch.com/images/icons/misty-moon.png",
    actions: [
      {
        action: "Detail",
        title: "View",
        icon: "https://chatwitch.com/images/icons/human2.gif",
      },
    ],
  };
  event.waitUntil(self.registration.showNotification(title, options));
}

function openPushNotification(event) {
  console.log(
    "[Service Worker] Notification click Received.",
    event.notification.data
  );

  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data));
}

self.addEventListener("push", receivePushNotification);
self.addEventListener("notificationclick", openPushNotification);
