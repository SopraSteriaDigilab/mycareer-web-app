/**
 *Ajax GET call
 * 
 * @param path path of the get request
 */
function $get(path, options){
	var basic = {
		url: 'http://' + getEnvironment() + path,
	    cache: false,
	    method: 'GET',
	    xhrFields: { withCredentials: true }
	}
	var settings = Object.assign({}, basic, options)
	return $.ajax(settings);
}


/**
 *Ajax POST call
 * 
 * @param path path of the get request
 */
function $post(path, data){
    return $.ajax({
        url: 'http://' + getEnvironment() + path,
        method: 'POST',
        xhrFields: { withCredentials: true },
        data: data
    });
}