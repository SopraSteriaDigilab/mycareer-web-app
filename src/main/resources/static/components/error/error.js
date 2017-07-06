$(function() {
	initError();
});

var title = "";
var description = "";

var $title = $("#title");
var $description = $("#description");


function initError(){
	setErrorDetails(getUrlParameter("code"));
	$title.html(title);
	$description.html(description);
}



function getUrlParameter(name){
	var url = window.location.href;
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(url);
    if (!results) { 
        return undefined;
    }
	return results[1] || undefined;
}

function setErrorDetails(errorCode){
	switch (errorCode) {
		case "9999":
			title = "Exception";
			description = "A general exception has occured - please report this to Sopra Steria CSD enclosing this message as a screenshot.";
			break;
			
		case "1001":
			title = "Error 1001 - Authentication issue";
			description = "The system is unable to determine your user credentials.  If you have logged in via OnePortal or the Web Portal please close your browser and log back into OnePortal or the Web Portal again and try accessing MyCareer from the menu or via Face2Face.  If this problem persists please report this error to Sopra Steria CSD.";
			break;
	
		case "1002":
			title = "Error 1002 - Unable to Authenticate";
			description = "The system is unable to authenticate with the server.  If you have logged in via OnePortal or the Web Portal please close your browser and log back into OnePortal or the Web Portal again and try accessing MyCareer from the menu or via Face2Face.  If this problem persists please report this error to Sopra Steria CSD.";
			break;
			
		default:
			title = "System Error";
			description = "Please report this issue to CSD";
			break;
	}
}