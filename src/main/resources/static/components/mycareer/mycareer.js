$(function() {
	logMeIn();
});

var ADfullName = null;
var ADLoginID = null;
var isManager = null;
var ADUsername = null;
var hasHRDash = null;
var userAddress = null;
var emails = [];

function logMeIn(){

	var success = function(data) {
		ADfullName = data.fullName;
		ADLoginID = data.employeeID;
		ADUsername = data.username;
		isManager = data.isManager;
		hasHRDash = data.hasHRDash;
		addToEmails(data.emailAddresses.mail);
		addToEmails(data.emailAddresses.targetAddress);
		userAddress = data.emailAddresses.userAddress;
		loadPage($("#section").text());  
	}
	var error = function(XMLHttpRequest, textStatus, errorThrown){
		window.location.replace("/access-issue");
	}
	
	logMeInAction(success, error);
}

function getEnvironment(){
	var host = $("#env").text();
	var port = "8080";
	
	switch (host) {
		case "ldunsmycareerdev01":
			return "ldunsmycareerdev01.duns.uk.sopra:"+port;
		case "ldunsmycareeruat01":
			return "mycareer-uat.duns.uk.sopra:"+port;
		case "ldunsmycareer01":
			return "mycareer.uk.corp.sopra:"+port;
		default:
			return "localhost:"+port;
	}
}

//Load relevant page based on section in url
function loadPage(section){
	$( "#navbar" ).load( "../components/navbar/navbar.html");
	$( "#notes" ).load( "../components/notes/notes.html");
	
	$.get( "/components/"+section+"/"+section+".html", function( data ) {
		  $( "#myapp" ).html( data );
		}).fail(function() {
			 toastr.error("Sorry could not load page, please try again later");
		});
}

function addToEmails(email){
	if(jQuery.inArray(email, emails) == -1){
		emails.push(email);
	}
} 

function getADfullName(){
	return ADfullName;
}

function getADLoginID(){
	return ADLoginID;
}

function getUserName(){
	return ADUsername;
}

function isUserManager(){
	return isManager;
}

function userHasHrDash(){
    return hasHRDash;
}

function getEmailSet(){
    return emails;
}

function getUserAddress(){
    return userAddress;
}