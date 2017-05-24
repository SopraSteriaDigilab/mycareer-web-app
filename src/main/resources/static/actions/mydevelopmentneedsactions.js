const GET_DEVELOPMENT_NEEDS = "/getDevelopmentNeeds";
const ADD_DEVELOPMENT_NEED = "/addDevelopmentNeed";
const EDIT_DEVELOPMENT_NEED = "/editDevelopmentNeed";
const EDIT_DEVELOPMENT_NEED_PROGRESS = "/updateDevelopmentNeedProgress";
const DELETE_DEVELOPMENT_NEED = "/deleteDevelopmentNeed";
const EDIT_DEVELOPMENT_NEED_ARCHIVE = "/toggleDevelopmentNeedArchive";

function getDevelopmentNeedsAction(userId, successFunction, errorFunction){
	var url = GET_DEVELOPMENT_NEEDS + "/" + userId;
	var request = $get(url);
	request.done( function(data){ 
		successFunction(data)
	})
	request.fail(function(jqXHR, textStatus) {
        toastr.error("Sorry, there was a problem getting development needs, please try again later.");
        errorFunction(jqXHR.responseJSON.error);
	});
}

function addDevelopmentNeedAction(userId, data, successFunction, errorFunction){
	var url = ADD_DEVELOPMENT_NEED + "/" + userId;
	var request = $post(url, data);
	request.done( function(response){
		successFunction(response);
	})
	request.fail(function(jqXHR, textStatus) {
        toastr.error("Sorry, there was a problem adding development needs, please try again later.");
        errorFunction(jqXHR.responseJSON.error);
	});
}

function editDevelopmentNeedAction(userId, data, successFunction, errorFunction){
	var url = EDIT_DEVELOPMENT_NEED + "/" + userId;
	var request = $post(url, data);
	request.done( function(response){
		successFunction(response);
	})
	request.fail(function(jqXHR, textStatus) {
        toastr.error("Sorry, there was a problem editing development needs, please try again later.");
        errorFunction(jqXHR.responseJSON.error);
	});
}

function editDevelopmentNeedProgressAction(userId, data, successFunction, errorFunction){
	var url = EDIT_DEVELOPMENT_NEED_PROGRESS + "/" + userId;
	var request = $post(url, data);
	request.done( function(response){
		successFunction(response);
	})
	request.fail(function(jqXHR, textStatus) {
        toastr.error("Sorry, there was a problem editing development needs, please try again later.");
        errorFunction(jqXHR.responseJSON.error);
	});
}

function deleteDevelopmentNeedAction(userId, data, successFunction, errorFunction){
	var url = DELETE_DEVELOPMENT_NEED + "/" + userId;
	var request = $post(url, data);
	request.done( function(response){
		successFunction(response);
	})
	request.fail(function(jqXHR, textStatus) {
        toastr.error("Sorry, there was a problem deleting development needs, please try again later.");
        errorFunction(jqXHR.responseJSON.error);
	});
}

function editDevNeedArchiveAction(userId, data, successFunction, errorFunction){
	var url = EDIT_DEVELOPMENT_NEED_ARCHIVE + "/" + userId;
	var request = $post(url, data);
	request.done( function(response){
		successFunction(response);
	})
	request.fail(function(jqXHR, textStatus) {
        toastr.error("Sorry, there was a problem editing development needs, please try again later.");
        errorFunction(jqXHR.responseJSON.error);
	});
}

