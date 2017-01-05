$(function() {

	
	$("sidebar").resizable();
	loadProfile();
	
	highlight($("#section").text());
	
	//Initialising the date picker
	initDatePicker('objective', new Date());
    
    //modal validation.
	$('.objective-modal-validate').keyup(function() { validateForm('objective-modal-validate', 'submit-obj'); });
    
    //onClick for Submit modal
	$('#submit-obj').click(function(){ clickSubmitObjective(); });
        
});

//Function to load profile section
function loadProfile(){
	$("#profile").load("../components/profile/profile.html");
	if(isUserManager() === "true" || isUserManager() == true){
		$("#nav-bar-list").append("<li class='nav-bar-item' id='myteam'><a href='myteam'> My Team </a></li>");
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
	});

}

//function to open Proposed objective modal
function openProposedObjectiveModal(){
    $("#obj-modal-type").val('propose');
	setObjectiveModalContent('', '', '', getToday(), 0, 2);
	showObjectiveModal(true);
}

function proposedToHTML(){
    var HTML= " \
        <label for='proposed-obj-to'>Email*:</label> \
            <input type='text' class='form-control' id='proposed-obj-to' maxlength='150' />";
    return HTML;
}

function proposeObjective(userID, objTitle, objText, objDate, proposedTo){
    var url = "http://"+getEnvironment()+":8080/addProposedObjective/"+userID;
    var data = {};
    data["title"] = objTitle;
    data["description"] = objText;
    data["completedBy"] = objDate;
    data["emails"] = proposedTo;

    var settings = {
	  "url": url,
	  "method": "POST",
	  xhrFields: {'withCredentials': true},
	  "data": data
	}
	$.ajax(settings).done(function (response) {
	  toastr.success(response);
	});
    
}


//$("#objectives").click(function() {
//window.history.pushState("objectives","objectives", "myobjectives");
//loadPage("myobjectives");
//highlight('objectives');
//});
//
//$("#feedback").click(function() {
//window.history.pushState("feedback","feedback", "myfeedback");
//loadPage("myfeedback");
//highlight('feedback');
//});
//
//$("#development-needs").click(function() {
//window.history.pushState("developmentneeds","developmentneeds", "mydevelopmentneeds");
//loadPage("mydevelopmentneeds");
//highlight('development-needs');
//});
//
//
//
//function loadPage(section){
//	$.get( "http://"+getEnvironment()+":8000/components/"+section+"/"+section+".html", function( data ) {
//		  $( "#myapp" ).html( data );
//		}).fail(function() {
//			 toastr.error("Sorry could not load page, please try again later");
//		});
//
//}


