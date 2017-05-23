const GETMYCAREER = "/getMyCareer";

/**
 *Ajax GET call get history for a user.
 * 
 * @param userId the id of the user
 * @param successFuntion function if call succeeds
 * @param errorFunction function if call fails
 */
function getEmployeeCareerAction(userId, successFunction, errorFunction){
	var url = HISTORY + GETMYCAREER + "/" + userId;
	var request = $get(url);
	request.done( function(data){ 
		successFunction(data)
	})
	request.fail(function(jqXHR, textStatus) {
        toastr.error(jqXHR.responseJSON.error);
        errorFunction(jqXHR.responseJSON.error);
	});
}