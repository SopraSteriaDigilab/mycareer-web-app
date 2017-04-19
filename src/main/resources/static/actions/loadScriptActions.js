const SERVER = "server";
const LOCAL = "local";

const PROD_SCRIPT_PATH = "../dist/{0}.min.js"; // change to take in path
const DEV_SCRIPT_PATH = "../{0}.js"; // change to take in path

const PROD_STYLE_PATH = "../dist/{0}.min.css"; // change to take in path
const DEV_STYLE_PATH = "../{0}.css"; 

const STYLESHEET_LINK = "<link rel='stylesheet' type='text/css' href='{0}'/>";

function loadScript(path){ // TODO change to 'path' variable...
	var script = "";
	if(getHost() === SERVER){
		script = String.format(PROD_SCRIPT_PATH, path);
	}else{
		script = String.format(DEV_SCRIPT_PATH, path);
	}
	$.getScript(script);
	
}

function loadStyle(path){ //TODO mimic script
	var styleSheet = "";
	if(getHost() === SERVER){
		styleSheet = String.format(PROD_STYLE_PATH, path)
	}else{
		styleSheet = String.format(DEV_STYLE_PATH, path)
	}
	$(String.format(STYLESHEET_LINK, styleSheet)).appendTo("head");
}


function getHost(){
	var host = $("#env").text();
	if (host === "ldunsmycareerdev01" || host === "ldunsmycareeruat01" || host === "ldunsmycareer01") {
		return SERVER;
	}
	return LOCAL
}


//TODO move to a 'utils' class or something...
if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
}