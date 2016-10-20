$(function() {

	init();

	$( "#navbar" ).load( "../templates/navbar.html" );
	$( "#objectives" ).load( "../templates/objectives.html" );
	$( "#feedback" ).load( "../templates/feedback.html" );

});

function init(){
	$("#feedback").hide();
}

