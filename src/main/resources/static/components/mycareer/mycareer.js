$(function() {
	logMeIn();
});

var ADfullName = null;
var ADLoginID = null;
var isManager = null;

function getEnvironment(){
//	return "mycareer-uat.duns.uk.sopra";
	return "localhost";
}

function getUserName(){
	return sessionStorage.getItem("username");
}

//Authenticate the user against AD
function authenticate(username){	
	 $.ajax({
	      url: 'http://'+getEnvironment()+':8080/authenticateUserProfile',
	      method: 'GET',
	      xhrFields: { 'withCredentials': true },
	      data: {'userName_Email' : username},
	      success: function(data){
	    	  ADfullName = data.fullName;
	    	  ADLoginID = data.employeeID;
	    	  isManager = Boolean(data.isManager);
	    	  loadPage($("#section").text());
	    	  
	      },
	      error: function(XMLHttpRequest, textStatus, errorThrown){
	    	  window.location.replace("/access-issue");
	      }
	  });
	
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

function isUserManager(){
	return isManager;
}

function logMeIn(){

	if(!sessionStorage.getItem("username")){
		var settings = {
		  "async": true,
		  "crossDomain": true,
		  "url": "http://"+getEnvironment()+":8080/logMeIn",
		  "method": "GET",
		   xhrFields: { 'withCredentials': true },
		}
		
		$.ajax(settings).done(function (response) {
			 
//			  console.log(response);
			  sessionStorage.setItem("username", response);
			  authenticate(response);
		});
		
	}else{
		authenticate(sessionStorage.getItem("username"));
	}
}
	


