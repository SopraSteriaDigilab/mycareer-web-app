$(function() {
	populateProfile(getUserName(), getADfullName());

	//onClick for opening modal
	$('.pdf').click(function() {
		var id = event.target.id;
		
		if(id=== "objPDF"){
			 getObjectivesData();
			 $('#print-modal-title-type').text('Objectives')
		}
		else if(id=== "feedPDF"){
			 $('#print-modal-title-type').text('Feedbacks')
		}
		else if(id=== "devPDF"){
			 $('#print-modal-title-type').text('Development Needs')
		}
		else if(id=== "notesPDF"){
			 $('#print-modal-title-type').text('Notes')
		}
		$(".modal-body").append("<div class=\"" + id + "\"></div>");
		openPrintModal();
	});
	
	
	//onClick for Print modal
	$('#print').click(function(){ clickPrint(); });
	
  //onClick for Close modal
	$('#close, #close-print-cross').on('click', function(e) { clickClosePrint(e); });
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

//function that shows the HR Overview list when clicked
function showTable(){
    if ($("#objTable").hasClass("hidden")){
         $("#objTable").removeClass("hidden");        
    }
}

//Function to set up and open print modal
function openPrintModal(){
	$('#print-modal').modal({backdrop: 'static', keyboard: false, show: true});
	//showPrintModal(true);
}

////Method to show/hide print modal
//function showPrintModal(show){
//	if(show){
//		
//	}else{
//		$('#print-modal').modal('hide');
//	}
//}

/*
//Function to set up and open print objective modal
function openPrintObjectiveModal(){
	$("#print-modal-type").val('obj');
	setPrintModalContent('', '', '', getToday(), 0, 0);
	showPrintModal(true);
}

//Function to set up and open print feedback modal
function openPrintFeedbackModal(){
	$("#print-modal-type").val('feed');
	setPrintModalContent(objID, objTitle, objText, objDate, objStatus, 1);
	showPrintModal(true);
}

function devNeedsButtonsHTML(devNeedID, isArchived){
	var HTML = " \
    <div class='col-md-12'> \
		<div class='col-sm-6'> \
        	<button type='button' class='btn btn-block btn-default pull-left'  onClick='clickArchiveDevNeed("+devNeedID+", true)' id='archive-dev-need'>Archive</button> \
        </div> \
        <div class=' col-sm-6'> \
        	<button type='button' class='btn btn-block btn-default' onClick='openEditDevelopmentNeedModal("+devNeedID+")'>Edit</button> \
        </div> \
    </div> \
";
	if(isArchived === true || isArchived ==='true'){
		var unArchiveButton = " \
		    <div class='col-md-12'> \
		        <div class=' col-sm-6 pull-right'> \
		        	<button type='button' class='btn btn-block btn-default pull-left'  onClick='clickArchiveDevNeed("+devNeedID+", false)' id='archive-dev-need'>Restore</button> \
		        </div> \
		    </div> \
		";
		return(unArchiveButton);
	}
	return(HTML);
}

function clickPrint(){
	var type = $("#dev-need-modal-type").val();
	
	var userID = getADLoginID();
	var devNeedID = $("#development-need-id").val();
	var devNeedTitle = $("#development-need-title").val().trim();
	var devNeedText = $("#development-need-text").val().trim();
	var devNeedCategory = $('#category-radio input:radio:checked').val();
	var devNeedDate =  $("#development-need-date").val().trim();
	var devNeedStatus =  parseInt($("#development-need-status").val());
	
	if(checkIfPastDate(devNeedDate) || checkEmpty("development-need-modal-validate", true)){ return false; }

	if(type == 'add'){
		addDevelopmentNeedToDB(userID, devNeedTitle, devNeedText, devNeedCategory, devNeedDate);
	}else{
		editDevelopmentNeedOnDB(userID, devNeedID, devNeedTitle, devNeedText, devNeedCategory, devNeedDate, devNeedStatus);
	}
	showDevelopmentNeedModal(false);
}
*/