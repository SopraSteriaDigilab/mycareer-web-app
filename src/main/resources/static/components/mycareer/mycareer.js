$(function() {
	logMeIn();
});

var ADfullName = null;
var ADLoginID = null;
var isManager = null;
var ADUsername = null;
var hasHRDash = null;
var emailSet = new Set();
var userAddress = null;

function logMeIn(){	
	$.ajax({
		"async": true,
		"crossDomain": true,
		"url": "http://"+getEnvironment()+"/logMeIn",
		"method": "GET",
		xhrFields: { 'withCredentials': true },
		success: function(data){
			ADfullName = data.fullName;
			ADLoginID = data.employeeID;
			ADUsername = data.username;
			isManager = data.isManager;
			demoManager(data.employeeID) //REMOVE ME!!!!
			hasHRDash = data.hasHRDash;
			mail=data.emailAddresses.mail;
			targetAddress=data.emailAddresses.targetAddress;
			emailSet.add(mail.toString()).add(targetAddress.toString());
			userAddress = data.emailAddresses.userAddress;
			loadPage($("#section").text());  
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			window.location.replace("/access-issue");
		}
	});
}

function demoManager(employeeID){
	if(employeeID == 675590){
	  isManager = true;
	}
	if(employeeID == 674936){
		isManager = true;
	}
	if(employeeID == 678124){
		isManager = true;
	}
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
    return emailSet;
}

function getUserAddress(){
    return userAddress;
}