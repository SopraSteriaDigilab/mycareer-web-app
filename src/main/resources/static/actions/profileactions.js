/**
 * Ajax POST call to insert extra email to DB.
 * 
 * @param extraEmailInput the extra email from the input
 * @param successFunction function if call succeeds
 * @param errorFunction function if call fails
 */
function saveExtraEmailAction(extraEmail, successFunction, errorFunction){
	extraEmailInput=extraEmail.trim();
	$.ajax({
	    url: "http://"+getEnvironment()+"/editUserEmailAddress/"+getADLoginID(),
	    method: "POST",
	    xhrFields: {'withCredentials': true},
	    data: {
	        'emailAddress': extraEmailInput,
	    },
	    success: function(response){
	    	toastr.success(response);
	    	successFunction(extraEmailInput);
	    },
	    error: function(XMLHttpRequest, textStatus, errorThrown){
	        toastr.error(XMLHttpRequest.responseText);
	        errorFunction();
	    },
	});
}

/**
 * Ajax POST call to delete extra email on DB.
 * 
 * @param extraEmailInput the extra email from the input
 * @param successFunction function if call succeeds
 * @param errorFunction function if call fails
 */
function deleteExtraEmailAction(successFunction, errorFunction){
	$.ajax({
	    url: "http://"+getEnvironment()+"/editUserEmailAddress/"+getADLoginID(),
	    method: "POST",
	    xhrFields: {'withCredentials': true},
	    data: {
	        'emailAddress': '',
	    },
	    success: function(response){
	    	toastr.success(response);
	    	successFunction();
	    },
	    error: function(XMLHttpRequest, textStatus, errorThrown){
	        toastr.error(XMLHttpRequest.responseText);
	        errorFunction();
	    },
	});
}