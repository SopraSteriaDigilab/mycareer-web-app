$(function() {
	
	populateProfile(getUserName(), getADfullName());

	
});

function populateProfile(userName, fullName){
	$("#userProfileName").append("<h4 class='profile-centre'>" + fullName + "</h4>");
	$("#userProfilePicture").append(getProfilePicture(userName, 48));
}


