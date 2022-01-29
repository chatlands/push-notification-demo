const subscriptions = {};
var crypto = require("crypto");
const webpush = require("web-push");
const fs = require("fs");
const vapidKeys = JSON.parse(fs.readFileSync("./src/vapid-keys.json", "utf8"));
console.log("vapidKeys", vapidKeys);

webpush.setVapidDetails(
  "mailto:underdog@chatlands.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// const vapidKeys = {
//   privateKey: "bdSiNzUhUP6piAxLH-tW88zfBlWWveIx0dAsDO66aVU",
//   publicKey:
//     "BIN2Jc5Vmkmy-S3AUrcMlpKxJpLeVRAfu9WBqUbJ70SJOCWGCGXKY-Xzyh7HDr6KbRDGYHjqZ06OcS3BjD7uAm8",
// };

webpush.setVapidDetails(
  "mailto:example@yourdomain.org",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

function createHash(input) {
  const md5sum = crypto.createHash("md5");
  md5sum.update(Buffer.from(input));
  return md5sum.digest("hex");
}

function handlePushNotificationSubscription(req, res) {
  // console.log("handlePushNotificationSubscription", req, res);
  const subscriptionRequest = req.body;
  const susbscriptionId = createHash(JSON.stringify(subscriptionRequest));
  subscriptions[susbscriptionId] = subscriptionRequest;
  res.status(201).json({ id: susbscriptionId });
}

setInterval(() => {
  console.log(subscriptions);
  for (var id of Object.keys(subscriptions)) {
    sendPushNotification(id);
  }
}, 10000);

function sendPushNotification(id) {
  const subscriptionId = id;
  const pushSubscription = subscriptions[subscriptionId];
  webpush
    .sendNotification(
      pushSubscription,
      JSON.stringify({
        title: "New Chatlands Notification",
        text: "Someone said something on Chatlands",
        image: "/images/guardianhead1.png",
        tag: "new-product",
        url: "https://chatlands.com",
      })
    )
    .catch((err) => {
      console.log(err);
    });
}

// function sendPushNotification(req, res) {
//   const subscriptionId = req.params.id;
//   const pushSubscription = subscriptions[subscriptionId];
//   webpush
//     .sendNotification(
//       pushSubscription,
//       JSON.stringify({
//         title: "New Product Available ",
//         text: "HEY! Take a look at this brand new t-shirt!",
//         image: "/images/jason-leung-HM6TMmevbZQ-unsplash.jpg",
//         tag: "new-product",
//         url: "/new-product-jason-leung-HM6TMmevbZQ-unsplash.html",
//       })
//     )
//     .catch((err) => {
//       console.log(err);
//     });

//   res.status(202).json({});
// }

module.exports = { handlePushNotificationSubscription };
