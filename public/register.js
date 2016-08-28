var isPushEnabled = false;
var swsub;

window.addEventListener('load', function() {  
  var pushButton = document.querySelector('.js-push-button');  
  pushButton.addEventListener('click', function() {  
    if (isPushEnabled) {  
      unsubscribe(swsub);  
    } else {  
      subscribe();  
    }  
  });

initialiseState();
 
});


// Once the service worker is registered set the initial state  
function initialiseState() {  
  // Are Notifications supported in the service worker?  
  if (!('showNotification' in ServiceWorkerRegistration.prototype)) {  
    console.warn('Notifications aren\'t supported.');  
    return;  
  }

  // Check the current Notification permission.  
  // If its denied, it's a permanent block until the  
  // user changes the permission  
  if (Notification.permission === 'denied') {  
    console.warn('The user has blocked notifications.');  
    return;  
  }

  // Check if push messaging is supported  
  if (!('PushManager' in window)) {  
    console.warn('Push messaging isn\'t supported.');  
    return;  
  }

  // We need the service worker registration to check for a subscription  
  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {  
    // Do we already have a push message subscription?  
    serviceWorkerRegistration.pushManager.getSubscription()  
      .then(function(subscription) {  
        // Enable any UI which subscribes / unsubscribes from  
        // push messages.  
        var pushButton = document.querySelector('.js-push-button');  
        pushButton.disabled = false;
if ('serviceWorker' in navigator) {  
    navigator.serviceWorker.register('/sw.js') .then(function(reg) {
        console.log(':^)', reg);
        reg.pushManager.subscribe({
            userVisibleOnly: true
        }).then(function(sub) {
			swsub = sub;
            console.log('endpoint:', sub.endpoint);
			isPushEnabled = true;  
        pushButton.textContent = 'Disable Push Messages';  
        pushButton.disabled = false;
saveEndPointInFireBase(sub.endpoint);
			        });
});} else {  
    console.warn('Service workers aren\'t supported in this browser.');  
  } 
        if (!subscription) {  
          // We aren't subscribed to push, so set UI  
          // to allow the user to enable push  
          return;  
        }

console.log(subscription);
        // Keep your server in sync with the latest subscriptionId
        sendSubscriptionToServer(subscription);

        // Set your UI to show they have subscribed for  
        // push messages  
        pushButton.textContent = 'Disable Push Messages';  
        isPushEnabled = true;  
      })  
      .catch(function(err) {  
        console.warn('Error during getSubscription()', err);  
      });  
  });  
}

function subscribe() {  
  // Disable the button so it can't be changed while  
  // we process the permission request  
  var pushButton = document.querySelector('.js-push-button');  
  pushButton.disabled = true;

  if ('serviceWorker' in navigator) {  
    navigator.serviceWorker.register('/sw.js') .then(function(reg) {
        console.log(':^)', reg);
        reg.pushManager.subscribe({
            userVisibleOnly: true
        }).then(function(sub) {
			swsub = sub;
            console.log('endpoint:', sub.endpoint);
			isPushEnabled = true;  
        pushButton.textContent = 'Disable Push Messages';  
        pushButton.disabled = false;
saveEndPointInFireBase(sub.endpoint);
			        });
});} else {  
    console.warn('Service workers aren\'t supported in this browser.');  
  } 
  
 
}

function unsubscribe(swsub) {  
  var pushButton = document.querySelector('.js-push-button');  
  pushButton.disabled = true;

  if ('serviceWorker' in navigator) {  
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
		for(let reg of registrations){
		
			console.log('::::::::::::^)', reg);
			swsub.unsubscribe().then(function(sub) {
				console.log('endpoint:', sub.endpoint);
				isPushEnabled = false;  
			pushButton.textContent = 'Enable Push Messages';  
			pushButton.disabled = false;		
			});
		}
});} else {  
    console.warn('Service workers aren\'t supported in this browser.');  
  } 
  
}

function sendSubscriptionToServer(subscription){
console.log("Subscription::::::"+subscription.endpoint);


}

function saveEndPointInFireBase(subscription){
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB3eV06eStFNvj3tY93yq_6rzE92-zeWAA",
    authDomain: "testdb-3625e.firebaseapp.com",
    databaseURL: "https://testdb-3625e.firebaseio.com",
    storageBucket: "testdb-3625e.appspot.com",
  };
  firebase.initializeApp(config);

  // Get a reference to the database service
  var database = firebase.database();
  console.log(database);
  var subId = getSubscriptionId(subscription);
  firebase.database().ref('subscriptions/' + "subscriptionId").set({
    id: subId
  });
  /*var userId = "user1";
  firebase.database().ref('users/' + userId).on('value', function(snapshot) {
  console.log(snapshot.val());
  
});*/
}

function getSubscriptionId(data){
var pos = data.search("send");
return data.substring(pos+5);
return data;
}
