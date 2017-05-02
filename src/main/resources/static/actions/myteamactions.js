/**
 *Ajax GET call to get activity feed for a user.
 * 
 * @param userId the id of the user
 * @param successFuntion function if call succeeds
 * @param errorFunction function if call fails
 */
function getActivityFeedAction(userId, successFunction, errorFunction){
    $.ajax({
        url: 'http://'+getEnvironment()+'/manager/getActivityFeed/'+userId,
        cache: false,
        method: 'GET',
        xhrFields: {'withCredentials': true},
        success: function(data){
        	successFunction(data);
        },
        error: function(jqXHR, textStatus){        	
            toastr.error("Sorry, there was a problem getting ratings, please try again later.");
            errorFunction(jqXHR.responseJSON.error);
        }
    });
}