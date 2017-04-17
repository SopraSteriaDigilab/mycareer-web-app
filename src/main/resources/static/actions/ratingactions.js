/**
 * Ajax GET call to get current ratings for a user.
 * 
 * @param userId the id of the user
 * @param successFuntion function if call succeeds
 * @param errorFunction function if call fails
 */
function getCurrentRatingAction(userId, successFunction, errorFunction){
    $.ajax({
        url: 'http://'+getEnvironment()+'/getCurrentRating/'+userId,
        cache: false,
        method: 'GET',
        xhrFields: {'withCredentials': true},
        success: function(data){
        	successFunction(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){        	
            toastr.error("Sorry, there was a problem getting ratings, please try again later.");
            errorFunction();
        }
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
    $.ajax({
        url: "http://"+getEnvironment()+"/addManagerEvaluation/"+userId,
        method: 'POST',
        xhrFields: {'withCredentials': true},
        data: {
            'reporteeId': reporteeId,
            'managerEvaluation': managerEvaluation,
            'score': score
        },            
        success: function(response){
        	toastr.success(response);
        	successFunction(response);
           },
           error: function(XMLHttpRequest, textStatus, errorThrown){
               toastr.error(errorThrown);
               errorFunction(errorThrown);
           },
    });
}

/**
 * Ajax POST call to add self evaluation for a user.
 * 
 * @param userId the id of the user
 * @param reporteeId the id of the reportee
 * @param managerEvaluation evaluation for the reportee
 * @param score the score for the reportee
 * @param successFuntion function if call succeeds
 * @param errorFunction function if call fails
 */
function addSelfEvaluationAction(userId, selfEvaluation, successFunction, errorFunction){
    $.ajax({
        url: "http://"+getEnvironment()+"/addSelfEvaluation/"+userId,
        method: 'POST',
        xhrFields: {'withCredentials': true},
        data: {
            'selfEvaluation': selfEvaluation,
        },            
        success: function(response){
        	toastr.success(response);
        	successFunction(response);
           },
           error: function(XMLHttpRequest, textStatus, errorThrown){
               toastr.error(errorThrown);
               errorFunction(errorThrown);
           },
    });
}