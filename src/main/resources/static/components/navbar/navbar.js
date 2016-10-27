$(function() {

//	$("#objectives").click(function() {
//		window.history.pushState("objectives","objectives", "myobjectives");
//		loadPage("myobjectives");
//		highlight('objectives');
//	});
//
//	$("#feedback").click(function() {
//		window.history.pushState("feedback","feedback", "myfeedback");
//		loadPage("myfeedback");
//		highlight('feedback');
//	});
//	
//	$("#development-needs").click(function() {
//		window.history.pushState("developmentneeds","developmentneeds", "mydevelopmentneeds");
//		loadPage("mydevelopmentneeds");
//		highlight('development-needs');
//	});
//	
//
	highlight($("#section").text());
    
    $('#request-feedback').click(function(){ openRequestFeedbackModal() });
});
//
//function loadPage(section){
//	$.get( "http://localhost:8000/components/"+section+"/"+section+".html", function( data ) {
//		  $( "#myapp" ).html( data );
//		}).fail(function() {
//			 toastr.error("Sorry could not load page, please try again later");
//		});
//
//}


function highlight(value) {
	$('.nav-bar-item').each(function(i) {
		if(value === this.id) {
			$("#"+this.id).addClass("selected");
		}else{
			$("#"+this.id).removeClass("selected");
		}
	});

}

function openRequestFeedbackModal(){
    $('#requestFeedbackModal').modal({backdrop: 'static', keyboard: false, show: true});
}

