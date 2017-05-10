const LOG_ME_IN = "/logMeIn";

function logMeInAction(successFunction, errorFunction){
	var url = LOG_ME_IN;
	var request = $get(url);
	request.done( function(data){ 
		successFunction(data)
	})
	request.fail(function(jqXHR, textStatus) {
        errorFunction(jqXHR.responseJSON.error);
	});
}