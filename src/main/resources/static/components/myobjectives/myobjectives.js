$(function() {
	
	//Get list of objectives
	getObjectivesList(getADLoginID());
    
	//Load competencies section
	$( "#competencies" ).load( "../components/myobjectives/competencies/competencies.html" );
	
	//Initialising the date picker
	initDatePicker('objective', new Date());
	
	//onClick for opening modal
	$('#add-obj').click(function() { openAddObjectiveModal(); });
	
	//modal validation.
	$('.objective-modal-validate').keyup(function() { validateForm('objective-modal-validate', 'submit-obj'); });
	
	//onClick for Submit modal
	$('#submit-obj').click(function(){ clickSubmitObjective(); });

    //Navigation Pills to show All/Awaiting/InFlight/Done objectives
    $("#navTab").click(function(){});

});

var lastObjID = 0;

//HTTP request for INSERTING an objective to DB
function addObjectiveToDB(userID, objTitle, objText, objDate, proposedBy){
	var url = "http://127.0.0.1:8080/addObjective/"+userID;
	var data = {};
	data["title"] = objTitle;
	data["description"] = objText;
	data["completedBy"] = objDate;
    data["proposedBy"] = proposedBy;
  
	var settings = {
	  "url": url,
	  "method": "POST",
	  "data": data
	}

	$.ajax(settings).done(function (response) {
	  toastr.success(response);
	});
  
}

//HTTP request for UPDATING an objective in DB
function editObjectiveOnDB(userID, objID, objTitle, objText, objDate, objStatus, proposedBy){
	var url = "http://127.0.0.1:8080/editObjective/"+userID;
	var data = {};
	data["objectiveID"] = objID;
	data["title"] = objTitle;
	data["description"] = objText;
	data["completedBy"] = objDate;
	data["progress"] = objStatus;
    data["proposedBy"] = proposedBy;
  
	var settings = {
	  "url": url,
	  "method": "POST",
	  "data": data
	}

	$.ajax(settings).done(function (response) {
	  toastr.success(response);
	});
}


//Function to set up and open ADD objective modal
function openAddObjectiveModal(){
	$("#obj-modal-type").val('add');
	setObjectiveModalContent('', '', '', getToday(), 0, 0);
	showObjectiveModal(true);
}

//Function to set up and open EDIT objective modal
function openEditObjectiveModal(id){
	$("#obj-modal-type").val('edit');
	var objID = id;
	var objTitle = $('#obj-title-'+id).text().trim();
	var objText = $('#obj-text-'+id).text().trim();
	var objDate = $('#obj-date-'+id).text().trim();
	var objStatus = $('#obj-status-'+id).val();
	objDate = reverseDateFormat(objDate);
	setObjectiveModalContent(objID, objTitle, objText, objDate, objStatus, 1);
	showObjectiveModal(true);
}


//Method to handle the submit objective button
function clickSubmitObjective(){
	var type = $("#obj-modal-type").val();
    
	var userID = getADLoginID();
	var objID = $("#objective-id").val();
	var objTitle = $("#objective-title").val().trim();
	var objText = $("#objective-text").val().trim();
	var objDate = $("#objective-date").val().trim();
//	alert(objDate);
	var objStatus = parseInt($("#objective-status").val());
	var objIsArchived = $("#objective-is-archived").val();

	if(type === 'add'){
		addObjectiveToDB(userID, objTitle, objText, objDate, getADfullName());
		addObjectiveToList((++nextObjID), objTitle, objText, formatDate(objDate), objStatus, objIsArchived, getADfullName());
        showObjectiveModal(false);
	}else if (type === 'edit'){
		editObjectiveOnDB(userID, objID, objTitle, objText, objDate, objStatus, getADfullName());
		editObjectiveOnList(userID, objID, objTitle, objText, objDate,objStatus);
        showObjectiveModal(false);
	}else{
        var proposedTo = $("#proposed-obj-to").val().trim(); 
         if (validEmails(proposedTo)){
             proposeObjective(userID, objTitle, objText, objDate, proposedTo);
             showObjectiveModal(false);
        }else{
          toastr.error("One or more email addresses entered are not valid");
          showObjectiveModal(true);
        }  
       
    }
	
}

//Function to add objective to list
function addObjectiveToList(id, title, description, expectedBy, status, isArchived, proposedBy){

	var listID = "";
		if(isArchived === true || isArchived === 'true'){
			listID = "obj-archived";
		}else{
			switch(parseInt(status)){
				case 0: 
					listID = statusListDivIDs[status];
					break;
				case 1: 
					listID = statusListDivIDs[status];
					break;
				case 2: 
					listID = statusListDivIDs[status];
					break;
			}
		}

	lastObjID = id;
	$("#"+listID).append(objectiveListHTML(id, title, description, expectedBy, status, isArchived, proposedBy));
}

//Function to update objective on list
function editObjectiveOnList(userID, objID, title, text, date, status){
	$('#obj-title-'+objID).text(title);
	$('#obj-text-'+objID).text(text);
	$('#obj-date-'+objID).text('').append('<h6 class="pull-right"><b>' + formatDate(date) + '</b></h6>');
	$('#obj-status-'+objID).val(status);
}

//Method to set and show content of modal
function setObjectiveModalContent(id, title, text, date, status, type){
    if (type == 2){
        $('#proposedTo').html(proposedToHTML());
         tags('proposed-obj-to');
         keypress('objective-modal');
    }else{
        $('#proposedTo').html("");
    }
	$('#obj-modal-title-type').text(modalStatusList[type]);
	$("#objective-id").val(id);
	$("#objective-title").val(title);
	$("#objective-text").val(text);
	$("#objective-date").val(date);
	$("#objective-status").val(status);
	$('#submit-obj').prop("disabled", enableSubmit(type));
}

//Method to show/hide objective modal
function showObjectiveModal(show){
	if(show){
		$('#objective-modal').modal({backdrop: 'static', keyboard: false, show: true});
	}else{
		setObjectiveModalContent('', '', '', getToday(), 0 , 0);
        $('#proposed-obj-to').val("");
		$('#objective-modal').modal('hide');
	}
}

//Method to handle the archive objective button
function clickArchiveObjective(objID, archive){
	$('#obj-is-archived-'+objID).val(archive);
	editObjectiveArchiveOnDB(objID, archive);
	updateObjectiveList(objID);
}

function editObjectiveArchiveOnDB(objID, archive){
	var url = "http://127.0.0.1:8080/changeStatusObjective/"+getADLoginID();;
	var data = {};
	data["objectiveID"] = objID;
	data["isArchived"] = archive;
  
	var settings = {
	  "url": url,
	  "method": "POST",
	  "data": data
	}

	$.ajax(settings).done(function (response) {
		toastr.success(response);
	});
}

function updateObjectiveList(objID){
	var title = $('#obj-title-'+objID).text();
	var description = $('#obj-text-'+objID).text();
	var expectedBy = $('#obj-date-'+objID).text();
	var status = $('#obj-status-'+objID).val();
	var archive = $('#obj-is-archived-'+objID).val();
//	alert(title + " : " + status + " : " + archive);
	
	$("#objective-item-"+objID).fadeOut(400, function() { $(this).remove(); });
	addObjectiveToList(objID, title, description, expectedBy, status, archive);
	
	
}



//onclick to view feedback
function clickObjectiveFeedback(id){
	window.location.replace("http://localhost:8000/mycareer/feedback"); 
}

function updateObjectiveStatusOnDB(objID, objStatus){
	if($('#obj-is-archived-'+objID).val() === 'true' || $('#obj-is-archived-'+objID).val() == true
			|| objStatus === parseInt($('#obj-status-'+objID).val())){
		return false;
	}

	var userID = getADLoginID();
	var objTitle = $('#obj-title-'+objID).text();
	var objText = $('#obj-text-'+objID).text();
	var objDate = $('#obj-date-'+objID).text();
	objDate = reverseDateFormat(objDate);
	$('#obj-status-'+objID).val(parseInt(objStatus));
	
	editObjectiveOnDB(userID, objID, objTitle, objText, objDate, objStatus);
//	updateStatusOnList(objID, objStatus);
	updateObjectiveList(objID);
}
//
//function updateStatusOnList(objID, objStatus){
//	switch(parseInt(objStatus)){
//		case 0:
//			$('#started-obj-dot-'+objID).removeClass('complete');
//			$('#complete-obj-dot-'+objID).removeClass('complete');
//			break;
//		case 1:
//			$('#started-obj-dot-'+objID).addClass('complete');
//			$('#complete-obj-dot-'+objID).removeClass('complete');
//			break;
//		case 2:
//			$('#started-obj-dot-'+objID).addClass('complete');
//			$('#complete-obj-dot-'+objID).addClass('complete');
//	}
//	
//	
//}



//Function that returns objective list in html format with the parameters given
function objectiveListHTML(id, title, description, timeToCompleteBy, status, isArchived, proposedBy){
	var html = " \
    <div class='panel-group' id='objective-item-"+id+"'> \
        <div class='panel panel-default' id='panel'> \
        <input type='hidden' id='obj-status-"+id+"' value='"+status+"'> \
        <input type='hidden' id='obj-is-archived-"+id+"' value='"+isArchived+"'> \
        	<div class='panel-heading'> \
            	<div class='row'> \
            		<div class='col-sm-6'> \
	            		<div class='row'> \
		            		<div class='col-sm-6' id='obj-no-"+id+"'><h6><b>#"+id+"</b></h6></div> \
		            		<div class='col-sm-6' id='obj-date-"+id+"'><h6 class='pull-right'><b>"+timeToCompleteBy+"</b></h6></div> \
	            		</div> \
	            		<div class='row'> \
		            		<div class='col-sm-12 wrap-text' id='obj-title-"+id+"'>"+title+"</div> \
	            		</div> \
            		</div> \
            		<div class='col-sm-5 bs-wizard'> \
            			 <div class='col-xs-4 bs-wizard-step complete' id='proposed-obj-dot-"+id+"' onClick='updateObjectiveStatusOnDB("+id+", 0)'> \
					      <div class='text-center' id='test'><h6>Proposed</h6></div> \
					      <div  class='bs-wizard-dot-start' style='cursor:pointer'></div> \
					     </div> \
					     <div class='col-xs-4 bs-wizard-step "+ checkComplete(status, 1) +"' id='started-obj-dot-"+id+"' onClick='updateObjectiveStatusOnDB("+id+", 1)'> \
					       <div class='text-center'><h6>Started</h6></div> \
					       <div class='progress'><div class='progress-bar'></div></div> \
					       <div  class='bs-wizard-dot-start' style='cursor:pointer'></div> \
					       <div  class='bs-wizard-dot-complete' style='cursor:pointer'></div> \
					     </div> \
					     <div class='col-xs-4 bs-wizard-step  "+ checkComplete(status, 2) +"' id='complete-obj-dot-"+id+"' onClick='updateObjectiveStatusOnDB("+id+", 2)'> \
					       <div class='text-center'><h6>Completed</h6></div> \
					       	 <div class='progress'><div class='progress-bar'></div></div> \
					        <div class='bs-wizard-dot-start' style='cursor:pointer'></div> \
					        <div  class='bs-wizard-dot-complete' style='cursor:pointer'></div> \
					     </div> \
            		</div> \
            		<div class='col-sm-1 chev-height'> \
					  <a data-toggle='collapse' href='#collapse-obj-"+id+"' class='collapsed'></a> \
					</div> \
            	</div> \
            </div> \
        \
            <div id='collapse-obj-"+id+"' class='panel-collapse collapse'> \
    \
                <div class='panel-body'> \
                    <div class='row'> \
                        <div class='col-md-4'> \
                            <h5><b>Description</b></h5> \
                        </div> \
                        <div class='col-md-3'> \
                        </div> \
                        <div class='col-md-5 pull-right'> \
                            <h6><b>Proposed by: </b>"+proposedBy+"</h6> \
                        </div> \
                    </div> \
                    <div class='row'> \
                        <div class='col-md-12 wrap-text'> \
                            <p id='obj-text-"+id+"'>"+description+"</p> \
                        </div> \
                    </div> \
                    " + objectivesButtonsHTML(id, isArchived); + " \
                </div> \
            </div> \
         \
        </div> \
    </div> \
    "
                            
    return html;
}

function objectivesButtonsHTML(id, isArchived){
	var HTML = " \
    <div class='col-md-12'> \
		<div class='col-sm-6'> \
        	<button type='button' class='btn btn-block btn-default pull-left'  onClick='clickArchiveObjective("+id+", true)' id='archive-obj'>Archive</button> \
        </div> \
        <div class=' col-sm-6'> \
        	<button type='button' class='btn btn-block btn-default' onClick='openEditObjectiveModal("+id+")'>Edit</button> \
        </div> \
    </div> \
"
//        	alert(isArchived);
//	if(isArchived == true || isArchived === 'true'){
//		return("");
//	}
	if(isArchived === true || isArchived ==='true'){
		var unArchiveButton = " \
		    <div class='col-md-12'> \
		        <div class=' col-sm-6 pull-right'> \
		        	<button type='button' class='btn btn-block btn-default pull-left'  onClick='clickArchiveObjective("+id+", false)' id='archive-obj'>Restore</button> \
		        </div> \
		    </div> \
		"
		return(unArchiveButton);
	}
	return(HTML);
}





//Method for updating progress bar wth a value
//function updateProgressBar(value){
//	$('#objStatus').width(value + "%");
//}


// Progress bar not in first sprint
//function updateNewProgressBar(score){
//
//	if(score > 0){
//		$('#feedback-progress-1').removeClass("progress-bar-danger");
//		$('#feedback-progress-1').addClass("progress-bar-success");
//		$('#feedback-progress-1').css('margin-left', (50 +'%'));
//		$('#feedback-progress-1').width(score + '%')
//	}else{
//		$('#feedback-progress-1').removeClass("progress-bar-success");
//		$('#feedback-progress-1').addClass("progress-bar-danger");
//		$('#feedback-progress-1').css('margin-left', (50 + score) + '%');
//		$('#feedback-progress-1').width(-score + '%')
//	}
//
//
//}


//function isEmpty(value, className){
//	if(!value){
//		$('#' + className).addClass("has-error");
//		return true;
//	}else{
//		$('#' + className).removeClass("has-error");
//		return false;
//	}
//}


//<div class='row'> \
//<div class='col-md-6'> \
//  <div class='bottomless progress progress-striped'> \
//      <div class='progress-bar progress-bar-success progress-middle' id='personal-progress-1' role='progressbar' aria-valuemin='0' aria-valuemax='100'></div> \
//  </div> \
//</div> \
//<div class='col-md-6'> \
//  <div class='bottomless progress progress-striped'> \
//      <div class='progress-bar progress-bar-success progress-middle' id='feedback-progress-1' role='progressbar' aria-valuemin='0' aria-valuemax='100'></div> \
//  </div> \
//</div> \
//</div> \
//<div class='col-sm-6'> \
//<button type='button' class='btn btn-block btn-default' onClick='clickObjectiveFeedback("+id+")'>View Feedback</button> \
//</div> \