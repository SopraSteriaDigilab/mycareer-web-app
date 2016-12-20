$(function() {
	
	if(!sessionStorage.getItem("username")){
		window.location.replace("http://"+getEnvironment()+":8000/mycareer");
	}else{
		authenticate(sessionStorage.getItem("username"));
	}
	
});

var ADfullName = null;
var ADLoginID = null;
var isManager = null;


function getEnvironment(){
	return "ldunsmycareerdev01.duns.uk.sopra";
}

//Hardcoded for now
function getUserName(){
	return sessionStorage.getItem("username");
}

//Authenticate the user against AD
function authenticate(username){	
	 $.ajax({
	      url: 'http://'+getEnvironment()+':8080/authenticateUserProfile/',
	      method: 'GET',
	      data: {'userName_Email' : username},
	      success: function(data){
	    	  ADfullName = data.fullName;
	    	  ADLoginID = data.employeeID;
	    	  isManager = Boolean(data.isManager);
	    	  loadPage($("#section").text());
	    	  
	      },
	      error: function(XMLHttpRequest, textStatus, errorThrown){
	    	  window.location.replace("http://"+getEnvironment()+":8000/mycareer");
	    	  console.log("Sorry no access");
	      }
	  });
	
}

//Load relevant page based on section in url
function loadPage(section){
	$( "#navbar" ).load( "../components/navbar/navbar.html");
	$( "#notes" ).load( "../components/notes/notes.html");
	
	$.get( "http://"+getEnvironment()+":8000/components/"+section+"/"+section+".html", function( data ) {
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



