const GET_DEVELOPMENT_NEEDS = "/getDevelopmentNeeds";

function getDevelopmentNeedsAction(userId, successFunction, errorFunction){
	var url = GET_DEVELOPMENT_NEEDS + "/" + userId;
	var request = $get(url);
	request.done( function(data){ 
		successFunction(data)
	})
	request.fail(function(jqXHR, textStatus) {
        toastr.error("Sorry, there was a problem getting development needs, please try again later.");
        errorFunction(jqXHR.responseJSON.error);
	});
}

