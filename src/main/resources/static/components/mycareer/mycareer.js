$(function() {
	
	authenticate(getUserName());
	
	
});

var ADUserName = null;

//Hardcoded for now.
function getUserName(){
	
	return "rnacef";
}

//Authenticate the user against AD
function authenticate(username){	
	 $.ajax({
	      url: 'http://localhost:8080/authenticateUserProfile/'+username,
	      method: 'GET',
	      success: function(data){
	    	  ADUserName = data.displayName;
	    	  loadPage($("#section").text());
	      },
	      error: function(XMLHttpRequest, textStatus, errorThrown){
	    	  console.log("Sorry no access");
	      }
	  });
	
}

//Load relevant page based on section in url
function loadPage(section){
	$( "#navbar" ).load( "../components/navbar/navbar.html" );
	
	$.get( "http://localhost:8000/components/"+section+"/"+section+".html", function( data ) {
		  $( "#myapp" ).html( data );
		}).fail(function() {
			 toastr.error("Sorry could not load page, please try again later");
		});

}

function getADUserName(){
	return ADUserName;
}



