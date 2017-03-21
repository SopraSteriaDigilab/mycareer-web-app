$(function() {
	
	populateProfile(getUserName(), getADfullName());
	openPDF();
	
});

function populateProfile(userName, fullName){
	$("#userProfileName").append("<h4 class='profile-centre' >" + fullName + " ");
	$("#userProfilePicture").append(getProfilePicture(userName, 48))
							.append("<span class='caret'></span>");
	highlightProfileDropdown("#userProfilePicture, #userProfileName");
}

function highlightProfileDropdown(elements){
    $("#profile-container").hover(function(){
        $(elements).css("color", "#cacaca");
        }, function(){
        $(elements).css("color", "#FFF");
    });
}

function openPDF() {
	$('.pdf').on('click', 'a', function() {
		var id = event.target.id;
		if(id=== "objPDF"){
			openObjPDF(); //eval converts the string to a variable name
		}
	});
}