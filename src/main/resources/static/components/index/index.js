$(function() {

	init();

	$( "#navbar" ).load( "../components/navbar/navbar.html" );
	$( "#objectives-section" ).load( "../components/objectives/objectives.html" );
	$( "#feedback-section" ).load( "../components/feedback/feedback.html" );
	$( "#development-needs-section" ).load( "../components/development-needs/development-needs.html" );
	
});

function init(){
	$("#feedback-section").hide();
	$("#development-needs-section").hide();
}

