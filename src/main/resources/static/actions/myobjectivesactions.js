const GET_OBJECTIVES = "/getObjectives";

function getObjectivesActions(userId, successFunction, errorFunction){
	var url = GET_OBJECTIVES + "/" + userId;
	var request = $get(url);
	request.done( function(data){ 
		successFunction(data)
	})
	request.fail(function(jqXHR, textStatus) {
        toastr.error("Sorry, there was a problem getting objectives, please try again later.");
        errorFunction(jqXHR.responseJSON.error);
	});
}

