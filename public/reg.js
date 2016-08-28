'use strict';

$(function(){ 
$("#links").hide();
$("#surveylinks").hide();

var reg;
var sub;
var surveyreg;
var surveysub;
var isSubscribed = false;
var isSurveySubscribed = false;
var subscribechkbx = document.querySelector('#bus');
var surveychbx = document.querySelector('#survey');

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
  navigator.serviceWorker.register('/sw.js').then(function(serviceWorkerRegistration) {
    reg = serviceWorkerRegistration;
    
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
      // Do we already have a push message subscription?
      reg.pushManager.getSubscription()
        .then(function(subscription) {
          sub = subscription;
          if(!subscription){
            return;
          }
          subscribechkbx.checked=true;
          isSubscribed = true;
          $("#links").show();
        });
    });
    
    console.log('Service Worker is ready :^)', reg);
    return navigator.serviceWorker.ready;
  }).catch(function(error) {
    console.log('Service Worker Error :^(', error);
  });
  
  navigator.serviceWorker.register('/surveysw.js').then(function(serviceWorkerRegistration) {
    surveyreg = serviceWorkerRegistration;
    
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
      // Do we already have a push message subscription?
      surveyreg.pushManager.getSubscription()
        .then(function(subscription) {
          surveysub = subscription;
          if(!subscription){
            return;
          }
          surveychbx.checked=true;
          isSurveySubscribed = true;
          $("#surveylinks").show();
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

  surveychbx.addEventListener('click', function() {
  if (isSurveySubscribed) {
    surveyunsubscribe();
  } else {
    surveysubscribe();
  }

});

});

function subscribe() {
  reg.pushManager.subscribe({userVisibleOnly: true}).
  then(function(pushSubscription) {
    sub = pushSubscription;
    console.log('Subscribed! Endpoint:', sub.endpoint);
    console.log(sub.toJSON());
    isSubscribed = true;
    $("#links").show();
    saveSubscription(sub.toJSON());
  });
}

function unsubscribe() {
  sub.unsubscribe().then(function(event) {
  
    console.log('Unsubscribed!', event);
    isSubscribed = false;
    $("#links").hide();
  }).catch(function(error) {
    console.log('Error unsubscribing', error);
  
  });
}
  
   
function surveysubscribe() {
  surveyreg.pushManager.subscribe({userVisibleOnly: true}).
  then(function(pushSubscription) {
    surveysub = pushSubscription;
    console.log('Subscribed! Endpoint:', surveysub.endpoint);
    console.log(surveysub.toJSON());
    isSurveySubscribed = true;
    $("#surveylinks").show();
    saveSubscription(sub.toJSON());
  });
}

function surveyunsubscribe() {
  surveysub.unsubscribe().then(function(event) {
  
    console.log('Unsubscribed!', event);
    isSurveySubscribed = false;
    $("#surveylinks").hide();
  }).catch(function(error) {
    console.log('Error unsubscribing', error);
  
  });
}


function saveEndPointInFireBase(subscriptionId){
  

  // Get a reference to the database service
  var database = firebase.database();

  var subId = getSubscriptionId(subscriptionId);
  var totalRecs = 0;

firebase.database().ref('subscriptions/').push({
    id: subId
  });
}


function getSubscriptionId(data){
var pos = data.search("send");
return data.substring(pos+5);
return data;
}

function saveSubscription(jsonObj){
  // Get a reference to the database service
  var database = firebase.database();
  firebase.database().ref('subscriptions/').push({
   endpoint:jsonObj.endpoint,
   keys:jsonObj.keys
  });
  
}
});
