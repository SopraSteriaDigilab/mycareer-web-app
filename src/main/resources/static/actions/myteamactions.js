const MANAGER = "/manager";
const GET_ACTIVITY_FEED = "/getActivityFeed";

/**
 *Ajax GET call to get activity feed for a user.
 * 
 * @param userId the id of the user
 * @param successFuntion function if call succeeds
 * @param errorFunction function if call fails
 */
function getActivityFeedAction(userId, successFunction, errorFunction){
	var url = MANAGER + GET_ACTIVITY_FEED + "/" +userId;
	var request = $get(url);
	request.done( function(data){ 
		successFunction(data)
	})
	request.fail(function(jqXHR, textStatus) {
		toastr.error("Sorry, there was a problem getting ratings, please try again later.");
        errorFunction(jqXHR.responseJSON.error);
	});
}