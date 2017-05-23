const GET_COMPETENCIES = "/getCompetencies";

function getCompetenciesAction(userId, successFunction, errorFunction){
	var url = GET_COMPETENCIES + "/" + userId;
	var request = $get(url);
	request.done( function(data){ 
		successFunction(data)
	})
	request.fail(function(jqXHR, textStatus) {
        toastr.error("Sorry, there was a problem getting competencies, please try again later.");
        errorFunction(jqXHR.responseJSON.error);
	});
}

