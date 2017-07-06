const LOG_ME_IN = "/logMeIn";

function logMeInAction(successFunction, errorFunction){
	var url = LOG_ME_IN;
	var request = $get(url);
	request.done( function(data){
		if(data.employeeID == "undefined" || data.employeeID == "" || data.employeeID == null || data.employeeID == "null"){
			window.location.replace("/error-page?code=1001");
			return;
		}
		successFunction(data)
	})
	request.fail(function(jqXHR, textStatus) {
		if(jqXHR.responseJSON === undefined){
			window.location.replace("/error-page?code=1002");
			return
		}
        errorFunction(jqXHR.responseJSON.error);
	});
}