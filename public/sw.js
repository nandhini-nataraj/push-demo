var msg="Default Message";
var returnEndpoint = "";

console.log('Started', self);
self.addEventListener('install', function(event) {
  self.skipWaiting();
  console.log('Installed', event);
});
self.addEventListener('activate', function(event) {
  console.log('Activated', event);
});

self.addEventListener('push', function(event) { 

    var title = 'Notifications Demo...';  
    
  msg = event.data.text();
  var textMsg = msg;
  if(msg.indexOf('-k+e+y+s-') > 0){
    var text = msg.split("-k+e+y+s-");
    textMsg = text[0].toString();
  }
  var icon = 'https://cdn.hyperdev.com/us-east-1%3A085b6849-49b0-45a1-91c7-2937810139f5%2Falarm-bell-icon_1598341.jpg';
  event.waitUntil(
          self.registration.showNotification(title, {
              body: textMsg,  
            icon: icon,
            
  }));
});


self.addEventListener('notificationclick', function(event) {
  
  // Android doesn't close the notification when you click it
  // See http://crbug.com/463146
  event.notification.close();
  
  if(msg.indexOf('-k+e+y+s-') > 0){
    url = 'https://fancy-robin.hyperdev.space/sendLocation?msg=' + msg;
  } else {
    url = 'https://fancy-robin.hyperdev.space/';
  }
  // Check if there's already a tab open with this URL.
  // If yes: focus on the tab.
  // If no: open a tab with the URL.
  event.waitUntil(
    clients.matchAll({
      type: 'window'
    })
    .then(function(windowClients) {
      console.log('WindowClients', windowClients);
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        console.log('WindowClient', client);
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});