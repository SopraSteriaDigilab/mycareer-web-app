$(function() {
	initNavbar();
});

const EMAILS = "Email(s)*:";
const DISTRIBUTION_LIST = "Distribution List*:";

function initNavbar(){
	$("sidebar").resizable();
	loadProfile();
	
	highlight($("#section").text());
	
	//Initialising the date picker
	initDatePicker('objective', new Date());
    
    //modal validation.
	$('.objective-modal-validate').on('input', function() { validateForm('objective-modal-validate', 'submit-obj'); });
    
    //onClick for Submit modal
	$('#submit-obj').click(function(){ clickSubmitObjective(); });
	
	//onClick for Close modal
	$('#close-obj, #close-obj-cross').on('click', function(e) { clickCloseObjective(e); });
}

//Function to load profile section
function loadProfile(){
	$("#profile").load("../components/profile/profile.html");
	if(isUserManager() === "true" || isUserManager() == true){
		$("#nav-bar-list").append("<li class='nav-bar-item' id='myteam'><a href='myteam'> My Team </a></li>");
	};
    if(userHasHrDash() === "true" || userHasHrDash() == true){
        $("#nav-bar-list").append("<li class='nav-bar-item' id='hrdashboard'><a href='hrdashboard'> HR Dashboard </a></li>"); 
    }
	$(".full-name").html(getADfullName);
}

function highlight(value) {
	$('.nav-bar-item').each(function(i) {
		if(value === this.id) {
			$("#"+this.id).addClass("selected");
		}else{
			$("#"+this.id).removeClass("selected");
		}
	})
}


