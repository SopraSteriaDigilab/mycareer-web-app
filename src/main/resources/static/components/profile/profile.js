$(function() {
	
	populateProfile(getUserName(), getADfullName());
	
});

function populateProfile(userName, fullName){
	$("#userProfileName").append("<h4 class='profile-centre' >" + fullName + " ");
	$("#userProfilePicture").append(getProfilePicture(userName, 48))
							.append("<span class='caret'></span>");
	highlightProfileDropdown("#userProfilePicture, #userProfileName");
//	$("#userProfilePicture").append();
}


function highlightProfileDropdown(elements){
    $("#profile-container").hover(function(){
        $(elements).css("color", "#cacaca");
        }, function(){
        $(elements).css("color", "#FFF");
    });
}

