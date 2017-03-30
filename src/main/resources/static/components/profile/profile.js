$(function() {
	populateProfile(getUserName(), getADfullName());

	//onClick for opening modal
	$('.pdf').click(function() {
		var id = event.target.id;
		if(id=== "objPDF"){			
			 getObjectivesData();
			 $('#print-modal-title-type').text('Objectives');
		}
		else if(id=== "feedPDF"){
			 getFeedbacksData();
			 $('#print-modal-title-type').text('Feedback');
		}
		else if(id=== "devPDF"){
			 getDevelopmentNeedsData();
			 $('#print-modal-title-type').text('Development Needs'); 
		}
		else if(id=== "notesPDF"){
			 getNotesData();
			 $('#print-modal-title-type').text('Notes');
		}
		$("#pdf-modal-body").append("<div class=\"" + id + "\"></div>");
		openPrintModal();
	});
	
	//onClick for closing modal
	$('#close, #close-print-cross').on('click', function(e) { 
		$('#pdf-modal-body').empty();
		$(".dt-buttons").remove(); //Because the button (automatically generated by Datatables) is appened to .modal-footer each time. 
	});
});

//Function to set up and open print modal
function openPrintModal(){
	$('#print-modal').modal(
			{backdrop: 'static', keyboard: false, show: true}
	);
}

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