const GET_OBJECTIVES = "/getObjectives";
const ADD_OBJECTIVE = "/addObjective";
const EDIT_OBJECTIVE = "/editObjective";
const UPDATE_OBJECTIVE_PROGRESS = "/updateObjectiveProgress";
const DELETE_OBJECTIVE = "/deleteObjective";

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

function addObjectiveAction(userId, title, description, dueDate, successFunction, errorFunction){
	var url = ADD_OBJECTIVE + "/" + userId;
	var data = {
        title: title,
        description: description,
        dueDate: dueDate,
    }
	var request = $post(url, data);
	request.done(function(response){
		toastr.success("Objective inserted");
		successFunction(response)
	})
	request.fail(function(jqXHR, textStatus) {
    	toastr.error(jqXHR.responseJSON.error);
    	errorFunction(jqXHR.responseJSON.error);
	});
}

function editObjectiveAction(userId, objectiveId, title, description, dueDate, successFunction, errorFunction){
	var url = EDIT_OBJECTIVE + "/" + userId;
	var data = {
        objectiveId: objectiveId,
        title: title,
        description: description,
        dueDate: dueDate,
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

function updateObjectiveProgressAction(userId, objectiveId, progress, comment, successFunction, errorFunction){
	var url = UPDATE_OBJECTIVE_PROGRESS + "/" + userId;
	var data = {
        objectiveId: objectiveId,
        progress: progress,
        comment: comment,
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

function deleteObjectiveAction(userId, objectiveId, comment, successFunction, errorFunction){
	var url = DELETE_OBJECTIVE + "/" + userId;
	var data = {
        objectiveId: objectiveId,
        comment: comment,
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


