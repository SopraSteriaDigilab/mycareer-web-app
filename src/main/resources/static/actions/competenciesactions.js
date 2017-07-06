const GET_COMPETENCIES = "/getCompetencies";
const TOGGLE_COMPETENCY = "/toggleCompetency";

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

function toggleCompetencyAction(userId, competencyTitle, successFunction, errorFunction){
	var url = TOGGLE_COMPETENCY + "/" + userId;
	var data = {
		competencyTitle: competencyTitle
    }
	var request = $post(url, data);
	request.done(function(response){
//		toastr.success(response);
		successFunction(response)
	})
	request.fail(function(jqXHR, textStatus) {
    	toastr.error(jqXHR.responseJSON.error);
    	errorFunction(jqXHR.responseJSON.error);
	});
}