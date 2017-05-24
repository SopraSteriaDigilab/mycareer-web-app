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

function addDevelopmentNeedAction(userId, title, description, category, dueDate, successFunction, errorFunction){
	var url = ADD_DEVELOPMENT_NEED + "/" + userId;
	var data =  {
        title: title,
        description: description,
        category: category,
        dueDate: dueDate
    }
	var request = $post(url, data);
	request.done(function(response){
		toastr.success("Development Need inserted");
		successFunction(response);
	})
	request.fail(function(jqXHR, textStatus) {
        toastr.error(jqXHR.responseJSON.error);
        errorFunction(jqXHR.responseJSON.error);
	});
}

function editDevelopmentNeedAction(userId, developmentNeedId, title, description, category, dueDate, successFunction, errorFunction){
	var url = EDIT_DEVELOPMENT_NEED + "/" + userId;
	var data = {
		developmentNeedId: developmentNeedId,
        title: title,
        description: description,
        category: category,
        dueDate: dueDate
    }
	var request = $post(url, data);
	request.done(function(response){
		toastr.success(response);
		successFunction(response);
	})
	request.fail(function(jqXHR, textStatus) {
        toastr.error(jqXHR.responseJSON.error);
        errorFunction(jqXHR.responseJSON.error);
	});
}

function editDevelopmentNeedProgressAction(userId, developmentNeedId, progress, comment, successFunction, errorFunction){
	var url = EDIT_DEVELOPMENT_NEED_PROGRESS + "/" + userId;
	var data =  {
        developmentNeedId: developmentNeedId,
        progress: progress,
        comment: comment
    }
	var request = $post(url, data);
	request.done(function(response){
		toastr.success(response);
		successFunction(response);
	})
	request.fail(function(jqXHR, textStatus) {
        toastr.error(jqXHR.responseJSON.error);
        errorFunction(jqXHR.responseJSON.error);
	});
}

function deleteDevelopmentNeedAction(userId, developmentNeedId, comment, successFunction, errorFunction){
	var url = DELETE_DEVELOPMENT_NEED + "/" + userId;
	var data =  {
        developmentNeedId: developmentNeedId,
        comment: comment,
    }
	var request = $post(url, data);
	request.done(function(response){
		toastr.success(response);
		successFunction(response);
	})
	request.fail(function(jqXHR, textStatus) {
        toastr.error(jqXHR.responseJSON.error);
        errorFunction(jqXHR.responseJSON.error);
	});
}

function editDevNeedArchiveAction(userId, developmentNeedId, successFunction, errorFunction){
	var url = EDIT_DEVELOPMENT_NEED_ARCHIVE + "/" + userId;
	var data =  {
		developmentNeedId: developmentNeedId
    }
	var request = $post(url, data);
	request.done(function(response){
		toastr.success(response);
		successFunction(response);
	})
	request.fail(function(jqXHR, textStatus) {
        toastr.error(jqXHR.responseJSON.error);
        errorFunction(jqXHR.responseJSON.error);
	});
}

