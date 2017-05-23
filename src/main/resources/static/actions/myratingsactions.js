const GET_CURRENT_RATING = "/getCurrentRating";
const ADD_MANAGER_EVALUATION = "/addManagerEvaluation";
const ADD_SELF_EVALUATION = "/addSelfEvaluation";
const SUBMIT_SELF_EVALUATION = "/submitSelfEvaluation";
const SUBMIT_MANAGER_EVALUATION = "/submitManagerEvaluation";

/**
 * Ajax GET call to get current ratings for a user.
 * 
 * @param userId the id of the user
 * @param successFuntion function if call succeeds
 * @param errorFunction function if call fails
 */
function getCurrentRatingAction(userId, successFunction, errorFunction){
	var url = GET_CURRENT_RATING + "/" + userId;
	var request = $get(url);
	request.done( function(data){ 
		successFunction(data)
	})
	request.fail(function(jqXHR, textStatus) {
        toastr.error("Sorry, there was a problem getting ratings, please try again later.");
        errorFunction(jqXHR.responseJSON.error);
	});
}

/**
 * Ajax POST call to add manager evaluation for a user.
 * 
 * @param userId the id of the user
 * @param reporteeId the id of the reportee
 * @param managerEvaluation evaluation for the reportee
 * @param score the score for the reportee
 * @param successFuntion function if call succeeds
 * @param errorFunction function if call fails
 */
function addManagerEvaluationAction(userId, reporteeId, managerEvaluation, score, successFunction, errorFunction){
	var url = MANAGER + ADD_MANAGER_EVALUATION + "/" + userId;
	var data = {
	    reporteeId: reporteeId,
	    managerEvaluation: managerEvaluation,
	    score: score
    }
	var request = $post(url, data);
	request.done(function(response){
		toastr.success(response);
		successFunction(response)
	})
	request.fail(function(jqXHR, textStatus) {
    	toastr.error(jqXHR.responseJSON.error);
    	errorFunction(jqXHR.responseJSON.error);
	});
}

/**
 * Ajax POST call to add self evaluation for a user.
 * 
 * @param userId the id of the user
 * @param reporteeId the id of the reportee
 * @param selfEvaluation evaluation for the reportee
 * @param successFuntion function if call succeeds
 * @param errorFunction function if call fails
 */
function addSelfEvaluationAction(userId, selfEvaluation, successFunction, errorFunction){
	var url = ADD_SELF_EVALUATION + "/" + userId;
	var data = { selfEvaluation: selfEvaluation }
	var request = $post(url, data);
	request.done(function(response){
		toastr.success(response);
		successFunction(response)
	})
	request.fail(function(jqXHR, textStatus) {
    	toastr.error(jqXHR.responseJSON.error);
    	errorFunction(jqXHR.responseJSON.error);
	});
}

function submitSelfEvaluationAction(userId, successFunction, errorFunction){
	var url = SUBMIT_SELF_EVALUATION + "/" + userId;
	var data = { }
	var request = $post(url, data);
	request.done(function(response){
		toastr.success(response);
		successFunction(response)
	})
	request.fail(function(jqXHR, textStatus) {
    	toastr.error(jqXHR.responseJSON.error);
    	errorFunction(jqXHR.responseJSON.error);
	});
}


function submitManagerEvaluationAction(userId, reporteeId, successFunction, errorFunction){
	var url = MANAGER + SUBMIT_MANAGER_EVALUATION + "/" + userId;
	var data = { reporteeId: reporteeId }
	var request = $post(url, data);
	request.done(function(response){
		toastr.success(response);
		successFunction(response)
	})
	request.fail(function(jqXHR, textStatus) {
    	toastr.error(jqXHR.responseJSON.error);
    	errorFunction(jqXHR.responseJSON.error);
	});
}






