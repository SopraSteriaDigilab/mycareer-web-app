$(function() {
	
//	Get list of objectives
	getObjectivesList(getADLoginID());
	
	//Load competencies section
	$( "#competencies" ).load( "../components/myobjectives/competencies/competencies.html" );
	
	//onClick for opening modal
	$('#add-obj').click(function() { openAddObjectiveModal(); });
    
    //Ensuring all the objectives items are shown
    $("#obj-all-tab").click(function(){ $(".unarchived-obj-item").css('display', ''); });
    $("#obj-proposed-tab").click(function(){ $('.proposed').css({'display':''}); });
    $("#obj-started-tab").click(function(){ $('.started').css({'display':''}); });
    $("#obj-completed-tab").click(function(){ $('.completed').css({'display':''}); });
    
});

//HTTP request for INSERTING an objective to DB
function addObjectiveToDB(userID, objTitle, objText, objDate, proposedBy){
    $.ajax({
        url: "http://"+getEnvironment()+":8080/addObjective/"+userID,
        method: "POST",
        xhrFields: {'withCredentials': true},
        data: {
            'title': objTitle,
            'description': objText,
            'completedBy': objDate,
            'proposedBy': proposedBy
        },
        success: function(response){
            if(lastObjID == 0)
        		$("#all-obj").removeClass("text-center").empty(); 
            addObjectiveToList((++lastObjID), objTitle, objText, formatDate(objDate), 0, false, getADfullName());
		    showProposedObjTab();
            toastr.success(response);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            toastr.error(XMLHttpRequest.responseText);
        }
    });
}

//HTTP request for UPDATING an objective in DB
function editObjectiveOnDB(userID, objID, objTitle, objText, objDate, objStatus, proposedBy){
    $.ajax({
        url: "http://"+getEnvironment()+":8080/editObjective/"+userID,
        method: "POST",
        xhrFields: {'withCredentials': true},
        data: {
            'objectiveID': objID,
            'title': objTitle,
            'description': objText,
            'completedBy': objDate,
            'progress': objStatus,
            'proposedBy': proposedBy
        },
        success: function(response){
            editObjectiveOnList(userID, objID, objTitle, objText, objDate,objStatus);
            toastr.success(response);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            toastr.error(XMLHttpRequest.responseText);
        },
    });
}

//HTTP request for UPDATING an objective in DB
function editObjectiveProgressOnDB(userID, objID, objStatus){
    $.ajax({
        url: "http://"+getEnvironment()+":8080/editObjectiveProgress/"+userID,
        method: "POST",
        xhrFields: {'withCredentials': true},
        data: {
            'objectiveID': objID,
            'progress': objStatus
        },
        success: function(response){
            updateObjectiveStatusOnList(objID, objStatus);
            toastr.success(response);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            toastr.error(XMLHttpRequest.responseText);
        },
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

//Function to add objective to list
function addObjectiveToList(id, title, description, expectedBy, status, isArchived, proposedBy, timeStamp){
		if(isArchived === true || isArchived === 'true'){
			$("#obj-archived").append(objectiveListHTML(id, title, description, expectedBy, status, isArchived, proposedBy, timeStamp));
		}else{
			$("#all-obj").append(objectiveListHTML(id, title, description, expectedBy, status, isArchived, proposedBy, timeStamp));
		}	
}

//Function to update objective on list
function editObjectiveOnList(userID, objID, title, text, date, status){
	$('#obj-title-'+objID).text(title);
	$('#obj-text-'+objID).text(text);
	$('#obj-date-'+objID).text('').append('<h6 class="pull-right"><b>' + formatDate(date) + '</b></h6>');
	$('#obj-status-'+objID).val(status);
}

//Method to handle the archive objective button
function clickArchiveObjective(objID, archive){
	$('#obj-is-archived-'+objID).val(archive);
	editObjectiveArchiveOnDB(objID, archive);
}

function editObjectiveArchiveOnDB(objID, archive){
    $.ajax({
        url: "http://"+getEnvironment()+":8080/changeStatusObjective/"+getADLoginID(),
        method: "POST",
        xhrFields: {'withCredentials': true},
        data: {
            'objectiveID': objID,
            'isArchived': archive
        },
        success: function(response){
            updateObjectiveList(objID);
            if(!archive){
		          updateArchiveTab();
	        }
            toastr.success(response);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            toastr.error(XMLHttpRequest.responseText);
        }
    });
}

function updateObjectiveList(objID){
	var title = $('#obj-title-'+objID).text();
	var description = $('#obj-text-'+objID).text();
	var expectedBy = $('#obj-date-'+objID).text();
	var status = $('#obj-status-'+objID).val();
	var archive = $('#obj-is-archived-'+objID).val();
	var proposedBy = $('#obj-proposedBy-'+objID).text();
	
	$("#objective-item-"+objID).fadeOut(400, function() { $(this).remove(); });
	addObjectiveToList(objID, title, description, expectedBy, status, archive, proposedBy);	
}

//onclick to view feedback
function clickObjectiveFeedback(id){
	window.location.replace("http://"+getEnvironment()+"/mycareer/feedback"); 
}

function updateObjectiveStatusOnDB(objID, objStatus){
	if($('#obj-is-archived-'+objID).val() === 'true' || $('#obj-is-archived-'+objID).val() == true
			|| objStatus === parseInt($('#obj-status-'+objID).val())){
		return false;
	}
	var userID = getADLoginID();
	editObjectiveProgressOnDB(userID, objID, objStatus);
}

function updateObjectiveStatusOnList(objID, objStatus){
	$('#obj-status-'+objID).val(objStatus);
	switch(parseInt(objStatus)){
		case 0:
			$('#started-obj-dot-'+objID).removeClass('complete');
			$('#complete-obj-dot-'+objID).removeClass('complete');
			break;
		case 1:
			$('#started-obj-dot-'+objID).addClass('complete');
			$('#complete-obj-dot-'+objID).removeClass('complete');
			break;
		case 2:
			$('#started-obj-dot-'+objID).addClass('complete');
			$('#complete-obj-dot-'+objID).addClass('complete');
	}
	
	if(!($("#obj-all-tab").hasClass("active"))){
		$("#objective-item-"+objID).fadeOut();
	}
    
	$("#objective-item-"+objID).removeClass("proposed started completed");
	$("#objective-item-"+objID).addClass(statusList[parseInt(objStatus)]);
}

function updateArchiveTab(){
	$(".panel-group").each(function(){
		if($(this).hasClass("archived-obj-item")){
			$(this).addClass("active in");
		}else{
			$(this).removeClass("active in");
		}
	});
}

function isArchivedItem(isArchived){
	if(isArchived == true || isArchived === "true"){
		return "archived-obj-item";
	}
	return "unarchived-obj-item"
}

//Method to handle the delete objective button onclick
function clickDeleteObjective(id, title){
    openDeleteObjectiveModal();
}

//Mehtod to open delete modal
function openDeleteObjectiveModal(){
    $('#deleteModal').modal({backdrop: 'static', keyboard: false, show: true});
}

//Function that returns objective list in html format with the parameters given
function objectiveListHTML(id, title, description, timeToCompleteBy, status, isArchived, proposedBy, timeStamp){
	var html = " \
    <div class='panel-group tab-pane fade "+isArchivedItem(isArchived)+" "+statusList[status]+" active in' id='objective-item-"+id+"'> \
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
					      <div class='text-center progress-link' style='cursor:pointer'><h6>Proposed</h6></div> \
					      <div  class='bs-wizard-dot-start' style='cursor:pointer'></div> \
					     </div> \
					     <div class='col-xs-4 bs-wizard-step "+ checkComplete(status, 1) +"' id='started-obj-dot-"+id+"' onClick='updateObjectiveStatusOnDB("+id+", 1)'> \
					       <div class='text-center progress-link' style='cursor:pointer'><h6>In-Progress</h6></div> \
					       <div class='progress'><div class='progress-bar'></div></div> \
					       <div  class='bs-wizard-dot-start' style='cursor:pointer'></div> \
					       <div  class='bs-wizard-dot-complete' style='cursor:pointer'></div> \
					     </div> \
					     <div class='col-xs-4 bs-wizard-step  "+ checkComplete(status, 2) +"' id='complete-obj-dot-"+id+"' onClick='updateObjectiveStatusOnDB("+id+", 2)'> \
					       <div class='text-center progress-link' style='cursor:pointer'><h6>Complete</h6></div> \
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
                            <h6><b>Created on: </b><span id='obj-createdOn-"+id+"'>"+timeStampToLongDate(timeStamp)+"</span></h6> \
                        </div> \
                        <div class='col-md-3'> \
                        </div> \
                        <div class='col-md-5 pull-right'> \
                            <h6><b>Proposed by: </b><span id='obj-proposedBy-"+id+"'>"+proposedBy+"</span></h6> \
                        </div> \
                    </div> \
                    <div class='row'> \
                        <div class='col-md-12 wrap-text'> \
                            <p id='obj-text-"+id+"'>"+description+"</p> \
                        </div> \
                    </div> \
                    " + objectivesButtonsHTML(id, isArchived, title); + " \
                </div> \
            </div> \
         \
        </div> \
    </div> \
    "                      
    return html;
}

function objectivesButtonsHTML(id, isArchived, title){
	var HTML = " \
    <div class='col-md-12'> \
		<div class='col-sm-6'> \
        	<button type='button' class='btn btn-block btn-default pull-left'  onClick='clickArchiveObjective("+id+", true)' id='archive-obj'>Archive</button> \
        </div> \
        <div class=' col-sm-6'> \
        	<button type='button' class='btn btn-block btn-default' onClick='openEditObjectiveModal("+id+")'>Edit</button> \
        </div> \
    </div> \
";
	if(isArchived === true || isArchived ==='true'){
		var unArchiveButton = " \
		    <div class='col-md-12'> \
		        <div class=' col-sm-6'> \
		        	<button type='button' class='btn btn-block btn-default pull-left'  onClick='clickArchiveObjective("+id+", false)' id='archive-obj'>Restore</button> \
		        </div> \
                <div class=' col-sm-6'> \
                    <button type='button' class='btn btn-block btn-default' onClick='clickDeleteObjective("+id+", \""+title+"\")' id='delete-obj'>Delete</button> \
                </div> \
		    </div> \
		";
		return(unArchiveButton);
	}
	return(HTML);
}