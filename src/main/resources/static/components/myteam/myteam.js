$(function() {
	init();
});//End of Document Function

/** Constants */
const NO_REPORTEE_EVALUATION_ADDED = "No self evaluation was added.";
const NO_REPORTEE_EVALUATION_SUBMITTED = "Self evaluation has not yet been submitted."
const NO_MANAGER_EVALUATION = "No manager evaluation has been written.";
const NO_RATING = "No Rating Entered";
const RATING = "Rating: ";

/** DOM element references */
var $managerEvaluationOptions = $(".manager-evaluation-options");
var $managerEvaluationLabels = $(".manager-evaluation-labels");

var $managerEvaluationText = $("#manager-evaluation-text");
var $managerEvaluationInput = $("#manager-evaluation-input");
var $reporteeEvaluationText = $("#reportee-evaluation-text");
var $evaluationScoreText = $("#evaluation-score-text");
var $evaluationScoreInput = $("#evaluation-score-input");
var $reporteeEvaluationsSubmitted = $("#reportee-evaluation-submitted");
var $managerEvaluationSubmitted = $("#manager-evaluation-submitted");
var $managerEvaluationFooter = $("#manager-evaluation-footer");
var $managerOptions = $("#manager-options");

var $editButton = $("#edit-manager-evaluation");
var $submitButton = $("#submit-manager-evaluation");
var $saveButton = $("#save-manager-evaluation");
var $cancelButton = $("#cancel-manager-evaluation");

var $ratingsTab = $("#reportee-ratings-tab");

var wasManagerEvaluationEmpty = null;
var lastSavedManagerEvaluationInput = null;

var $activityFeed = $("#activity-feed");

var reporteeSectionHidden = true;
var selectedReporteeID = 0;
var selectedReporteeEmail = "";
var selectedReporteeName = "";
var selectedReporteeUsername = "";
var initialReporteeList = [];
var activityFeedVisible = false;
var editingRating = false;
var isEmailclicked=false;

function init(){
	checkRatingPeriod();
	getReportees(getADLoginID(), false);
	loadingProposedButton();
	getEmailList();
	initSelect();
	getActivityFeed();
	
	$('#add-reportee-note').click(function() { openAddReporteeNoteModal(); });	
	$('#submit-reportee-note').click(function(){ clickSubmitReporteeNote(); });
	
	$editButton.click(function(){ editManagerEvaluation(); });
	$submitButton.click(function(){ submitManagerEvaluation(); });
	$saveButton.click(function(){ saveManagerEvaluation(); });
	$cancelButton.click(function(){ clickClose(); });
	
	$('.reportee-note-validate').on('input', function() { validateForm('reportee-note-validate', 'submit-reportee-note'); });
	
	$('#proposedTo').on('mousedown', '.dropdown-item', function() {
		isEmailclicked=true;
	});
	
	$('#proposedTo').on('blur', 'input', function() {
		if (!isEmailclicked) {
			addTagOnBlur('.bootstrap-tagsinput > input','#proposed-obj-to');
	    }
		else{
			isEmailclicked=false;
		}
	})
}

//Method to get the Reportee list
function getReportees(userId, isSubReportee){
	if(isSubReportee) loadingSubReporteeList();
    $.ajax({
        url: 'http://'+getEnvironment()+'/manager/getReportees/'+userId,
        cache: false,
        method: 'GET',
        xhrFields: {'withCredentials': true},
        success: function(data){        	
        	if(!isSubReportee){
        		$("#reportee-list").empty();
            	$("#info-holder").append("<span id='info-message' class='text-center'><h5>Please select a reportee </h5></span>");
            	 $.each(data, function(key, val){
                 	addReporteeToList(val.employeeID, val.fullName, val.username, val.emailAddress);
                 });  
        	}else{
        		updateSelectedSubReportee(userId);
        		addSubReporteesToList(data);
        	}
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
        	$("#reportee-list").empty();
            toastr.error("Sorry, there was a problem getting reportees, please try again later.");
        }
    });
}

function getActivityFeed(){
	
	var id = getADLoginID();
	var success = function(data){ addActivityFeed(data); }
	var error = function(){}
	
	getActivityFeedAction(id, success, error);
}

function getReporteeDevelopmentNeedsList(userId){
	var success = function(data){ addDevelopmentNeedsToList(data); }
	var error = function(error){}
	
	getDevelopmentNeedsAction(userId, success, error);
}

function addActivityFeed(data){
	var activityHTML = "";
	if(data.length < 1) {
		activityHTML = "<h5 class='text-center'>No activity from your team.</h5>";
	}else{
		$.each(data, function(key, val){
			activityHTML += activityFeedItem(shortenTitleActivityFeed(val.description), moment(val.timestamp).format('DD MMM YYYY HH:mm'));
		});
	}
	$activityFeed.html(activityHTML);
}

function shortenTitleActivityFeed(description){
	var i = description.indexOf(":");
	var action = description.substring(0, i);
	var title = description.substring(i, description.length);
	if(title.length > 25)
		title = title.substring(0, 25) + "...";
	
	return action + " " + title;
}

function loadingSubReporteeList(){
	$('#reportee-sub-selected').html("<h5>Loading...</h5>");
	$('#reportee-sub-list').empty();
}

//method to remove apostrophe from names so can be clicked on in my team
function removeApostrophe(fullName){
    if(fullName.indexOf("'") != -1){
        fullName = fullName.replace(/'/g, '');
    }
    return fullName;
}

function addReporteeToList(employeeID, fullName, userName, emailAddress){
	initialReporteeList.push(employeeID);
	$('#reportee-list').append(reporteeListItemHTML(employeeID, fullName, userName, emailAddress));
}

function addSubReporteesToList(data) {
	var subList = "";
	if(data.length > 0) {
		subList = "<h5><b> "+selectedReporteeName+" - Team </b></h5>";
		 $.each(data, function(key, val){
	      	subList += reporteeListItemHTML(val.employeeID, val.fullName, val.username, val.emailAddress);
	      });
	}
	$('#reportee-sub-list').html(subList);
}


function updateSelectedSubReportee(userId){
	if(jQuery.inArray(userId, initialReporteeList) == -1){
		$('#reportee-sub-selected').html( "<h5><b>Selected Employee</b></h5>" + 
				reporteeListItemHTML(userId, selectedReporteeName, selectedReporteeUserName, selectedReporteeEmail));
		$('#panel-'+userId).addClass("selected-panel");
	}else{
		$('#reportee-sub-selected').empty();
	}
}

function reporteeListItemHTML(employeeID, fullName, userName, emailAddress){
	var HTML = " \
		<div id='panel-"+employeeID+"' class='panel panel-default reportee-panel' style='cursor:pointer' onClick='clickReportee("+employeeID+",\""+removeApostrophe(fullName)+"\", \""+emailAddress+"\",  \""+userName+"\", this)' > \
		    <div class='panel-heading'> \
		        <div class='row'> \
		           <div class='col-md-2'> \
		           		"+getProfilePicture(userName, 36)+" \
		           </div> \
		           <div class='col-md-8'><h5><b>"+fullName+"</b></h5></div> \
		        </div> \
		    </div> \
		  </div> \
  ";
  return HTML;
}

function selectedReportee(element){
	$(".reportee-panel").each(function(index){
		if(element.id == this.id){
			$(this).addClass("selected-panel");
		}else{
			$(this).removeClass("selected-panel");
		}
	});     
}

function clickReportee(id, name, emailAddress, userName, element){
	if(editingRating){
		var title = "Cancel Evaluation";
		var body = "<h5>You have unsaved changes. If you continue, these changes maybe lost.</h5><h5><b>Are you sure you want to continue?</b></h5>";
		var buttonText = "Continue";
		var buttonFunction = function(){ 
			closeManagerEvaluation(false);
			getReporteeCareer(id, name, emailAddress, userName, element);
		}
		
		if ((checkEmptyID("manager-evaluation-input",false) && wasManagerEvaluationEmpty)||(lastSavedManagerEvaluationInput===$managerEvaluationInput.val())){
			closeManagerEvaluation(false);
			getReporteeCareer(id, name, emailAddress, userName, element);
		}
		else{
			openWarningModal(title, body, buttonText, buttonFunction);
		}
	}else{
		getReporteeCareer(id, name, emailAddress, userName, element);
	}	
}

function getReporteeCareer(id, name, emailAddress, userName, element) {
	closeWarningModal();
	if(checkSelectedUser(parseInt(id), emailAddress, name, userName)){
		selectedReportee(element);
		clearReporteeLists();
		showReporteeView(id, name)
		getObjectivesList(id);
		getReporteeCompetencyList(id);
		getGeneralFeedbackList(id);
		getReporteeDevelopmentNeedsList(id);
		getReporteeNotesList(id);
		getReporteeRatings(id);
		getReportees(id, true);
	}
}

function getReporteeCompetencyList(userID){
    $.ajax({
        url: 'http://'+getEnvironment()+'/getCompetencies/'+userID,
        cache: false,
        method: 'GET',
        xhrFields: {'withCredentials': true},
        success: function(data){
        	var competencyList = [];
            $.each(data, function(key, val){
                 if(val.isSelected){
                	 competencyList.push(val.title);
                 }
            });
            addCompetenciesToList(competencyList);
    },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            toastr.error("Sorry, there was a problem getting competencies, please try again later.");
        }
    });
}

////Method to get the Notes list
function getReporteeNotesList(userID){
    $.ajax({
        url: 'http://'+getEnvironment()+'/getNotes/'+userID,
        cache: false,
        method: 'GET',
        xhrFields: {'withCredentials': true},
        success: function(data){
            $.each(data, function(key, val){
            	var date = timeStampToDateTime(new Date(val.timestamp));
            	addNoteToReporteeList(val.providerName, val.noteDescription, date);
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            toastr.error("Sorry, there was a problem getting notes, please try again later.");
        }
    });
}

//Method to propose objective
function proposeObjective(userID, objTitle, objText, objDate, proposedTo){
    $.ajax({
        url: "http://"+getEnvironment()+"/manager/proposeObjective/"+userID,
        method: 'POST',
        xhrFields: {'withCredentials': true},
        data: {
            'title': objTitle,
            'description': objText,
            'dueDate': objDate,
            'emails': proposedTo
        },            
        success: function(response){
        	if(response.indexOf("Objective Proposed for") !== -1 && response.indexOf("Error") !== -1){
        		toastr.warning(response);
        	}else if(response.indexOf("Error") !== -1){   
        		toastr.error(response);
        	}else{
        		if(proposedTo.indexOf(selectedReporteeEmail.trim()) !== -1) {
        			addObjectiveToList(nextObjectiveID(), objTitle, objText, objDate, 0, false);
        		}
        		toastr.success(response);
        	}
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
        	var errorMessage = XMLHttpRequest.responseText.toLowerCase();
        	if(errorMessage.indexOf("objective proposed") > -1){
        		toastr.warning(XMLHttpRequest.responseText);
        	}else{
        		toastr.error(errorMessage);
        	}
        },
    });
}

//Method to make ajax call to add note to database
function addNoteToReporteeDB(reporteeID, from, body, date){
    $.ajax({
        url: "http://"+getEnvironment()+"/manager/addNoteToReportee/"+getADLoginID(),
        method: "POST",
        xhrFields: {'withCredentials': true},
        data:{
            'reporteeEmployeeID': reporteeID,
            'providerName': from,
            'noteDescription': body,
        },
        success: function(response){
            if(lastNoteID == 0)
        		$("#general-notes-list").removeClass("text-center").empty();
            lastNoteID++;
        	addNoteToReporteeList(from, body, date);
            toastr.success(response);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            toastr.error(XMLHttpRequest.responseText);
        }
    });
}

function clearReporteeLists(){
	$("#reportee-obj-list, #reportee-comp-list, #reportee-feed-list, #reportee-dev-needs-list, #reportee-notes-list").empty();
}

function checkSelectedUser(id, emailAddress, name, userName){
	if(selectedReporteeID == id){
		return false;
	}
	selectedReporteeID = id;
	selectedReporteeEmail = emailAddress;
	selectedReporteeName = name;
	selectedReporteeUserName = userName;
	return true;
}

function showReporteeView(id, name){
	$(".reportee-name").each(function(){
		$(this).text(name);
	});
	
	$("#reportee-notes-add-button").empty();
	$editButton.hide();
	$submitButton.hide();
	
	if(jQuery.inArray(id, initialReporteeList) > -1){
		showEditOptions();
	}
	
	if(reporteeSectionHidden){
		$("#info-message").remove();
		$("#reportee-body").removeClass("hidden");
		reporteeSectionHidden = false;
	}
}

//Function to set up and open ADD objective modal
function openAddReporteeNoteModal(){
	$("#reportee-note-input").val("");
	showReporteeNoteModal(true);
}

//Method to show/hide objective modal
function showReporteeNoteModal(show){
	if(show){
		$('#submit-reportee-note').prop("disabled", true);
		$('#reportee-note-modal').modal({backdrop: 'static', keyboard: false, show: true});
	}else{
		$('#reportee-note-modal').modal('hide');
	}
}

function clickSubmitReporteeNote(){
	var reporteeID = selectedReporteeID;
	var from = getADfullName();
	var note = $("#reportee-note-input").val().trim();
	var date = timeStampToDateTime(new Date());
	var noteType = 0;
	var linkID = 0;
	
	addNoteToReporteeDB(reporteeID, from, note, date);
	showReporteeNoteModal(false);
}

//Function to add objective to list
function addObjectiveToList(id, title, description, expectedBy, status, isArchived){
		if(isArchived === false || isArchived === 'false'){
			$("#reportee-obj-list").append(reporteeObjectiveListHTML(id, title, description, expectedBy, status, isArchived));
		}
}

//Method to add competencies to list display
function addCompetenciesToList(competencies){
	if(competencies.length == 0) {
		$("#reportee-comp-list").append("No Competencies have been selected.");
	}
	$("#reportee-comp-list").append(reporteeCompetenciesListHTML(competencies));
}

function addDevelopmentNeedsToList(data){
	var html = "";
	if(data.length == 0){
    	  html = "<h5 class='text-center'>No Development Needs.</h5>";
	}else{
		$.each(data, function(key, val){
			if(data.isArchived !== false || data.isArchived !== 'false'){
				html += reporteeDevelopmentNeedListHTML(val.id, val.title, val.description, numberCategory(val.category), moment(val.dueDate).format("MMMM YYYY"), numberProgress(val.progress));
			}
		});
	}
	$("#reportee-dev-needs-list").html(html);
}

//Method to add feedback descriptions to list
function addGeneralFeedbackToList(id, sender, description, date, classDate){
    $('#reportee-feed-list').append(reporteeFeedbackDescriptionListHTML(id, sender, description, date, classDate));
}

//Method to add note to list directly
function addNoteToReporteeList(fromWho, body, date){
	$("#reportee-notes-list").prepend(reporteeNotesListHTML(fromWho, body, date));
}

//Function that returns objective list in html format with the parameters given
function reporteeObjectiveListHTML(id, title, description, timeToCompleteBy, status, isArchived){
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
            			 <div class='col-xs-4 bs-wizard-step complete' id='proposed-obj-dot-"+id+"'> \
					      <div class='text-center' id='test'><h6>Proposed</h6></div> \
					      <div  class='bs-wizard-dot-start'></div> \
					     </div> \
					     <div class='col-xs-4 bs-wizard-step "+ checkComplete(status, 1) +"' id='started-obj-dot-"+id+"'> \
					       <div class='text-center'><h6>In-Progress</h6></div> \
					       <div class='progress'><div class='progress-bar'></div></div> \
					       <div  class='bs-wizard-dot-start'></div> \
					       <div  class='bs-wizard-dot-complete'></div> \
					     </div> \
					     <div class='col-xs-4 bs-wizard-step  "+ checkComplete(status, 2) +"' id='complete-obj-dot-"+id+"'> \
					       <div class='text-center'><h6>Complete</h6></div> \
					       	 <div class='progress'><div class='progress-bar'></div></div> \
					        <div class='bs-wizard-dot-start'></div> \
					        <div  class='bs-wizard-dot-complete'></div> \
					     </div> \
            		</div> \
            		<div class='col-sm-1 chev-height notUnderlined'> \
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
                        <div class='col-md-8'> \
                        </div> \
                    </div> \
                    <div class='row'> \
                        <div class='col-md-12 wrap-text'> \
                            <p id='obj-text-"+id+"'>"+description+"</p> \
                        </div> \
                    </div> \
                </div> \
            </div> \
         \
        </div> \
    </div> \
    ";                   
    return html;
}

//Method to return competency html
function reporteeCompetenciesListHTML(competencies){
	var HTML = "";
	
	for (var i = 0; i < competencies.length; i++){
		HTML += competencies[i];
		if(i == competencies.length-1){
			HTML += ".";
		}else{
			HTML += ", ";
		}
	}
    return HTML;
}

function reporteeFeedbackDescriptionListHTML(id, sender, description, date, classDate){
	var HTML = " \
	<ul class='list-group'> \
		<li class='list-group-item'> \
			<div class='row'> \
				<div class='col-md-6'><h6><b>"+ sender +"</b></h6></div> \
				<div class='col-md-6'><h6 class='pull-right'><b>"+ date +"</b></h6></div> \
			</div> \
			<div class='row'> \
				<div class='col-md-12 wrap-text'><h5>"+ description +"</h5></div> \
			</div> \
		</li> \
	</ul>";
	return HTML;
}

//Function that returns dev needs list in html format with the parameters given
function reporteeDevelopmentNeedListHTML(id, title, description, category, timeToCompleteBy, status){
	var html = " \
	    <div class='panel-group' id='dev-need-item-"+id+"'> \
	        <div class='panel panel-default' id='panel'> \
		        <input type='hidden' id='dev-need-status-"+id+"' value='"+status+"'> \
		        <input type='hidden' id='dev-need-category-id-"+id+"' value='"+category+"'> \
	        	<div class='panel-heading'> \
	            	<div class='row'> \
	            		<div class='col-sm-6'> \
		            		<div class='row'> \
			            		<div class='col-sm-6' id='dev-need-no-"+id+"'><h6><b>#"+id+"</b></h6></div> \
			            		<div class='col-sm-6' id='dev-need-date-"+id+"'><h6 class='pull-right'><b>"+timeToCompleteBy+"</b></h6></div> \
		            		</div> \
		            		<div class='row'> \
			            		<div class='col-sm-12 wrap-text' id='dev-need-title-"+id+"'>"+title+"</div> \
		            		</div> \
	            		</div> \
	            		<div class='col-sm-5 bs-wizard'> \
	            			 <div class='col-xs-4 bs-wizard-step complete' id='proposed-dev-need-dot-"+id+"'> \
						      <div class='text-center' id='test'><h6>Proposed</h6></div> \
						      <div  class='bs-wizard-dot-start'></div> \
						     </div> \
						     <div class='col-xs-4 bs-wizard-step "+ checkComplete(status, 1) +"' id='started-dev-need-dot-"+id+"'> \
						       <div class='text-center'><h6>In-Progress</h6></div> \
						       <div class='progress'><div class='progress-bar'></div></div> \
						       <div  class='bs-wizard-dot-start'></div> \
						       <div  class='bs-wizard-dot-complete'></div> \
						     </div> \
						     <div class='col-xs-4 bs-wizard-step  "+ checkComplete(status, 2) +"' id='complete-dev-need-dot-"+id+"'> \
						       <div class='text-center'><h6>Complete</h6></div> \
						       	 <div class='progress'><div class='progress-bar'></div></div> \
						        <div class='bs-wizard-dot-start'></div> \
						        <div  class='bs-wizard-dot-complete'></div> \
						     </div> \
	            		</div> \
	            		<div class='col-sm-1 chev-height notUnderlined'> \
						  <a data-toggle='collapse' href='#collapse-dev-need-"+id+"' class='collapsed'></a> \
						</div> \
	            	</div> \
	            </div> \
	            <div id='collapse-dev-need-"+id+"' class='panel-collapse collapse'> \
	                <div class='panel-body'> \
	                    <div class='row'> \
	                        <div class='col-md-6'> \
	                            <h5><b>Description</b></h5> \
	                        </div> \
	                       	<div class='col-md-6' > \
	                        	<input type='hidden' id='dev-need-category-id-"+id+"' value='" + category + "'> \
		                        <h6><b> Category: </b><span id='dev-need-category-"+id+"'>" + categoryList[category] + "</span></h6>\
		                    </div> \
	                    </div> \
	                    <div class='row'> \
	                        <div class='col-md-12 wrap-text'> \
	                            <p id='dev-need-text-"+id+"'>"+description+"</p> \
	                        </div> \
	                    </div> \
	                </div> \
	            </div> \
	         \
	        </div> \
	    </div> \
	    "                    
    return html;
}

//Method to return html
function reporteeNotesListHTML(fromWho, body, date){
	var html = " \
	  <ul class='list-group-item'> \
	  	<div class='row'> \
			<div class='col-md-6 wrap-text'><h6 ><b>" + fromWho + "</b></h6></div> \
			<div class='col-md-6'><h6 class='pull-right'><b>" + date + "</b></h6></div> \
		</div> \
		<div class='row'> \
			<div class='col-md-12 wrap-text'><p>" + body + "</p></div> \
		</div> \
	  </ul> \
	  ";
	return html;	
}

function addProposed(){
	$("#nav-bar-buttons").empty();
	if(isUserManager() === "true" || isUserManager() == true){
		$("#nav-bar-buttons").prepend("<button type='button' class='btn btn-default navbar-btn pull-right' id='proposed-objective' onClick='openProposedObjectiveModal()'>Propose Objective</button>")
	}
}

function initialiseTags() {
	addProposed();
}

function loadingProposedButton(){
	$("#nav-bar-buttons").html('').append("<h5 class='pull-right'> Loading... <h5>");
}

/** Retrieve MyRatings details from database and update relevant DOM Elements. */
function getReporteeRatings(userId){
	getCurrentRatingAction(userId, function(data){ 
		setMyRatings(data.selfEvaluation, data.managerEvaluation, data.score, data.selfEvaluationSubmitted, data.managerEvaluationSubmitted);
	});
}

/** Sets the three evaluations in the HTML */
function setMyRatings(reporteeEvaluation, managerEvaluation, evaluationScore, isReporteeEvaluationSubmitted, isManagerEvaluationSubmitted){
	setManagerEvaluationLabel(managerEvaluation);
	setManagerEvaluationInput(managerEvaluation);
	setEvaluationScoreLabel(evaluationScore);
	setManagerEvaluationScore(evaluationScore);
	
	if(isReporteeEvaluationSubmitted == true) {
		setReporteeEvaluation(reporteeEvaluation);
	}else{
		setReporteeEvaluation(NO_REPORTEE_EVALUATION_SUBMITTED)
	}
	
	reporteeEvaluationSubmitted(isReporteeEvaluationSubmitted);
	managerEvaluationSubmitted(isManagerEvaluationSubmitted);
	
	$managerEvaluationFooter.show();
	
	if ($managerEvaluationText.text()==="No manager evaluation has been written."){ 
		wasManagerEvaluationEmpty=true;
		lastSavedManagerEvaluationInput="";
	}
	else{
		wasManagerEvaluationEmpty=false;
		lastSavedManagerEvaluationInput=$managerEvaluationText.text();
	}
}

/** Sets the manager evaluation label */
function setManagerEvaluationLabel(managerEvaluation) {
	var label = (managerEvaluation == "") ? NO_MANAGER_EVALUATION : managerEvaluation;
	$managerEvaluationText.text(label);
}

/** Sets the self evaluation label */
function setManagerEvaluationInput(managerEvaluation){
	var manager = (managerEvaluation === NO_MANAGER_EVALUATION) ? "" : managerEvaluation;
	$managerEvaluationInput.val(manager);
}

/** Sets the self evaluation label */
function setManagerEvaluationScore(evaluationScore){
	var score = (evaluationScore === NO_RATING) ? 0 : evaluationScore;
	$evaluationScoreInput.selectpicker('val', score);
}


/** Sets the evaluation score label */
function setEvaluationScoreLabel(evaluationScore) {
	var label = (evaluationScore == 0) ? NO_RATING : RATING + evaluationScore;
	$evaluationScoreText.text(label);
}

function setReporteeEvaluation(reporteeEvaluation){
	var label = (reporteeEvaluation === "") ? NO_REPORTEE_EVALUATION_ADDED : reporteeEvaluation;
	$reporteeEvaluationText.text(label);
}

function reporteeEvaluationSubmitted(isReporteeEvaluationSubmitted){
	if(isReporteeEvaluationSubmitted == true){
		$reporteeEvaluationsSubmitted.show();
	}else{
		$reporteeEvaluationsSubmitted.hide();
	}
}

function managerEvaluationSubmitted(isManagerEvaluationSubmitted){
	if(isManagerEvaluationSubmitted == true){
		$managerEvaluationSubmitted.show();
		$managerOptions.hide();
	}else{
		$managerEvaluationSubmitted.hide();
		$managerOptions.show();
	}
}

/** Make manager evaluation editable. */
function editManagerEvaluation(){
	$managerEvaluationLabels.hide();
	$managerEvaluationOptions.show();
	editingRating = true;
}

/** Open confirmation model. */
function submitManagerEvaluation(){
	var title = "Submit Evaluation";
	var body = "<h5>Once you have submitted your manager evlauation, the rating process will be complete and can no longer be edited.</h5><h5><b>Are you sure you want to submit?</b></h5>";
	var buttonText = "Submit";
	var buttonFunction = function(){ confirmSubmitEvaluation() }
	
	openWarningModal(title, body, buttonText, buttonFunction);
}

/** Update rating on database to submit self evaluation */
function confirmSubmitEvaluation(){
	submitManagerEvaluationAction(getADLoginID(), selectedReporteeID, function(){
		managerEvaluationSubmitted(true);
		closeWarningModal();
	}, function(){});
}

/** Save manager evaluation to the database. */
function saveManagerEvaluation(){	
	wasManagerEvaluationEmpty=checkEmptyID("manager-evaluation-input",true);
	lastSavedManagerEvaluationInput=$managerEvaluationText.text();
	addManagerEvaluationAction(getADLoginID(), selectedReporteeID, $managerEvaluationInput.val(), $evaluationScoreInput.val(), function(response){
		closeManagerEvaluation(true);
	});
}

/**
 * Hide editable manager evaluations
 * @param save true to save, false to cancel
 */
function closeManagerEvaluation(save){
	$managerEvaluationOptions.hide();
	if(save) {
		setManagerEvaluationLabel($managerEvaluationInput.val());
		setEvaluationScoreLabel($evaluationScoreInput.val());
	}else{
		setManagerEvaluationInput($managerEvaluationText.text())
		var s = $evaluationScoreText.text();
		var score = (s === NO_RATING) ? 0 : s.substring(s.length-1,s.length);
			
		setManagerEvaluationScore(score);
	}
	$managerEvaluationLabels.show();
	
	editingRating = false;
	closeWarningModal();
}

function clickClose(){
	lastSavedManagerEvaluationInput=$managerEvaluationText.text();
	var title = "Cancel Evaluation";
	var body = "<h5>You have unsaved changes. If you continue, these changes maybe lost.</h5><h5><b>Are you sure you want to continue?</b></h5>";
	var buttonText = "Continue";
	var buttonFunction = function(){ closeManagerEvaluation(false) }
	if ((checkEmptyID("manager-evaluation-input",false) && wasManagerEvaluationEmpty)||(lastSavedManagerEvaluationInput===$managerEvaluationInput.val())){
		closeManagerEvaluation(false);
	}
	else{
		openWarningModal(title, body, buttonText, buttonFunction);
	}
}

function initSelect(){
	$("#evaluation-score-input").selectpicker({'width': '40%'});
}

function showEditOptions(){
	$("#reportee-notes-add-button").append(addNotesHTML());
	$editButton.show();
	$submitButton.show();
}

function addNotesHTML(){
	var HTML = " \
		<div class='row'> \
			<div class='col-md-12'> \
				<button type='button' class='btn btn-link pull-right' onClick='openAddReporteeNoteModal()'><u>Add Note for "+selectedReporteeName+"</u></button> \
			</div> \
		</div> \
		";
	return HTML;
}

function toggleActivityFeed(){
	if(activityFeedVisible){
		activityFeedVisible = false;
		$activityFeed.hide();
	}else{
		activityFeedVisible = true;
		$activityFeed.show();
	}
}

//function to open Proposed objective modal
function openProposedObjectiveModal(){
    $("#obj-modal-type").val('propose');
	setObjectiveModalContent('', '', '', getToday(), 0, 2);
	showObjectiveModal(true);
}

function proposedToHTML(){
    var HTML= " \
        <label id='propose-to-title'>"+EMAILS+"</label> \
		<div class='pull-right checkbox' style='margin-top:0px; margin-bottom:0px;'> \
	  		<label class='pull-right' style='font-weight: 200;'><input id='distribution-list-checkbox' type='checkbox' onClick='toggleProposeToInput()'>Proposed to Distribution List</label> \
		</div> \
        <div id='proposed-obj-to-container' style='height:34px'> \
        	<input id='proposed-obj-to' type='text' class='form-control' data-role='tagsinput' autocomplete='off' placeholder='...' maxlength='150' /> \
        </div> \
    	<div id='distribution-list-textbox-container' hidden> \
    		<input id='distribution-list-textbox' type='text' class='form-control' placeholder='...' maxlength='150'/> \
    	</div>" ;
    return HTML;
}

function toggleProposeToInput(){
	var isChecked = $("#distribution-list-checkbox").is(":checked");
	if(isChecked){
		$("#distribution-list-textbox-container").show();
		$("#proposed-obj-to-container").hide();
		$("#propose-to-title").text(DISTRIBUTION_LIST);
	}else{
		$("#distribution-list-textbox-container").hide();
		$("#proposed-obj-to-container").show();
		$("#propose-to-title").text(EMAILS);
	}
}

function generateDistributionList(userId, distributionListName, title, description, dueDate){
	if(distributionListName.length < 1){
		toastr.error("Please enter a distribution list name")
		return true;
	}
	
	loading("Reading distribution list. Please wait.");
	var data = { distributionListName: distributionListName };
	var success = function(data){
		var modalTitle = "Proposing to " + data.emailAddresses.length + " employees";
		var body = "<h5>You are about to propose an objective to the following "+ data.emailAddresses.length + " employees:</h5> " + 
					emailListHTML(data.emailAddresses) + " <h5><b>Are you sure you want to submit?</b></h5>";
		var buttonText = "Submit";
		var buttonFunction = function(){ proposeObjectiveToDistributionList(userId, distributionListName, title, description, dueDate); }
		
		loaded();
		openWarningModal(modalTitle, body, buttonText, buttonFunction);
	} 
	var error = function(error){ loaded(); }
	
	generateDistributionListAction(userId, data, success, error);
}

function proposeObjectiveToDistributionList(userId, distributionListName, title, description, dueDate){
	loading("Proposing Objectives. Please wait.");
	
	var data = {
		title: title, 
		description: description,
		dueDate: dueDate,
		distributionListName: distributionListName
	};
	var success = function(response){
		loaded();
		toastr.success(response)
		
		showObjectiveModal(false);
		closeWarningModal();
	}
	var error = function(error){ loaded(); }
	
	proposeObjectiveToDistributionListAction(userId, data, success, error);
}


function checkRatingPeriod(){
	if(isRatingPeriod()){
		$("#navTab").append("<li><a id='ratings-link' href='#reportee-ratings-tab' data-toggle='tab'> Rating </a></li>");
	}else{
		$ratingsTab.remove();
	}
}







