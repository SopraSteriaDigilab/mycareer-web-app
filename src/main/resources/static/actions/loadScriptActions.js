const SERVER = "server";
const LOCAL = "local";
const EMPTY_STRING ="";

const PROD_PATH = "../dist/{0}/{0}.min.js";
const DEV_PATH = "../components/{0}/{0}.js";

function loadScript(script){
	console.log("getHost --> " + getHost());
	console.log("envText--> " + $("#env").text());
	if(getHost() === SERVER){
		console.log("getting minified script")
		$.getScript(String.format(PROD_PATH, script));
	}else{
		console.log("getting dev script")
		$.getScript(String.format(DEV_PATH, script));
	}
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