$(function() {
	

});


function temp(){
	var input = $("#username-input").val();
	sessionStorage.setItem("username", input);
//	window.location.replace("http://ldunsmycareeruat01.duns.uk.sopra:8000/mycareer/myobjectives");
	window.location.replace("http://localhost:8000/mycareer/myobjectives");
}