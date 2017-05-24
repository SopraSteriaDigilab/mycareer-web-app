const GET_NOTES = "/getNotes";
const ADD_NOTE = "/addNote";
const ADD_NOTE_TO_REPORTEE = "/addNoteToReportee";

function getNotesAction(userId, successFunction, errorFunction){
	var url = GET_NOTES + "/" + userId;
	var request = $get(url);
	request.done( function(data){ 
		successFunction(data)
	})
	request.fail(function(jqXHR, textStatus) {
        toastr.error("Sorry, there was a problem getting development needs, please try again later.");
        errorFunction(jqXHR.responseJSON.error);
	});
}

function addNoteAction(userId, providerName, noteDescription, successFunction, errorFunction){
	var url = ADD_NOTE + "/" + userId;
	var data = {
        providerName: providerName,
        noteDescription: noteDescription
    }
	var request = $post(url, data);
	request.done(function(response){
		toastr.success("Note inserted");
		successFunction(response)
	})
	request.fail(function(jqXHR, textStatus) {
    	toastr.error(jqXHR.responseJSON.error);
    	errorFunction(jqXHR.responseJSON.error);
	});
}

function addNoteAction(userId, reporteeEmployeeID, providerName, noteDescription, successFunction, errorFunction){
	var url = MANAGER + ADD_NOTE_TO_REPORTEE + "/" + userId;
	var data = {
        reporteeEmployeeID: reporteeEmployeeID,
        providerName: providerName,
        noteDescription: noteDescription
    }
	var request = $post(url, data);
	request.done(function(response){
		toastr.success("Note inserted");
		successFunction(response)
	})
	request.fail(function(jqXHR, textStatus) {
    	toastr.error(jqXHR.responseJSON.error);
    	errorFunction(jqXHR.responseJSON.error);
	});
}