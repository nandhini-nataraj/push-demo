var reg;
var sub;
var isSubscribed = false;
var subscribechkbx = document.querySelector('#survey');
$("#subsciption").hide();
$("form").hide();
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyB3eV06eStFNvj3tY93yq_6rzE92-zeWAA",
    authDomain: "testdb-3625e.firebaseapp.com",
    databaseURL: "https://testdb-3625e.firebaseio.com",
    storageBucket: "testdb-3625e.appspot.com",
  };
firebase.initializeApp(config);

if ('serviceWorker' in navigator) {
  console.log('Service Worker is supported');
  navigator.serviceWorker.register('/surveysw.js').then(function(serviceWorkerRegistration) {
    reg = serviceWorkerRegistration;
    
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
      // Do we already have a push message subscription?
      reg.pushManager.getSubscription()
        .then(function(subscription) {
          sub = subscription;
          if(!subscription){
            $("#subsciption").show();
            $("form").hide();
            return;
          }
          subscribechkbx.checked=true;
          isSubscribed = true;
          $("#subsciption").hide();
          $("form").show();
        });
    });
    
    console.log('Service Worker is ready :^)', reg);
    return navigator.serviceWorker.ready;
  }).catch(function(error) {
    console.log('Service Worker Error :^(', error);
  });
}

subscribechkbx.addEventListener('click', function() {
  if (isSubscribed) {
    unsubscribe();
  } else {
    subscribe();
  }
});

function subscribe() {
  reg.pushManager.subscribe({userVisibleOnly: true}).
  then(function(pushSubscription) {
    sub = pushSubscription;
    console.log('Subscribed! Endpoint:', sub.endpoint);
    console.log(sub.toJSON());
    isSubscribed = true;
    //saveEndPointInFireBase(sub.endpoint);
    
    saveSubscription(sub.toJSON());
    $("#subsciption").hide();
    $("form").show();
  });
}

function unsubscribe() {
  sub.unsubscribe().then(function(event) {
  
    console.log('Unsubscribed!', event);
    isSubscribed = false;
    $("#subsciption").show();
    $("form").hide();
  }).catch(function(error) {
    console.log('Error unsubscribing', error);
  
  });
}

function saveSubscription(jsonObj){
  // Get a reference to the database service
  var database = firebase.database();
  firebase.database().ref('survey/').push({
   endpoint:jsonObj.endpoint,
   keys:jsonObj.keys
  });
  
}
