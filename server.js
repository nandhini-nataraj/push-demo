// init project
var express = require('express');

var app = express();

var gcm = require('node-gcm');
var firebase = require("firebase");
var webpush =require("web-push");
var bodyParser = require('body-parser');
 
var apiKey = 'AIzaSyComu0YxAcl9Kwi_Z_219k_Xl7JKAKWdyI';
var msg='Something went wrong! Msg Not received'
var locationReturnEndpoint = '';
 

firebase.initializeApp({apiKey: "AIzaSyB3eV06eStFNvj3tY93yq_6rzE92-zeWAA",
      authDomain: "testdb-3625e.firebaseapp.com",
      databaseURL: "https://testdb-3625e.firebaseio.com",
      storageBucket: "testdb-3625e.appspot.com",
    });
    
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

//error
app.use(function (err, req, res, next){
  res.status(500);
  res.send('500 erorrr');
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response)  {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/sendandreceive", function (request, response)  {
  response.sendFile(__dirname + '/views/sendandreceive.html');
});

app.get("/register", function (request, response)  {
  response.sendFile(__dirname + '/views/register.html');
});

app.get("/sendLocation", function (request, response)  {
  response.sendFile(__dirname + '/views/sendLocation.html');
});

app.get("/send", function (request, response)  {
  response.sendFile(__dirname + '/views/send.html');
});

app.get("/respondMessage", function (request, response)  {
  response.sendFile(__dirname + '/views/respondMessage.html');
});

app.get("/survey", function (request, response)  {
  response.sendFile(__dirname + '/views/survey.html');
});

app.get("/surveyThankyou", function (request, response)  {
  response.sendFile(__dirname + '/views/surveyThankyou.html');
});

app.post("/sendSurvey", function (request, response)  {
  var msg = request.body.message;
    sendSurveyPush(msg);
    response.sendFile(__dirname + '/views/respondMessage.html');
});


app.post("/respondMessage", function (request, response)  {
  var cl = request.body.loc;
  var endpoint = request.body.endpoint;
  var params={
    payload : cl,
    userPublicKey : request.body.p256dh,
    userAuth : request.body.auth
  };
  webpush.setGCMAPIKey(apiKey);
  webpush.sendNotification(endpoint, params);
  response.sendFile(__dirname + '/views/respondMessage.html');
    
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/sendandreceive", function (request, response) {
  var msg = request.body.message;
  var subJson = request.body.sender;
  var subString= msg+"-k+e+y+s-"+subJson;
  sendPush(subString);
  response.sendFile(__dirname + '/views/sendandreceive.html');
});


app.post("/sendBroadcast", function (request, response) {
  var msg = request.body.message;
  sendPush(msg);
  response.sendFile(__dirname + '/views/respondMessage.html');
});


function sendPush(subString){
  var database = firebase.database();
  var params={
    payload : subString
  };
	webpush.setGCMAPIKey(apiKey);
  database.ref('subscriptions/').on('value', function(snapshot) {
    var i = 0;         
    snapshot.forEach(function(childSnapshot) {
    var endpoint = childSnapshot.child("endpoint").val();
    var subkeys = childSnapshot.child("keys").val();
    console.log('endpoint : ', endpoint);
		if (subkeys) {
		  params.userPublicKey = subkeys.p256dh;
		  params.userAuth = subkeys.auth;
		}
		console.log('params', params);
		webpush.sendNotification(endpoint, params);
    });
});
}

function sendSurveyPush(subString){
  var database = firebase.database();
  var params={
    payload : subString
  };
	webpush.setGCMAPIKey(apiKey);
  database.ref('survey/').on('value', function(snapshot) {
    var i = 0;         
    snapshot.forEach(function(childSnapshot) {
    var endpoint = childSnapshot.child("endpoint").val();
    var subkeys = childSnapshot.child("keys").val();
    console.log('endpoint : ', endpoint);
		if (subkeys) {
		  params.userPublicKey = subkeys.p256dh;
		  params.userAuth = subkeys.auth;
		}
		console.log('params', params);
		webpush.sendNotification(endpoint, params);
    });
});
}


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});