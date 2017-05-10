/**
 *Ajax GET call
 * 
 * @param path path of the get request
 */
function $get(path){
    return $.ajax({
		//async: false, //needed? Test on dev/uat
    	//crossDomain: true, //needed? Test on dev/uat
        url: 'http://'+getEnvironment()+path,
        cache: false,
        method: 'GET',
        xhrFields: {'withCredentials': true}
    });
}