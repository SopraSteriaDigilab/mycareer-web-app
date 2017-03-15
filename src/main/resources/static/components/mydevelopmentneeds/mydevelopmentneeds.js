$(function() {
	
	//Get list of development needs
	getDevelopmentNeedsList(getADLoginID());
	
	//Initialising the date picker
	initDatePicker('development-need', new Date());
	
	//onClick for opening modal
	$('#add-dev-need').click(function() { openAddDevelopmentNeedModal(); });
	
	//modal validation.
	$('.development-need-modal-validate').keyup(function() { validateForm('development-need-modal-validate', 'submit-dev-need'); });
	
	//hide/show date field
	$('#timeframe-radio').change(function(){ toggleInputeDate($('#timeframe-radio input:radio:checked').val()); });
	
	//onClick for Submit modal
	$('#submit-dev-need').click(function(){ clickSubmitDevelopmentNeed(); });
	
    //Ensuring all the development need items are shown
    $("#dev-need-all-tab").click(function(){ $(".unarchived-dev-item").css('display', ''); });
    $("#dev-need-proposed-tab").click(function(){ $('.proposed').css({'display':''}); });
    $("#dev-need-started-tab").click(function(){ $('.started').css({'display':''}); });
    $("#dev-need-completed-tab").click(function(){ $('.completed').css({'display':''}); });
	
  //onClick for Close modal
	$('#close-dev-need, #close-dev-need-cross').on('click', function(e) { clickCloseDevNeed(e); });
    
});

//HTTP request for INSERTING an development need to DB
function addDevelopmentNeedToDB(userID, devNeedTitle, devNeedText, devNeedCategory, devNeedDate){
    $.ajax({
        url: "http://"+getEnvironment()+":8080/addDevelopmentNeed/"+userID,
        method: "POST",
        xhrFields: {'withCredentials': true},
        data: {
            'title': devNeedTitle,
            'description': devNeedText,
            'category': devNeedCategory,
            'timeToCompleteBy': devNeedDate
        },
        success: function(response){
            if(lastDevID == 0)
        		$("#all-dev-need").removeClass("text-center").empty(); 
            addDevelopmentNeedToList((++lastDevID), devNeedTitle, devNeedText, devNeedCategory, formatDate(devNeedDate), 0, false);
		    showProposedDevelopmentTab();
            toastr.success(response);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            toastr.error(XMLHttpRequest.responseText);
        } 
    });
}

//HTTP request for INSERTING an development need to DB
function editDevelopmentNeedOnDB(userID, devNeedID, devNeedTitle, devNeedText, devNeedCategory, devNeedDate, devNeedStatus){
    $.ajax({
        url: "http://"+getEnvironment()+":8080/editDevelopmentNeed/"+userID,
        method: "POST",
        xhrFields: {'withCredentials': true},
        data: {
            'devNeedID': devNeedID,
            'title': devNeedTitle,
            'description': devNeedText,
            'category': devNeedCategory,
            'timeToCompleteBy': devNeedDate,
            'progress': devNeedStatus
        },
        success: function(response){
            editDevelopmentNeedOnList(devNeedID, devNeedTitle, devNeedText, devNeedCategory, devNeedDate, devNeedStatus);
            toastr.success(response);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            toastr.error(XMLHttpRequest.responseText);
        }
    });
}

//HTTP request for UPDATING a development need in DB
function editDevelopmentNeedProgressOnDB(userID, devNeedID, devNeedStatus){
    $.ajax({
        url: "http://"+getEnvironment()+":8080/editDevelopmentNeedProgress/"+userID,
        method: "POST",
        xhrFields: {'withCredentials': true},
        data: {
            'devNeedID': devNeedID,
            'progress': devNeedStatus
        },
        success: function(response){
        	updateDevelopmentNeedStatusOnList(devNeedID, devNeedStatus);
            toastr.success(response);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            toastr.error(XMLHttpRequest.responseText);
        },
    });
}

//Function to set up and open ADD development-need modal
function openAddDevelopmentNeedModal(){
	$("#dev-need-modal-type").val('add');
	setDevelopmentNeedModalContent('', '', '', categoryIDs[0], getToday(), 0, 0);
	showDevelopmentNeedModal(true);
}

//Function to set up and open EDIT development-need modal
function openEditDevelopmentNeedModal(id){
	$("#dev-need-modal-type").val('edit');
	var devNeedID = id;
	var devNeedTitle = $('#dev-need-title-'+id).text().trim();
	var devNeedText = $('#dev-need-text-'+id).text().trim();
	var devNeedCategory = categoryIDs[$('#dev-need-category-id-'+id).val()];
	var devNeedDate =  $('#dev-need-date-'+id).text().trim();
	var devNeedStatus = $('#dev-need-status-'+id).val();
	devNeedDate = reverseDateFormat(devNeedDate);
	setDevelopmentNeedModalContent(devNeedID, devNeedTitle, devNeedText, devNeedCategory, devNeedDate, 1, devNeedStatus);
	showDevelopmentNeedModal(true);	
}

//Function to add development need to list
function addDevelopmentNeedToList(id, title, description, category, expectedBy, status, isArchived, devNeedCreationDate){
    if(isArchived === true || isArchived === 'true'){
        $('#dev-need-archived').append(developmentNeedListHTML(id, title, description, category, expectedBy, status, isArchived, devNeedCreationDate));
    }else{
        $("#all-dev-need").append(developmentNeedListHTML(id, title, description, category, expectedBy, status, isArchived, devNeedCreationDate));
    }
}

//Function to update development need on list
function editDevelopmentNeedOnList(devNeedID, title, description, category, expectedBy, status){
	$('#dev-need-title-'+devNeedID).text(title);
	$('#dev-need-text-'+devNeedID).text(description);
	$('#dev-need-category-'+devNeedID).text(categoryList[category]);
	$('#dev-need-category-id-'+devNeedID).val(category);
	$('#dev-need-date-'+devNeedID).text('').append("<h6 class='pull-right'><b>" + formatDate(expectedBy) + "</b></h6>");
	$('#dev-need-status-'+devNeedID).val(status);
}

//Method to handle the archive objective button
function clickArchiveDevNeed(devNeedID, archive){
	$('#dev-need-is-archived-'+devNeedID).val(archive);
	editDevNeedArchiveOnDB(devNeedID, archive);
}

function editDevNeedArchiveOnDB(devNeedID, archive){
    $.ajax({
        url:"http://"+getEnvironment()+":8080/toggleDevNeedArchive/"+getADLoginID(),
        method: "POST",
        xhrFields: {'withCredentials':true},
        data: {
            'developmentNeedID': devNeedID,
            'isArchived': archive
        },
        success: function(response){
            updateDevelopmentNeedsList(devNeedID);
            if(!archive){
                updateArchiveTabDevNeeds();
            }
            toastr.success(response);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            toastr.error(XMLHttpRequest.responseText);   
        }
    });
}

function updateDevelopmentNeedsList(devNeedID){
    var title = $('#dev-need-title-'+devNeedID).text();
    var description = $('#dev-need-text-'+devNeedID).text();
    var expectedBy = $('#dev-need-date-'+devNeedID).text();
    var category = $('#dev-need-category-'+devNeedID).text();
    var categoryID = $('#dev-need-category-id-'+devNeedID).val();
    var status = $('#dev-need-status-'+devNeedID).val();
    var isArchived = $('#dev-need-is-archived-'+devNeedID).val();

    $("#development-need-item-"+devNeedID).fadeOut(400, function() {
        $(this).remove();
    });
    addDevelopmentNeedToList(devNeedID, title, description, categoryID, expectedBy, status, isArchived);
}

function updateDevelopmentNeedStatusOnDB(devNeedID, devNeedStatus){
	if($('#dev-need-is-archived-'+devNeedID).val() === 'true' || $('#dev-need-is-archived-'+devNeedID).val() == true || devNeedStatus === parseInt($('#dev-need-status-'+devNeedID).val())){
		return false;
	}
	var userID = getADLoginID();
	editDevelopmentNeedProgressOnDB(userID, devNeedID, devNeedStatus);
}

function updateDevelopmentNeedStatusOnList(devNeedID, devNeedStatus){
	$('#dev-need-status-'+devNeedID).val(devNeedStatus);

	switch(parseInt(devNeedStatus)){
		case 0:
			$('#started-dev-need-dot-'+devNeedID).removeClass('complete');
			$('#complete-dev-need-dot-'+devNeedID).removeClass('complete');
			break;
		case 1:
			$('#started-dev-need-dot-'+devNeedID).addClass('complete');
			$('#complete-dev-need-dot-'+devNeedID).removeClass('complete');
			break;
		case 2:
			$('#started-dev-need-dot-'+devNeedID).addClass('complete');
			$('#complete-dev-need-dot-'+devNeedID).addClass('complete');
	}
	
	if(!($("#dev-need-all-tab").hasClass("active"))){
		$("#development-need-item-"+devNeedID).fadeOut();
	}
	
	$("#development-need-item-"+devNeedID).removeClass("proposed started completed");
	$("#development-need-item-"+devNeedID).addClass(statusList[parseInt(devNeedStatus)]);	
}

function updateArchiveTabDevNeeds(){
	$(".panel-group").each(function(){
		if($(this).hasClass("archived-dev-item")){
			$(this).addClass("active in");
		}else{
			$(this).removeClass("active in");
		}
	});
}

function isArchivedItem(isArchived){
	if(isArchived == true || isArchived === "true"){
		return "archived-dev-item";
	}
	return "unarchived-dev-item"
}

//Function that returns dev needs list in html format with the parameters given
function developmentNeedListHTML(id, title, description, category, timeToCompleteBy, status, isArchived, timeStamp){
	var html = " \
    <div class='panel-group tab-pane fade dev-need "+isArchivedItem(isArchived)+" "+statusList[status]+" active in' id='development-need-item-"+id+"'> \
        <div class='panel panel-default' id='panel'> \
	        <input type='hidden' id='dev-need-status-"+id+"' value='"+status+"'> \
	        <input type='hidden' id='dev-need-category-id-"+id+"' value='"+category+"'> \
            <input type='hidden' id='dev-need-is-archived-"+id+"' value='"+isArchived+"'> \
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
            			 <div class='col-xs-4 bs-wizard-step complete' id='proposed-dev-need-dot-"+id+"' onClick='updateDevelopmentNeedStatusOnDB("+id+", 0)'> \
					      <div class='text-center progress-link' id='test' style='cursor:pointer'><h6>Proposed</h6></div> \
					      <div  class='bs-wizard-dot-start' style='cursor:pointer'></div> \
					     </div> \
					     <div class='col-xs-4 bs-wizard-step "+ checkComplete(status, 1) +"' id='started-dev-need-dot-"+id+"' onClick='updateDevelopmentNeedStatusOnDB("+id+", 1)'> \
					       <div class='text-center progress-link' style='cursor:pointer'><h6>In-Progress</h6></div> \
					       <div class='progress'><div class='progress-bar'></div></div> \
					       <div  class='bs-wizard-dot-start' style='cursor:pointer'></div> \
					       <div  class='bs-wizard-dot-complete' style='cursor:pointer'></div> \
					     </div> \
					     <div class='col-xs-4 bs-wizard-step "+ checkComplete(status, 2) +"' id='complete-dev-need-dot-"+id+"' onClick='updateDevelopmentNeedStatusOnDB("+id+", 2)'> \
					       <div class='text-center progress-link' style='cursor:pointer'><h6>Complete</h6></div> \
					       	 <div class='progress'><div class='progress-bar'></div></div> \
					        <div class='bs-wizard-dot-start' style='cursor:pointer'></div> \
					        <div  class='bs-wizard-dot-complete' style='cursor:pointer'></div> \
					     </div> \
            		</div> \
            		<div class='col-sm-1 chev-height'> \
					  <a data-toggle='collapse' href='#collapse-dev-need-"+id+"' class='collapsed'></a> \
					</div> \
            	</div> \
            </div> \
        \
            <div id='collapse-dev-need-"+id+"' class='panel-collapse collapse'> \
    \
                <div class='panel-body'> \
                    <div class='row'> \
                        <div class='col-md-6'> \
                            <h6><b>Created on: </b><span id='dev-need-createdOn-"+id+"'>"+timeStampToLongDate(timeStamp)+"</span></h6> \
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
                    " + devNeedsButtonsHTML(id, isArchived); + " \
                </div> \
            </div> \
             \
        </div> \
    </div> \
    "                     
    return html;
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

function clickSubmitDevelopmentNeed(){
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

