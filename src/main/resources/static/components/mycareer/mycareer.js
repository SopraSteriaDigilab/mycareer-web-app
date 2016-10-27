$(function() {

//	init();

	$( "#navbar" ).load( "../components/navbar/navbar.html" );
	
//	alert(window.location.href);
	
//	alert($("#section").text());
	
	loadPage($("#section").text());
//	$( "#objectives-section" ).load( "../components/objectives/objectives.html" );
//	$( "#feedback-section" ).load( "../components/feedback/feedback.html" );
//	$( "#development-needs-section" ).load( "../components/development-needs/development-needs.html" );
	
	
});


function loadPage(section){
	$.get( "http://localhost:8000/components/"+section+"/"+section+".html", function( data ) {
		  $( "#myapp" ).html( data );
		}).fail(function() {
			 toastr.error("Sorry could not load page, please try again later");
		});

}

function init(){
	$("#feedback-section").hide();
	$("#development-needs-section").hide();
}

