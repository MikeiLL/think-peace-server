// Register event listener for the 'push' event.
console.log("Service worker");
self.addEventListener('push', function(event) {
  // Keep the service worker alive until the notification is created.
  event.waitUntil(
    // Show a notification with title 'ServiceWorker Cookbook' and body 'Alea iacta est'.
    self.registration.showNotification('ServiceWorker Cookbook', {
      body: 'Now we cook',
    }).catch((error) => {
      console.log(error);
    })
  );
});
