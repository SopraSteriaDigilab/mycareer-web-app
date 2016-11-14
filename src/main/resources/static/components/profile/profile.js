$(function() {
//	alert(getADUserName());
	
	populateProfile(getUserName(), getADUserName());
	
	
});

function populateProfile(userName, ADUserName){
	$("#userProfileName").append("<h4 class='profile-centre'>" + ADUserName + "</h4>");
	$("#userProfilePicture").append("<img src='http://mysite.corp.sopra/User%20Photos/Images%20du%20profil/"
									+ userName + "_SThumb.jpg?t=1479114656424' alt='...'>");
}
