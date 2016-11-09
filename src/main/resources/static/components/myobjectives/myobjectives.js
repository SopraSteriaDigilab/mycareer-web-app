$(function() {
	
	//Get list of objectives
	getObjectivesList();
    
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


	//3 onclicks to change the progress of the status bar of an objective
	//status goes from Awaiting, InFlight, Done
	$('.one').click(function(){ updateProgressBar(0); });
	$(".two").click(function(){ updateProgressBar(50); });
	$(".three").click(function(){ updateProgressBar(100); });

    //Navigation Pills to show All/Awaiting/InFlight/Done objectives
    $("#navTab").click(function(){});

});


var nextObjID = 0;

//HTTP request for RETRIEVING list of objectives from DB
function getObjectivesList(){
  $.ajax({
      url: 'http://127.0.0.1:8080/getObjectives/2312',
      method: 'GET',
      success: function(data){
          $.each(data, function(key, val){
          	nextObjID = val.id;
          	excpectedBy = formatDate(val.timeToCompleteBy);
          	addObjectiveToList(val.id, val.title, val.description, excpectedBy);
          });
      },
      error: function(XMLHttpRequest, textStatus, errorThrown){
          console.log('error', errorThrown);
          toastr.error("Sorry, there was a problem getting objectives, please try again later.");
      }
  });	
}

//HTTP request for INSERTING an objective to DB
function addObjectiveToDB(userID, objTitle, objText, objDate){
	var url = "http://127.0.0.1:8080/addObjective/"+userID;
	var data = {};
	data["title"] = objTitle;
	data["description"] = objText;
	data["completedBy"] = objDate;
  data["progress"] = 0;
  
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
function editObjectiveOnDB(userID, objID, objTitle, objText, objDate){
	var url = "http://127.0.0.1:8080/editObjective/"+userID;
	var data = {};
	data["objectiveID"] = objID;
	data["title"] = objTitle;
	data["description"] = objText;
	data["completedBy"] = objDate;
	data["progress"] = 0;
  
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
	setObjectiveModalContent('', '', '', getToday(), true);
	showObjectiveModal(true);
}

//Function to set up and open EDIT objective modal
function openEditObjectiveModal(id){
	$("#obj-modal-type").val('edit');
	var objID = id;
	var objTitle = $('#obj-title-'+id).text().trim();
	var objText = $('#obj-text-'+id).text().trim();
	var objDate = $('#obj-date-'+id).text().trim();
	objDate = reverseDateFormat(objDate);
	setObjectiveModalContent(objID, objTitle, objText, objDate, false);
	showObjectiveModal(true);
}


//Method to handle the submit objective button
function clickSubmitObjective(){
	var type = $("#obj-modal-type").val();
	
	var userID = 2312;
	var objID = $("#objective-id").val();
	var objTitle = $("#objective-title").val().trim();
	var objText = $("#objective-text").val().trim();
	var objDate = $("#objective-date").val().trim();
	
	if(type == 'add'){
		addObjectiveToDB(userID, objTitle, objText, objDate);
		addObjectiveToList((++nextObjID), objTitle, objText, formatDate(objDate));
	}else{
		editObjectiveOnDB(userID, objID, objTitle, objText, objDate);
		editObjectiveOnList(userID, objID, objTitle, objText, objDate);
	}
	
	showObjectiveModal(false);
}

//Function to add objective to list
function addObjectiveToList(id, title, description, expectedBy){
	$("#obj-list").append(objectiveListHTML(id, title, description, expectedBy));
}

//Function to update objective on list
function editObjectiveOnList(userID, objID, title, text, date){
	$('#obj-title-'+objID).text(title);
	$('#obj-text-'+objID).text(text);
	$('#obj-date-'+objID).text('').append('<h6><b>' + formatDate(date) + '</b></h6>');
}

//Method to set and show content of modal
function setObjectiveModalContent(id, title, text, date, isAdd){
	$('#obj-modal-title-type').text(setTitleType(isAdd));
	$("#objective-id").val(id);
	$("#objective-title").val(title);
	$("#objective-text").val(text);
	$("#objective-date").val(date);
	$('#submit-obj').prop("disabled", isAdd);
}

//Method to show/hide objective modal
function showObjectiveModal(show){
	if(show){
		$('#objective-modal').modal({backdrop: 'static', keyboard: false, show: true});
	}else{
		setObjectiveModalContent('', '', '', getToday(), true);
		$('#objective-modal').modal('hide');
	}
}

//onclick to view feedback
function clickObjectiveFeedback(id){
	window.location.replace("http://localhost:8000/mycareer/feedback"); 
}


//Function that returns objective list in html format with the parameters given
function objectiveListHTML(id, title, description, timeToCompleteBy){
	var html = " \
    <div class='panel-group' id='accordion'> \
        <div class='panel panel-default' id='panel'> \
            <div class='panel-heading'> \
                <div class='row'> \
                    <div class='col-sm-6' id='obj-no-"+id+"'> # "+id+" </div> \
                    <div class='col-sm-6' id='obj-date-"+id+"'><h6><b>"+timeToCompleteBy+"</b></h6></div> \
                </div><br> \
                <div class='row'> \
                    <div class='col-sm-5 wrap-text' id='obj-title-"+id+"'><h5> "+title+" </h5></div> \
                        <div class='col-sm-5'><br> \
                            <div class='progress progress-striped'> \
                                <div class='one primary-color' style='cursor:pointer' id='awaiting-progress'><h5 class='progress-label'>Awaiting</h5></div> \
                                <div class='two primary-color' style='cursor:pointer' id='inflight-progress'><h5 class='progress-label'>InFlight</h5></div> \
                                <div class='three primary-color' style='cursor:pointer' id='done-progress'><h5 class='progress-label'>Done</h5></div> \
                                <div class='progress-bar' id='objStatus' role='progressbar' aria-valuemin='0' aria-valuemax='100'></div> \
                            </div> \
                        </div> \
                        <div class='col-sm-2'> \
                            <a data-toggle='collapse' href='#collapse-obj-"+id+"' class='collapsed'></a> \
                        </div> \
                </div> \
            </div> \
        \
            <div id='collapse-obj-"+id+"' class='panel-collapse collapse'> \
                <div class='panel-body'> \
                    <div class='row'> \
                        <div class='col-md-4'> \
                            <h5><b>Description</b></h5> \
                        </div> \
                        <div class='col-md-8'> \
                            <div class='row'> \
                                <div class='col-md-6'> \
                                    <div class='bottomless progress progress-striped'> \
                                        <div class='progress-bar progress-bar-success progress-middle' id='personal-progress-1' role='progressbar' aria-valuemin='0' aria-valuemax='100'></div> \
                                    </div> \
                                </div> \
                                <div class='col-md-6'> \
                                    <div class='bottomless progress progress-striped'> \
                                        <div class='progress-bar progress-bar-success progress-middle' id='feedback-progress-1' role='progressbar' aria-valuemin='0' aria-valuemax='100'></div> \
                                    </div> \
                                </div> \
                            </div> \
                        </div> \
                    </div> \
                    <div class='row'> \
                        <div class='col-md-12 wrap-text'> \
                            <p id='obj-text-"+id+"'>"+description+"</p> \
                        </div> \
                    </div> \
                    <div class='col-md-12'> \
                        <div class='col-sm-6'> \
                           <button type='button' class='btn btn-block btn-default' onClick='clickObjectiveFeedback("+id+")'>View Feedback</button> \
                        </div> \
                        <div class='col-sm-6'> \
                            <button type='button' class='btn btn-block btn-default' onClick='openEditObjectiveModal("+id+")'>Edit</button> \
                        </div> \
                    </div> \
                </div> \
            </div> \
        </div> \
    </div> \
    "
                            
    return html;
}





//Method for updating progress bar wth a value
function updateProgressBar(value){
	$('#objStatus').width(value + "%");
}


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