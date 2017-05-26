const GET_REPORTEES = "/getReportees";
const GET_ACTIVITY_FEED = "/getActivityFeed";
const GENERATE_DISTRIBUTION_LIST = "/generateDistributionList";
const PROPOSE_OBJECTIVE_TO_DISTRIBUTION_LIST = "/proposeObjectiveToDistributionList";


function getReporteesAction(userId, successFunction, errorFunction){
	var url = MANAGER + GET_REPORTEES + "/" +userId;
	var request = $get(url);
	request.done(function(data){ 
		successFunction(data)
	})
	request.fail(function(jqXHR, textStatus) {
		toastr.error("Sorry, there was a problem getting reportees, please try again later.");
        errorFunction(jqXHR.responseJSON.error);
	});
}


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

function proposeObjectiveToDistributionListAction(userId, data, successFunction, errorFunction){
	var url = MANAGER + PROPOSE_OBJECTIVE_TO_DISTRIBUTION_LIST + "/" + userId;
	var request = $post(url, data);
	request.done(function(response){ 
		toastr.success(response.success)
		successFunction(response)
	})
	request.fail(function(jqXHR, textStatus) {
		toastr.error(jqXHR.responseJSON.error);
        errorFunction(jqXHR.responseJSON.error);
	});
}