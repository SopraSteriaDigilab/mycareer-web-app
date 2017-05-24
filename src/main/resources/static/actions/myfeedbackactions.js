const GET_FEEDBACK = "/getFeedback";
const GENERATE_FEEDBACK_REQUEST = "/generateFeedbackRequest";
const ADD_FEEDBACK = "/addFeedback";
const UPDATE_FEEDBACK_TAGS = "/updateFeedbackTags";

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

function generateFeedbackRequestAction(userId, emailsTo, notes, successFunction, errorFunction){
	var url = GENERATE_FEEDBACK_REQUEST + "/" + userId;
	var data = {
        emailsTo: emailsTo,
        notes: notes
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

function addFeedbackAction(userId, emails, feedback, successFunction, errorFunction){
	var url = ADD_FEEDBACK + "/" + userId;
	var data = {
        emails: emails,
        feedback: feedback
    }
	var request = $post(url, data);
	request.done(function(response){
		toastr.success(response);
		successFunction(response)
	})
	request.fail(function(jqXHR, textStatus) {
    	var errorMessage = jqXHR.responseJSON.error.toLowerCase();
    	console.log(errorMessage)
    	if(errorMessage.indexOf("feedback added") > -1){
    		toastr.warning(errorMessage);
    	}else{
    		toastr.error(errorMessage);
    	}
    	errorFunction(errorMessage);
	});
}

function updateFeedbackTagsAction(userId, feedbackId, objectiveIds, developmentNeedIds, successFunction, errorFunction){
	var url = UPDATE_FEEDBACK_TAGS + "/" + userId;
	var data = {
        feedbackId: feedbackId,
        objectiveIds: objectiveIds,
        developmentNeedIds: developmentNeedIds
    }
	var request = $post(url, data);
	request.done(function(response){
		toastr.success(response);
		successFunction(response)
	})
	request.fail(function(jqXHR, textStatus) {
    	var errorMessage = jqXHR.responseJSON.error.toLowerCase();
    	console.log(errorMessage)
    	if(errorMessage.indexOf("feedback added") > -1){
    		toastr.warning(errorMessage);
    	}else{
    		toastr.error(errorMessage);
    	}
    	errorFunction(errorMessage);
	});
}




