const GET_ALL_NAMES_AND_IDS = "/getAllNamesAndIds";

/**
 *Ajax GET call get history for a user.
 * 
 * @param userId the id of the user
 * @param successFuntion function if call succeeds
 * @param errorFunction function if call fails
 */
function getEmployeeNamesAndIDsAction(successFunction, errorFunction){
	var url = DATA + GET_ALL_NAMES_AND_IDS;
	var request = $get(url);
	request.done( function(data){ 
		successFunction(data)
	})
	request.fail(function(jqXHR, textStatus) {
        toastr.error("Sorry, there was a problem getting employee names and ids.");
        errorFunction(jqXHR.responseJSON.error);
	});
}

