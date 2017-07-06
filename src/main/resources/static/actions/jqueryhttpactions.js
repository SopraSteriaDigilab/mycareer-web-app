const MANAGER = "/manager";
const DATA = "/data";
const HR = "/hr";
const HISTORY = "/history";
/**
 *Ajax GET call
 * 
 * @param path path of the get request
 */
function $get(path){
	return $.ajax({
		url: 'http://' + getEnvironment() + path,
	    cache: false,
	    method: 'GET',
	    xhrFields: { withCredentials: true }
	});
}


/**
 *Ajax POST call
 * 
 * @param path path of the set request
 * @param data data of the set request
 */
function $post(path, data){
    return $.ajax({
        url: 'http://' + getEnvironment() + path,
        method: 'POST',
        xhrFields: { withCredentials: true },
        data: data
    });
}