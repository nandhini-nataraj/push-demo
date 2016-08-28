$(function() {

//Get the msg from query string
var msg = {};
var text = {};
msg = document.location.search.split("msg=");
var msgString = unescape(msg[1].toString());

text = msgString.split("-k+e+y+s-");


var keysJson = JSON.parse(text[1].toString());

document.querySelector("#msg").innerHTML = text[0].toString();

document.querySelector("#message").value = text[0].toString();
document.querySelector("#endpoint").value = keysJson.endpoint;
document.querySelector("#p256dh").value = keysJson.keys.p256dh;
document.querySelector("#auth").value = keysJson.keys.auth;

});