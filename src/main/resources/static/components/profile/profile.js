$(function() {
	
	populateProfile(getUserName(), getADUserName());

	
});

function populateProfile(userName, ADUserName){
	$("#userProfileName").append("<h4 class='profile-centre'>" + ADUserName + "</h4>");
	$("#userProfilePicture").append(getProfilePicture(ADUserName, 48));
}


