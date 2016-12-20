$(document).ready(function() {

});


function temp(){
	var input = $("#username-input").val();
	sessionStorage.setItem("username", input);
	//UAT App Server
	//window.location.replace("http://ldunsmycareeruat01.duns.uk.sopra:8000/mycareer/myobjectives");
	//Live App Server
	//window.location.replace("http://ldunsmycareer01.duns.uk.sopra:8000/mycareer/myobjectives");
	//Development Server
	window.location.replace("http://ldunsmycareerdev01.duns.uk.sopra:8000/mycareer/myobjectives");
}