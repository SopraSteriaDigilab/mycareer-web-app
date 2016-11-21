$(function() {
    
	//Get list of reportees
	getReportees();
    
});//End of Document Function

//Method to get the Reportee list
function getReportees(){

	    $.ajax({
	        url: 'http://127.0.0.1:8080/getReportees/'+getADLoginID(),
	        method: 'GET',
	        success: function(data){
	            $.each(data, function(key, val){
	            	addReporteeToList(val.employeeID, val.fullName, val.username);
	            });
	        },
	        error: function(XMLHttpRequest, textStatus, errorThrown){
	            console.log('error', errorThrown);
	            toastr.error("Sorry, there was a problem getting notes, please try again later.");
	        }
	    });
}

function addReporteeToList(employeeID, fullName, userName){
	$('#reportee-list').append(reporteeListItemHTML(employeeID, fullName, userName));
}

function reporteeListItemHTML(employeeID, fullName, userName){
	var HTML = " \
		<div class='panel panel-default' style='cursor:pointer' onClick='getReporteeCareer("+employeeID+")' > \
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

function getReporteeCareer(id) {
	getObjectivesList(id);
	getCompetencyList(id);
	getFeedbackList(id);
	getDevelopmentNeedsList(id);
	getNotesList(id);
}

//Function to add objective to list
function addObjectiveToList(id, title, description, expectedBy, status, isArchived){
		if(isArchived === false || isArchived === 'false'){
			$("#reportee-obj-list").append(objectiveListHTML(id, title, description, expectedBy, status, isArchived));
		}
}

//Method to add competencies to list display
function addCompetencyToList(id,title,compentencyDescription,isSelected){
    $("#reportee-comp-list").append(competenciesListHTML(id,title,compentencyDescription,isSelected));
}

//Method to add development needs to list display
function addDevelopmentNeedToList(id, title, description, category, expectedBy){
	lastDevID = id;
	$("#reportee-dev-needs-list").append(developmentNeedListHTML(id, title, description, category, expectedBy));
}

//Method to add feedback descriptions to list
function addFeedbackToList(id, sender, description, date){
    $('#reportee-feed-list').append(feedbackDescriptionListHTML(id, sender, description, date));
}

//Method to add note to list directly
function addNoteToList(fromWho, body, date){
	$("#reportee-notes-list").prepend(notesListHTML(fromWho, body, date));
}


//Function that returns objective list in html format with the parameters given
function objectiveListHTML(id, title, description, timeToCompleteBy, status, isArchived){
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
					       <div class='text-center'><h6>Started</h6></div> \
					       <div class='progress'><div class='progress-bar'></div></div> \
					       <div  class='bs-wizard-dot-start' style='cursor:pointer'></div> \
					       <div  class='bs-wizard-dot-complete'></div> \
					     </div> \
					     <div class='col-xs-4 bs-wizard-step  "+ checkComplete(status, 2) +"' id='complete-obj-dot-"+id+"'> \
					       <div class='text-center'><h6>Completed</h6></div> \
					       	 <div class='progress'><div class='progress-bar'></div></div> \
					        <div class='bs-wizard-dot-start' style='cursor:pointer'></div> \
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
function competenciesListHTML(id,title,compentencyDescription,isSelected){
    var html = " \
        <div class='panel panel-default'> \
            <div class='panel-heading panel-heading-sm'> \
                <div class='panel-title'> \
                    <input type='hidden' id='starSelected"+id+"' value='"+isSelected+"'>\
                        <span class='glyphicon glyphicon-star"+ checkSelected(isSelected) +"' id='star-"+ id +"'></span> \
                        <span id='competencyTitle"+ id +"'>" + title + "</span>  \
                        <a class='collapsed' data-toggle='collapse' href='#collapse-" + id + "'></a> \
                </div> \
            </div> \
            <div id='collapse-"+id+"' class='panel-collapse collapse'> \
                <div class='panel-body'> \
                    <h5>"+compentencyDescription+"</h5> \
                </div> \
            </div> \
        </div><!--End of panel --> \
    "
    return html;
}

function feedbackDescriptionListHTML(id, sender, description, date){
	var HTML = " \
	<li class='list-group-item'> \
			<div class='row'> \
				<div class='col-md-6'><h6><b>"+ sender +"</b></h6></div> \
				<div class='col-md-6'><h6 class='pull-right'><b>"+ date +"</b></h6></div> \
			</div> \
			<div class='row'> \
				<div class='col-md-12'><h5>"+ description +"</h5></div> \
			</div> \
	</li> ";
	
	return HTML
}

//Function that returns dev needs list in html format with the parameters given
function developmentNeedListHTML(id, title, description, category, timeToCompleteBy){
	var html = " \
    <div class='panel-group' id='accordion'> \
        <div class='panel panel-default' id='panel'> \
            <div class='panel-heading'> \
                <div class='row'> \
                    <div class='col-sm-6' id='dev-need-no-"+id+"'> # "+id+" </div> \
                    <div class='col-sm-6' id='dev-need-date-"+id+"'><h6><b>" + timeToCompleteBy + "</b></h6></div> \
                </div><br> \
                <div class='row'> \
                    <div class='col-sm-5 wrap-text' id='dev-need-title-"+id+"' ><h5> "+title+" </h5></div> \
                        <div class='col-sm-5'><br> \
                            <div class='progress progress-striped'> \
                                <div class='one primary-color' style='cursor:pointer' id='proposed-dev-need-"+id+"'><h5 class='progress-label'>Proposed</h5></div> \
                                <div class='two primary-color' style='cursor:pointer' id='started-dev-need-"+id+"'><h5 class='progress-label'>Started</h5></div> \
                                <div class='three primary-color' style='cursor:pointer' id='completed-dev-need-"+id+"'><h5 class='progress-label'>Completed</h5></div> \
                                <div class='progress-bar' id='devNeedStatus' role='progressbar' aria-valuemin='0' aria-valuemax='100'></div> \
                            </div> \
                        </div> \
                        <div class='col-sm-2'> \
                            <a data-toggle='collapse' href='#collapse-dev-"+id+"' class='collapsed'></a> \
                        </div> \
                </div> \
            </div> \
        \
            <div id='collapse-dev-"+id+"' class='panel-collapse collapse'> \
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
                            <h5 id='dev-need-text-"+id+"'> "+description+" </h5> \
                        </div> \
                    </div> \
                    <div class='row'> \
	                        <div class='col-md-6' > \
                               <input type='hidden' id='dev-need-category-id-"+id+"' value='" + category + "'> \
	                           <h6><b> Category: </b><span id='dev-need-category-"+id+"'>" + categoryList[category] + "</span></h6>\
	                        </div> \
	                        <div class='col-md-6'> \
	                            <button type='button' class='btn btn-block btn-default' onClick='openEditDevelopmentNeedModal("+id+")'>Edit</button> \
	                        </div> \
	                <div>\
                </div> \
            </div> \
        </div> \
    </div> \
    "
                            
    return html;
}


//Method to return html
function notesListHTML(fromWho, body, date){

	var html = " \
	  <li class='list-group-item'> \
	  	<div class='row'> \
			<div class='col-md-6 wrap-text'><h6 ><b>" + fromWho + "</b></h6></div> \
			<div class='col-md-6'><h6 class='pull-right'><b>" + date + "</b></h6></div> \
		</div> \
		<div class='row'> \
			<div class='col-md-12 wrap-text'><p>" + body + "</p></div> \
		</div> \
	  </li> \
	  ";
	return html;	
}