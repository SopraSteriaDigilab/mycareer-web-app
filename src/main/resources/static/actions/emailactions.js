const GET_EMAILS = "/getAllEmailAddresses";

/**
 *Ajax GET call get history for a user.
 * 
 * @param userId the id of the user
 * @param successFuntion function if call succeeds
 * @param errorFunction function if call fails
 */
function getEmailsAction(successFunction, errorFunction){
	var url = DATA + GET_EMAILS;
	var request = $get(url);
	request.done( function(data){ 
		successFunction(data)
	})
	request.fail(function(jqXHR, textStatus) {
        toastr.error("Sorry, there was a problem getting emails.");
        errorFunction(jqXHR.responseJSON.error);
	});
}

