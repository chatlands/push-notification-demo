// const pushServerPublicKey = "BIN2Jc5Vmkmy-S3AUrcMlpKxJpLeVRAfu9WBqUbJ70SJOCWGCGXKY-Xzyh7HDr6KbRDGYHjqZ06OcS3BjD7uAm8";
const pushServerPublicKey =
  "BAIB7tmHbyqzcc7pNEP5VRfi5V5EBwxTMOFGIcwXT-mRS3AL6A01FTPpO1_NR_o-tMf8NRLLp9zipy_Ym27cr0Q";

/**
 * checks if Push notification and service workers are supported by your browser
 */
function isPushNotificationSupported() {
  return "serviceWorker" in navigator && "PushManager" in window;
}

/**
 * asks user consent to receive push notifications and returns the response of the user, one of granted, default, denied
 */
function initializePushNotifications() {
  // request user grant to show notification
  return Notification.requestPermission(function (result) {
    return result;
  });
}
/**
 * shows a notification
 */
function sendNotification() {
  const img = "/images/guardianhead1.png";
  const body = "Take a look at this brand new message!";
  const title = "Chatlands Message";
  const options = {
    body: body,
    icon: "/images/icons/wolf16x16.gif",
    vibrate: [200, 100, 200],
    tag: "message-notification",
    image: img,
    badge: "https://chatwitch.com/images/icons/misty-moon.png",
    actions: [
      {
        action: "Detail",
        title: "View",
        icon: "https://chatwitch.com/images/icons/human2.gif",
      },
    ],
  };
  navigator.serviceWorker.ready.then(function (serviceWorker) {
    serviceWorker.showNotification(title, options);
  });
}

/**
 *
 */
function registerServiceWorker() {
  navigator.serviceWorker
    .register("/push/sw.js")
    .then(function (swRegistration) {
      //you can do something with the service wrker registration (swRegistration)
    });
}

/**
 *
 * using the registered service worker creates a push notification subscription and returns it
 *
 */
function createNotificationSubscription() {
  //wait for service worker installation to be ready, and then
  return navigator.serviceWorker.ready.then(function (serviceWorker) {
    // subscribe and return the subscription
    return serviceWorker.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: pushServerPublicKey,
      })
      .then(function (subscription) {
        console.log("User is subscribed.", subscription);
        return subscription;
      });
  });
}

/**
 * returns the subscription if present or nothing
 */
function getUserSubscription() {
  //wait for service worker installation to be ready, and then
  return navigator.serviceWorker.ready
    .then(function (serviceWorker) {
      return serviceWorker.pushManager.getSubscription();
    })
    .then(function (pushSubscription) {
      return pushSubscription;
    });
}

export {
  isPushNotificationSupported,
  initializePushNotifications,
  registerServiceWorker,
  sendNotification,
  createNotificationSubscription,
  getUserSubscription,
};
