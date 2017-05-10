const MANAGER = "/manager";
const GET_ACTIVITY_FEED = "/getActivityFeed";
const GENERATE_DISTRIBUTION_LIST = "/generateDistributionList";

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
	request.done(function(data){ 
		successFunction(data)
	})
	request.fail(function(jqXHR, textStatus) {
		toastr.error("Sorry, there was a problem getting ratings, please try again later.");
        errorFunction(jqXHR.responseJSON.error);
	});
}

function generateDistributionListAction(userId, data, successFunction, errorFunction){
	var url = MANAGER + GENERATE_DISTRIBUTION_LIST + "/" +userId;
	var request = $post(url, data);
	request.done(function(data){ 
		successFunction(data)
	})
	request.fail(function(jqXHR, textStatus) {
		toastr.error(jqXHR.responseJSON.error);
        errorFunction(jqXHR.responseJSON.error);
	});
}

function proposeObjectiveToDistributionListAction(){}