const SERVER = "server";
const LOCAL = "local";
const EMPTY_STRING ="";

const PROD_SCRIPT_PATH = "../dist/{0}/{0}.min.js";
const DEV_SCRIPT_PATH = "../components/{0}/{0}.js";

const PROD_STYLE_PATH = "../dist/{0}/{0}.min.css";
const DEV_STYLE_PATH = "../components/{0}/{0}.css";

const STYLESHEET_LINK = "<link rel='stylesheet' type='text/css' href='{0}'/>";

function loadScript(component){
	var script = "";
	if(getHost() === SERVER){
		script = String.format(PROD_SCRIPT_PATH, component);
	}else{
		script = String.format(DEV_SCRIPT_PATH, component);
	}
	$.getScript(script);
	
}

function loadStyle(component){
	var styleSheet = "";
	if(getHost() === SERVER){
		styleSheet = String.format(PROD_STYLE_PATH, component)
	}else{
		styleSheet = String.format(DEV_STYLE_PATH, component)
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