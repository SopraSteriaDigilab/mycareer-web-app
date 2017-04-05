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
    
      //onClick for Close modal
	$('#close-obj, #close-obj-cross').on('click', function(e) { clickCloseObjective(e); });
    
    //onclick to delete objectives
    $('#delete').click(function(){ deleteObjective(getADLoginID(), $("#delete-id").text(), $("#deleteTitle").text(), $("#deletingText").val()); });
    
    //onclick to complete objective
    $('#submit-completed-status-note').click(function(){ 
    	editObjectiveProgressOnDB(getADLoginID(), $("#complete-id").text(), $("#complete-status").text(), $("#completedTitle").text(), $('#completedText').val());
    });
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
            'dueDate': objDate,
        },
        success: function(response){
            if(nextObjId.length == 0)
        		$("#all-obj").removeClass("text-center").empty();
            addObjectiveToList(nextObjectiveID(), objTitle, objText, formatDate(objDate), 0, false, getADfullName(), timeStampToLongDate(new Date()));
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
            'objectiveId': objID,
            'title': objTitle,
            'description': objText,
            'dueDate': objDate,
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
function editObjectiveProgressOnDB(userID, objID, objStatus, objTitle, completedText){
    $.ajax({
        url: "http://"+getEnvironment()+":8080/updateObjectiveProgress/"+userID,
        method: "POST",
        xhrFields: {'withCredentials': true},
        data: {
            'objectiveId': objID,
            'progress': objStatus,
            'comment': completedText,
        },
        success: function(response){
            updateObjectiveStatusOnList(objID, objStatus);
            if(objStatus == 2){
            	var text = (completedText === "") ? getADfullName() + " has completed Objective '"+ objTitle +"'." : getADfullName() + " has completed Objective '"+ objTitle +"'. "+" A comment was added: '"+ completedText+"'.";
                addNoteToList(++lastNoteID, "Auto Generated", text, timeStampToDateTime(new Date()), timeStampToClassDate(new Date()), emptyArray, emptyArray);
                $("#edit-objective-button-"+objID).remove();
            }
            toastr.success(response);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            toastr.error(XMLHttpRequest.responseText);
        },
    });
}
    
    //function request for DELETING a development need in DB
function deleteObjective(userID, objID, objTitle, deletingText){
        $.ajax({
        url: "http://"+getEnvironment()+":8080/deleteObjective/"+userID,
        method: "POST",
        xhrFields: {'withCredentials': true},
        data: {
            'objectiveId': objID,
            'comment': deletingText,
        },
        success: function(response){
            //need to update objective list to remove
            removeObjectiveFromList(objID);
            //need to update note list
            var text = (deletingText === "") ? getADfullName() + " has deleted Objective '"+ objTitle +"'." : getADfullName() + " has deleted Objective '"+ objTitle +"'. "+" A comment was added: '"+ deletingText+"'.";
            addNoteToList(++lastNoteID, "Auto Generated", text, timeStampToDateTime(new Date()), timeStampToClassDate(new Date()), emptyArray, emptyArray);
            deleteTag(objID, "objective");
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
function addObjectiveToList(id, title, description, expectedBy, status, isArchived, proposedBy, createdOn){
		if(isArchived === true || isArchived === 'true'){
			$("#obj-archived").append(objectiveListHTML(id, title, description, expectedBy, status, isArchived, proposedBy, createdOn));
		}else{
			$("#all-obj").append(objectiveListHTML(id, title, description, expectedBy, status, isArchived, proposedBy, createdOn));
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
        url: "http://"+getEnvironment()+":8080/toggleObjectiveArchive/"+getADLoginID(),
        method: "POST",
        xhrFields: {'withCredentials': true},
        data: {
            'objectiveId': objID,
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
	var createdOn = $('#obj-createdOn-'+objID).text();
	
	$("#objective-item-"+objID).fadeOut(400, function() { $(this).remove(); });
	addObjectiveToList(objID, title, description, expectedBy, status, archive, proposedBy, createdOn);	
}

//onclick to view feedback
function clickObjectiveFeedback(id){
	window.location.replace("http://"+getEnvironment()+"/mycareer/feedback"); 
}

function updateObjectiveStatusOnDB(objID, objStatus, title){
	if($('#obj-is-archived-'+objID).val() === 'true' || $('#obj-is-archived-'+objID).val() == true
			|| objStatus === parseInt($('#obj-status-'+objID).val()) || parseInt($('#obj-status-'+objID).val()) == 2){
		return false;
	}
    
    if(objStatus == 2){
	    $("#complete-id").empty().append(objID);
	    $("#complete-status").empty().append(objStatus);
	    $("#modal-confirmation").empty().append('Objective');
	    $("#modal-alert").empty().append('an Objective');
	    $("#completedTitle").empty().append(title);
	    openCompleteObjectiveModal(objID, title);
    }else{
        var userID = getADLoginID();
        var completedText = "";
        editObjectiveProgressOnDB(userID, objID, objStatus, title, completedText);
    }
}

function openCompleteObjectiveModal(id, title){
    $('#completed-status-modal').modal({backdrop: 'static', keyboard: false, show: true});
    $("textarea").val("");
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
            $("textarea").val("");
            $('#completed-status-modal').modal('hide');
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

//Method to handle the delete objective button onclick and appends objective title
function clickDeleteObjective(id, title){
    $("#delete-id").empty().append(id);
    $("#modal-title-type").empty().append('Objective');
    $("#modal-type").empty().append('Objective');
    $("#modal-warning").empty().append('an Objective');;
    $("#deleteTitle").empty().append(title);
    openDeleteObjectiveModal(id, title);
}

//Method to open delete modal
function openDeleteObjectiveModal(id, title){
    $('#deleteModal').modal({backdrop: 'static', keyboard: false, show: true});
    $("textarea").val("");
}

//method to remove objective from list and close delete Modal 
function removeObjectiveFromList(objID){
    nextObjId.sort(function(a,b){ return a - b;});
    var findId = nextObjId.indexOf(parseInt(objID));
    if(findId > -1){
        nextObjId.splice(findId, 1);
    }
    $("#objective-item-"+objID).fadeOut(400, function() {
        $(this).remove();
    });
    
    $("textarea").val("");
     $('#deleteModal').modal('hide');
}

//Function that returns objective list in html format with the parameters given
function objectiveListHTML(id, title, description, timeToCompleteBy, status, isArchived, proposedBy, createdOn){
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
					     <div class='col-xs-4 bs-wizard-step  "+ checkComplete(status, 2) +"' id='complete-obj-dot-"+id+"' onClick='updateObjectiveStatusOnDB("+id+",  2, \""+title+"\")'> \
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
                            <h6><b>Created on: </b><span id='obj-createdOn-"+id+"'>"+timeStampToLongDate(createdOn)+"</span></h6> \
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
                    " + objectivesButtonsHTML(id, isArchived, status, title); + " \
                </div> \
            </div> \
         \
        </div> \
    </div> \
    "                      
    return html;
}

function addEditObjButton(status, id){
	if(status !== 2 && status !=='2'){
		var editButton = " \
		<div class=' col-sm-6'> \
        	<button type='button' class='btn btn-block btn-default' id='edit-objective-button-"+id+"' onClick='openEditObjectiveModal("+id+")'>Edit</button> \
        </div>";
		return(editButton);
	}
	else{
		return("");
	}
}

function objectivesButtonsHTML(id, isArchived, status, title){
	var HTML = " \
    <div class='col-md-12'> \
		<div class='col-sm-6'> \
        	<button type='button' class='btn btn-block btn-default pull-left'  onClick='clickArchiveObjective("+id+", true)' id='archive-obj'>Archive</button> \
        </div>"
        +addEditObjButton(status, id)+
   "</div>";
	
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