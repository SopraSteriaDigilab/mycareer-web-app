const HR = "/hr/";
const GETCAREER = "getCareer/";

/**
 *Ajax GET call get history for a user.
 * 
 * @param userId the id of the user
 * @param successFuntion function if call succeeds
 * @param errorFunction function if call fails
 */
function getEmployeeCareerAction(userId, searchUserId, successFunction, errorFunction){
	var url = HR + userId  + "/" + GETCAREER + searchUserId;
	var request = $get(url);
	request.done( function(data){ 
		successFunction(data)
	});
	request.fail(function(jqXHR, textStatus){
        toastr.error(jqXHR.responseJSON.error);
        errorFunction(jqXHR.responseJSON.error);
	});
}