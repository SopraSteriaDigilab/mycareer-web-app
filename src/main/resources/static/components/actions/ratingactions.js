function getCurrentRatingAction(userId, successFunction){
    $.ajax({
        url: 'http://'+getEnvironment()+'/getCurrentRating/'+userId,
        cache: false,
        method: 'GET',
        xhrFields: {'withCredentials': true},
        success: function(data){
        	successFunction(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){        	
            console.log('error', errorThrown);
            toastr.error("Sorry, there was a problem getting ratings, please try again later.");
        }
    });
}