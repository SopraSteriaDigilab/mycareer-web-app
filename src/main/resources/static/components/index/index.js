$(function() {

	init();

	$( "#navbar" ).load( "../components/navbar/navbar.html" );
	$( "#objectives" ).load( "../components/objectives/objectives.html" );
	$( "#feedback" ).load( "../components/feedback/feedback.html" );

});

function init(){
	$("#feedback").hide();
}

