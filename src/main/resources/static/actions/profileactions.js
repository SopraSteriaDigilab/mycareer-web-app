const EDIT_USER_EMAIL_ADDRESS = "/editUserEmailAddress";

/**
 * Ajax POST call to insert extra email to DB.
 * 
 * @param extraEmailInput the extra email from the input
 * @param successFunction function if call succeeds
 * @param errorFunction function if call fails
 */
function saveExtraEmailAction(userId, emailAddress, successFunction, errorFunction){
	var url = EDIT_USER_EMAIL_ADDRESS + "/" + userId;
	var data = {
        emailAddress: emailAddress,
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