navigator.serviceWorker.register("/service-worker.js");

function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

navigator.serviceWorker.ready
  .then(function (registration) {
    console.log("navigator.serviceWorker.ready");
  // Use the PushManager to get the user's subscription to the push service.
  return registration.pushManager.getSubscription()
  .then(async function(subscription) {
    console.log("Subscription");
    // If a subscription was found, return it.
    if (subscription) {
      console.log("True");
      return subscription;
    }
    // Get the server's public key
    const response = await fetch('./vapidPublicKey');
    const vapidPublicKey = await response.text();
    // Otherwise, subscribe the user (userVisibleOnly allows to specify that we don't plan to
    // send notifications that don't have a visible effect for the user).
    console.log("Subscribing");
    return registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
    });
  });
}).then(function(subscription) {
  console.log("Fetching register");
  // Send the subscription details to the server using the Fetch API.
  fetch('/register', {
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      subscription: subscription
    }),
  });

  document.getElementById('unDoIt').onclick = function () {
    console.log("undoing it");
    navigator.serviceWorker.ready.then((request) => {
      request.pushManager.getSubscription().then((subscription) => {
        console.log("got a subscription remove")
        console.log(subscription);
        subscription && subscription
          .unsubscribe()
          .then((successful) => {
            fetch('/removeSubscription', {
              method: 'post',
              headers: {
                'Content-type': 'application/json'
              },
              body: JSON.stringify({
                subscription_endpoint: subscription.endpoint,
              }),
            });
          })
          .catch((e) => {
            // Unsubscribing failed
          });
      });
    });

  }

});
