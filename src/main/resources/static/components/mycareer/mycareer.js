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
//		ADfullName = data.fullName;
//		ADLoginID = data.employeeID;
//		ADUsername = data.username;
//		isManager = data.isManager;
//		hasHRDash = data.hasHRDash;
//		addToEmails(data.emailAddresses.mail);
//		addToEmails(data.emailAddresses.targetAddress);
//		userAddress = data.emailAddresses.userAddress;
		demoDetails();
	}
	var error = function(error){
		window.location.replace("/error-page?code=1002");
	}
	
	logMeInAction(success, error);
}

function demoDetails(){
	ADfullName = "Ridhwan Nacef";
	ADLoginID = "675590";
	ADUsername = "rnacef";
	isManager = true;
	hasHRDash = true;
	addToEmails("ridhwan.nacef@soprasteria.com");
	addToEmails("ridhwan.nacef@soprasteria.com");
	userAddress = "ridhwan.nacef@soprasteria.com";
	loadPage($("#section").text());  
}

function getEnvironment(){
	var host = $("#env").text();
	var port = "";
	
	switch (host) {
		case "ldunsmycareerdev01":
			return "ldunsmycareerdev01.duns.uk.sopra:"+port;
		case "ldunsmycareeruat01":
			return "mycareer-uat.duns.uk.sopra:"+port;
		case "ldunsmycareer01":
			return "mycareer.uk.corp.sopra:"+port;
		default:
			return "mycareer-rest-my-career.apps.soprasteria-ocp-digilab.co.uk"+port;
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