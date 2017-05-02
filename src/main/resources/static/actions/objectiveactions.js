/**
 * Ajax POST call to insert an objective to DB.
 * 
 * @param userId the id of the user
 * @param objTitle the title of the objective
 * @param objText the description of the objective
 * @param objDate the due date of the objective
 * @param proposedBy the name of the objective proposer
 * @param successFunction function if call succeeds
 */
function addObjectiveToDBAction(userID, objTitle, objText, objDate, proposedBy, successFunction){
	$.ajax({
        url: "http://"+getEnvironment()+"/addObjective/"+userID,
        method: "POST",
        xhrFields: {'withCredentials': true},
        data: {
            'title': objTitle,
            'description': objText,
            'dueDate': objDate,
        },
        success: function(){
        	successFunction(objTitle, objText, objDate);
        },        
        error: function(XMLHttpRequest, textStatus, errorThrown){
        	toastr.error(XMLHttpRequest.responseText);
        }
    });
}

/**
 * Ajax POST call to update an objective to DB.
 * 
 * @param userID the id of the user
 * @param objID the id of the objective
 * @param objTitle the title of the objective
 * @param objText the description of the objective
 * @param objDate the due date of the objective
 * @param objStatus the status of the objective
 * @param proposedBy the name of the objective proposer
 * @param successFunction function if call succeeds
 */
function editObjectiveOnDBAction(userID, objID, objTitle, objText, objDate, objStatus, proposedBy, successFunction){
    $.ajax({
        url: "http://"+getEnvironment()+"/editObjective/"+userID,
        method: "POST",
        xhrFields: {'withCredentials': true},
        data: {
            'objectiveId': objID,
            'title': objTitle,
            'description': objText,
            'dueDate': objDate,
        },
        success: function(response){
        	successFunction(userID, objID, objTitle, objText, objDate,objStatus);
        	toastr.success(response);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            toastr.error(XMLHttpRequest.responseText);
        },
    });
}

/**
 * Ajax POST call to update an objective progress to DB.
 * 
 * @param userID the id of the user
 * @param objID the id of the objective
 * @param objStatus the status of the objective
 * @param objTitle the title of the objective
 * @param completedText the comment of the completed objective
 * @param successFunction function if call succeeds
 */
function editObjectiveProgressOnDBAction(userID, objID, objStatus, objTitle, completedText, successFunction){
	$.ajax({
        url: "http://"+getEnvironment()+"/updateObjectiveProgress/"+userID,
        method: "POST",
        xhrFields: {'withCredentials': true},
        data: {
            'objectiveId': objID,
            'progress': objStatus,
            'comment': completedText,
        },
        success: function(response){
        	editObjectiveProgressOnDBSuccess(userID, objID, objStatus, objTitle, completedText);
            toastr.success(response);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            toastr.error(XMLHttpRequest.responseText);
        },
    });
}

/**
 * Ajax POST call to delete an objective in DB.
 * 
 * @param userID the id of the user
 * @param objID the id of the objective
 * @param objTitle the title of the objective
 * @param deletingText the deleting comment
 * @param successFunction function if call succeeds
 */
function deleteObjectiveAction(userID, objID, objTitle, deletingText, successFunction){
	$.ajax({
        url: "http://"+getEnvironment()+"/deleteObjective/"+userID,
        method: "POST",
        xhrFields: {'withCredentials': true},
        data: {
            'objectiveId': objID,
            'comment': deletingText,
        },
        success: function(response){
        	successFunction(userID, objID, objTitle, deletingText);
        	toastr.success(response);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            toastr.error(XMLHttpRequest.responseText);
        },
    });
}

/**
 * Ajax POST call to edit objective archive on DB.
 * 
 * @param objID the id of the objective
 * @param archive a boolean (true if the objective is archived)
 * @param successFunction function if call succeeds
 */
function editObjectiveArchiveOnDBAction(objID, archive, successFunction){
    $.ajax({
        url: "http://"+getEnvironment()+"/toggleObjectiveArchive/"+getADLoginID(),
        method: "POST",
        xhrFields: {'withCredentials': true},
        data: {
            'objectiveId': objID,
        },
        success: function(response){
        	successFunction(objID, archive);
        	toastr.success(response);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            toastr.error(XMLHttpRequest.responseText);
        }
    });
}
