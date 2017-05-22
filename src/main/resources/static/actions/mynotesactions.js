const GET_NOTES = "/getNotes";

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

