$(function() {
	//Get list of reportees
	getReportees();
	
	//Add Proposed Button
	addProposed();
	
	//onClick for opening modal
	$('#add-reportee-note').click(function() { openAddReporteeNoteModal(); });

	//Validation for the add reportee modal
	$('.reportee-note-validate').keyup(function() { validateForm('reportee-note-validate', 'submit-reportee-note'); });
	
	//onClick for Submit modal
	$('#submit-reportee-note').click(function(){ clickSubmitReporteeNote(); });
    
});//End of Document Function

var reporteeSectionHidden = true;
var selectedReporteeID = 0;
var selectedReporteeEmail = "";

//Method to get the Reportee list
function getReportees(){
		$("#reportee-list").append("<h5>Loading Reportees...</h5>");
	    $.ajax({
	        url: 'http://'+getEnvironment()+'/getReportees/'+getADLoginID(),
            cache: false,
	        method: 'GET',
	        xhrFields: {'withCredentials': true},
	        success: function(data){
	        	$("#reportee-list").empty();
	        	$("#info-holder").append("<span id='info-message' class='text-center'><h5>Please select a reportee </h5></span>");
	        	demoManager(); //REMOVE ME!!!!
	            $.each(data, function(key, val){
	            	addReporteeToList(val.employeeID, val.fullName, val.username, val.emailAddress);
	            });  
	        },
	        error: function(XMLHttpRequest, textStatus, errorThrown){
	            console.log('error', errorThrown);
	            toastr.error("Sorry, there was a problem getting reportees, please try again later.");
	        }
	    });
}

function demoManager(){
	if(getADLoginID() == 675590){
		addReporteeToList(675590, "Ridhwan Nacef", "rnacef", "ridhwan.nacef@soprasteria.com");
	}
}

//method to remove apostrophe from names so can be clicked on in my team
function removeApostrophe(fullName){
    if(fullName.indexOf("'") != -1){
        fullName = fullName.replace(/'/g, '');
    }
    return fullName;
}

function addReporteeToList(employeeID, fullName, userName, emailAddress){
	$('#reportee-list').append(reporteeListItemHTML(employeeID, fullName, userName, emailAddress));
}

function reporteeListItemHTML(employeeID, fullName, userName, emailAddress){
	var HTML = " \
		<div id='panel-"+employeeID+"' class='panel panel-default reportee-panel' style='cursor:pointer' onClick='getReporteeCareer("+employeeID+",\""+removeApostrophe(fullName)+"\", \""+emailAddress+"\", this)' > \
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

function getReporteeCareer(id, name, emailAddress, element) {
	if(checkSelectedUser(parseInt(id), emailAddress)){
		selectedReportee(element)
		clearReporteeLists();
		showReporteeView(name)
		getObjectivesList(id);
		getReporteeCompetencyList(id);
		getGeneralFeedbackList(id);
		getDevelopmentNeedsList(id);
		getReporteeNotesList(id);
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
            console.log('error', errorThrown);
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
            console.log('error', errorThrown);
            toastr.error("Sorry, there was a problem getting notes, please try again later.");
        }
    });
}

//Method to propose objective
function proposeObjective(userID, objTitle, objText, objDate, proposedTo){
    $.ajax({
        url: "http://"+getEnvironment()+"/proposeObjective/"+userID,
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
        url: "http://"+getEnvironment()+"/addNoteToReportee/"+getADLoginID(),
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

function checkSelectedUser(id, emailAddress){
	if(selectedReporteeID == id){
		return false;
	}
	selectedReporteeID = id;
	selectedReporteeEmail = emailAddress;
	return true;
}

function showReporteeView(name){
	$(".reportee-name").each(function(){
		$(this).text(name);
	});
	
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

//Method to add development needs to list display
function addDevelopmentNeedToList(id, title, description, category, expectedBy, status){
	lastDevID = id;
	$("#reportee-dev-needs-list").append(reporteeDevelopmentNeedListHTML(id, title, description, category, expectedBy, status));
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
	            		<div class='col-sm-1 chev-height'> \
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
	if(isUserManager() === "true" || isUserManager() == true){
		$("#nav-bar-buttons").prepend("<button type='button' class='btn btn-default navbar-btn pull-right' id='proposed-objective' onClick='openProposedObjectiveModal()'>Propose Objective</button>")
	}
}