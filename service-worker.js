// Register event listener for the 'push' event.
self.addEventListener('push', function(event) {
  // Keep the service worker alive until the notification is created.
  let json = event.data.json();
  event.waitUntil(
    // Show a notification with title 'ServiceWorker Cookbook' and body 'Alea iacta est'.
    self.registration.showNotification(json.title, {
      body: json.body,
    }).catch((error) => {
      console.log(error);
    })
  );
});
