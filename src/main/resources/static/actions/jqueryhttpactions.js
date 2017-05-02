/**
 *Ajax GET call
 * 
 * @param path path of the get request
 */
function $get(path){
    return $.ajax({
        url: 'http://'+getEnvironment()+path,
        cache: false,
        method: 'GET',
        xhrFields: {'withCredentials': true}
    });
}