$(function() {

	
	$("sidebar").resizable();
	loadProfile();
	
	highlight($("#section").text());
	
	//Initialising the date picker
	initDatePicker('objective', new Date());
    
    tags('requestingTo');
    keypress('requestFeedbackModal');

    //click to open up feedback request modal
    $('#request-feedback').click(function(){ openRequestFeedbackModal() });
    
    //modal validation.
	$('.objective-modal-validate').keyup(function() { validateForm('objective-modal-validate', 'submit-obj'); });
    
    //onClick for Submit modal
	$('#submit-obj').click(function(){ clickSubmitObjective(); });
    
    //click to submit feedback request
    $('#submit-request-feedback').click(function(){ 
       if (validEmails($('#requestingTo').val())){
            submitFeedbackRequest();
        }else{
            toastr.error("One or more email addresses entered are not valid");
        }    
     });
    
    //when these are clicked it clears the feedback request modal
    $(".close").click(function() {
        $("textarea").val("");
        $("#requestingTo").tagsinput('removeAll');
    });
    $("#cancel").click(function() {
        $("textarea").val("");
        $("#requestingTo").tagsinput('removeAll');
    });
    
    //click to open a modal that shows the feedback email template
    $("#view-feedback-template").click(function(){ $('#emailTemplateModal').modal('show') });
    
        
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

function openRequestFeedbackModal(){
    $('#requestFeedbackModal').modal({backdrop: 'static', keyboard: false, show: true});
}

//validates to ensure email format
function isValidEmailAddress(requestingTo){
    var pattern = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return pattern.test(requestingTo);
}

function validEmails(requestingTo){
    var isValid = true;
    var result = requestingTo.split(",");
        $.each(result, function(key, val){
            isValid = isValidEmailAddress(val);
            return isValid;    
        });
    return isValid;
}  

//Email details sent through back-end.
function submitFeedbackRequest(){
	var url = "http://127.0.0.1:8080/generateFeedbackRequest/"+getADLoginID();
	var data = {};
	data["emailsTo"] = $('#requestingTo').val();
	data["notes"] = $('#requestingText').val();
  
	var settings = {
	  "url": url,
	  "method": "POST",
	  "data": data
	}
	$.ajax(settings).done(function (response) {
	  toastr.success(response);
	});
    
    $('#request-feedback').click(function() {
        $("textarea").val("");
        $("#requestingTo").tagsinput('removeAll');
    });
    $('#requestFeedbackModal').modal('hide');
}

//function to open Proposed objective modal
function openProposedObjectiveModal(){
    $("#obj-modal-type").val('propose');
	setObjectiveModalContent('', '', '', getToday(), 0, 2);
	showObjectiveModal(true);
}

function proposedToHTML(){
    var HTML= " \
        <label for='proposed-obj-to'>To*:</label> \
            <input type='text' class='form-control' id='proposed-obj-to' maxlength='150' />";
    return HTML;
}

function proposeObjective(userID, objTitle, objText, objDate, proposedTo){
    var url = "http://127.0.0.1:8080/addProposedObjective/"+userID;
    var data = {};
    data["title"] = objTitle;
    data["description"] = objText;
    data["completedBy"] = objDate;
    data["emails"] = proposedTo;

    var settings = {
	  "url": url,
	  "method": "POST",
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
//	$.get( "http://localhost:8000/components/"+section+"/"+section+".html", function( data ) {
//		  $( "#myapp" ).html( data );
//		}).fail(function() {
//			 toastr.error("Sorry could not load page, please try again later");
//		});
//
//}


