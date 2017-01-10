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
    $.ajax({
        url: "http://"+getEnvironment()+":8080/addProposedObjective/"+userID,
        method: 'POST',
        xhrFields: {'withCredentials': true},
        data: {
            'title': objTitle,
            'description': objText,
            'completedBy': objDate,
            'emails': proposedTo
        },            
        success: function(response){
            if(response.indexOf("Objective Proposed for") !== -1 && response.indexOf("Error") !== -1){
            	toastr.warning(response);
               }else if(response.indexOf("Error") !== -1){   
                toastr.error(response);
               }else{
                toastr.success(response);
               }
           },
           
           error: function(XMLHttpRequest, textStatus, errorThrown){
            toastr.error(XMLHttpRequest.responseText);
        },
    });
}
