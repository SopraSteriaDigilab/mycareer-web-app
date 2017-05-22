const GET_FEEDBACK = "/getFeedback";

function getFeedbackAction(userId, successFunction, errorFunction){
	var url = GET_FEEDBACK + "/" + userId;
	var request = $get(url);
	request.done( function(data){ 
		successFunction(data)
	})
	request.fail(function(jqXHR, textStatus) {
        toastr.error("Sorry, there was a problem getting feedback, please try again later.");
        errorFunction(jqXHR.responseJSON.error);
	});
}

