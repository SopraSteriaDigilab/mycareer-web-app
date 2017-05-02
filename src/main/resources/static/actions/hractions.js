const HR = "/hr";
const GETMYCAREER = "/getMyCareer/";

/**
 *Ajax GET call get history for a user.
 * 
 * @param userId the id of the user
 * @param successFuntion function if call succeeds
 * @param errorFunction function if call fails
 */
function getEmployeeCareerAction(userId, successFunction, errorFunction){
	var url = HR + GETMYCAREER + userId;
	var request = $get(url);
	request.done( function(data){ 
		successFunction(data)
	})
	request.fail(function(jqXHR, textStatus) {
        toastr.error("Sorry, there was a problem getting you mycareer history, please try again later.");
        errorFunction(jqXHR.responseJSON.error);
	});
}