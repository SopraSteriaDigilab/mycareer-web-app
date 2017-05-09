const HR = "/hr";
const GET_CAREER = "/getCareer";
const GET_MY_CAREER_STATS = "/getMyCareerStats";
const GET_SECTOR_BREAKDOWN = "/getSectorBreakDown";
const GET_EMPLOYEE_STATS = "/getEmployeeStats";
const GET_OBJECTIVE_STATS = "/getObjectiveStats";
const GET_FEEDBACK_STATS = "/getFeedbackStats";

/**
 *Ajax GET call get history for a user.
 * 
 * @param userId the id of the user
 * @param successFuntion function if call succeeds
 * @param errorFunction function if call fails
 */
function getEmployeeCareerAction(userId, searchUserId, successFunction, errorFunction){
	var url = HR + "/" +userId + GET_CAREER + "/" + searchUserId;
	var request = $get(url);
	request.done( function(data){ 
		successFunction(data)
	});
	request.fail(function(jqXHR, textStatus){
        toastr.error(jqXHR.responseJSON.error);
        errorFunction(jqXHR.responseJSON.error);
	});
}


function getMyCareerStatsAction(successFunction, errorFunction){
	var url = HR + GET_MY_CAREER_STATS;
	var request = $get(url);
	request.done( function(data){ 
		successFunction(data)
	});
	request.fail(function(jqXHR, textStatus){
        toastr.error(jqXHR.responseJSON.error);
        errorFunction(jqXHR.responseJSON.error);
	});
}

function getSectorBreakDownAction(successFunction, errorFunction){
	var url = HR + GET_SECTOR_BREAKDOWN;
	var request = $get(url);
	request.done( function(data){ 
		successFunction(data)
	});
	request.fail(function(jqXHR, textStatus){
        toastr.error(jqXHR.responseJSON.error);
        errorFunction(jqXHR.responseJSON.error);
	});
}

function getEmployeeStatsAction(successFunction, errorFunction){
	var url = HR + GET_EMPLOYEE_STATS;
	var request = $get(url);
	request.done( function(data){ 
		successFunction(data)
	});
	request.fail(function(jqXHR, textStatus){
        toastr.error(jqXHR.responseJSON.error);
        errorFunction(jqXHR.responseJSON.error);
	});
}

function getObjectiveStatsAction(successFunction, errorFunction){
	var url = HR + GET_OBJECTIVE_STATS;
	var request = $get(url);
	request.done( function(data){ 
		successFunction(data)
	});
	request.fail(function(jqXHR, textStatus){
        toastr.error(jqXHR.responseJSON.error);
        errorFunction(jqXHR.responseJSON.error);
	});
}

function getFeedbackStatsAction(successFunction, errorFunction){
	var url = HR + GET_FEEDBACK_STATS;
	var request = $get(url);
	request.done( function(data){ 
		successFunction(data)
	});
	request.fail(function(jqXHR, textStatus){
        toastr.error(jqXHR.responseJSON.error);
        errorFunction(jqXHR.responseJSON.error);
	});
}















