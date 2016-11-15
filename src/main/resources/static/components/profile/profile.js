$(function() {
	
	populateProfile(getUserName(), getADUserName());

	
});

function populateProfile(userName, ADUserName){
	$("#userProfileName").append("<h4 class='profile-centre'>" + ADUserName + "</h4>");
	$("#userProfilePicture").append("<img class='backup_picture' src='http://mysite.corp.sopra/User%20Photos/Images%20du%20profil/"
									+ userName + "_SThumb.jpg?t=1479114656424' alt='' onerror='imgError(this);'> ");
}

function imgError(image){
		image.onerror=false;
    	image.src = "http://teams.duns.uk.sopra/_layouts/15/images/PersonPlaceholder.42x42x32.png?";
    	image.style = "min-width:48px; min-height:48px; clip:rect(0px, 48px, 48px, 0px); max-width:48px";
    	return true;
}
