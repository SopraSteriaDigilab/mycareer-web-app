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
    
    //sets email addresses to use bootstrap tag input
//    $('#requestingTo').tagsinput();
    
    //click to open up feedback request modal
    $('#request-feedback').click(function(){ openRequestFeedbackModal() });
    
    //modal validation.
	$('.request-feedback-validate').keyup(function() { validateForm('validateEmail', 'submit-request-feedback'); });
    
    
    //click to submit feedback request
    $('#submit-request-feedback').click(function(){ 
        if (isValidEmailAddress($('#requestingTo').val())){
            submitFeedbackRequest();
        }else{
            toastr.error("Error, please enter a valid email address");
        }    
     });

        
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

//validates to ensure email format
function isValidEmailAddress(requestingTo){
    var pattern = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return pattern.test(requestingTo);

}

//validate multiple emails
//function validateMultipleEmails(){
//    var result = value.split(", | ;");
//    for(var i = 0;i < result.length;i++)
//    if(!validateEmail(result[i])) 
// 
//}   

//Email details sent through back-end.
function submitFeedbackRequest(){
	var url = "http://127.0.0.1:8080/generateFeedbackRequest/2312";
	var data = {};
	data["emailsTo"] = $('#requestingTo').val();
	data["notes"] = $('#requestingText').val();
  
	var settings = {
	  "url": url,
	  "method": "POST",
	  "data": data
	}
	$.ajax(settings).done(function (response) {
	  toastr.success(response);
	});
    
    
    $('#requestFeedbackModal').on('hidden.bs.modal', function(){
    $(this).find('form')[0].reset();
    });
    
    $('#requestFeedbackModal').modal('hide');
}

