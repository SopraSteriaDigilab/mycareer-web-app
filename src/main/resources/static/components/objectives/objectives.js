$(function() {
	
	//Get list of objectives
	getObjectivesList();
    
	//Load competencies section
	$( "#competencies" ).load( "../components/objectives/competencies/competencies.html" );
	
	//Get todays date an currentDate in the format of mm-yyyy
	var today = new Date();
	var currentDate = addZero(today.getFullYear() + '-' + (today.getMonth()+1));

	//Initialising the date picker
	initDatePicker(today, currentDate);

	//onClick for Submit modal
	$('#submit-obj').click(function(){ 
        clickSubmitObjective(currentDate); 
    });

	//modal validation.
	$('.modal-validate').keyup(function() { validateForm('modal-validate', 'submit-obj'); });

	$('#add-obj').click(function() { openAddModal(currentDate); });

	//3 onclicks to change the progress of the status bar of an objective
	//status goes from Awaiting, InFlight, Done
	$('.one').click(function(){ updateProgressBar(0); });
	$(".two").click(function(){ updateProgressBar(50); });
	$(".three").click(function(){ updateProgressBar(100); });

    //Navigation Pills to show All/Awaiting/InFlight/Done objectives
    $("#navTab").click(function(){});

	//updateNewProgressBar(-25);
});

var nextObjID = 0;
//List of months for conversion
var fullMonths = ['January','Febuary','March','April','May','June','July','August','September','October','November','December'];

//Gets the List of Objectives from the DB 
//reds db: http://ukl5cg6195g1q:8080/
//michaels db: http://item-s31509.dhcp.edin.uk.sopra:8080/
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

//Formatting from JS date to 'MMM YYYY' e.g 'December 2016'
function formatDate(date){
	if(date === 'Ongoing'){
		return 'Ongoing';
	}else{
	var originalDate = new Date(date);
    var year = originalDate.getFullYear();
    var month = fullMonths[originalDate.getMonth()];
    var formattedDate = month + ' ' + year;
	
	return formattedDate;
	}
}

//formatting from 'MMM-YYYY' format to 'MM-YYYY' e.g. December-2016 to 12-2016
function reveseDateFormat(date){
	var year = date.slice(-4, date.length);
	var monthFull = date.slice(0, -5);
	var monthIndex = (fullMonths.indexOf(monthFull)) +1;
	var reversedDate = year+'-'+ addZero(monthIndex);
	return reversedDate;
}

//formatting from yyyy/MM to MMM yyyy e.g. '2016/12' to 'December 2016'
function formatEditDate(date){
	
	var month = date.slice(-2, date.length);
	var year = date.slice(0, 4);
	var formattedDate = fullMonths[(month-1)] + ' ' + year;
	
	return formattedDate;
	
}

//onclick to view feedback
function clickObjectiveFeedback(id){
	highlight('feedback');
}

//Initialising the date picker
function initDatePicker(today, currentDate){
	//Set up date picker
	
	// $("#objective-date").val(currentDate);

	$("#objective-date-picker").datepicker({
		useCurrent: true,
		forceParse: false,
		disabled: true,
		// defaultDate: '01-10-2016',
		daysOfWeekDisabled: [0, 6],
		format: "yyyy-mm",
		// todayHighlight: true,
		// todayBtn: true,
		startView: "months", 
		minViewMode: "months",
		startDate: today,
		});
}

//Function to set up adn open add modal
function openAddModal(currentDate){
	$("#modal-type").val('add');
	var emptyString = '';
	setModal(emptyString, emptyString, emptyString, currentDate);
	showModal(true);
}

//Function to set up adn open add modal
function openEditModal(id){
	$("#modal-type").val('edit');
	var objID = id;
	var objTitle = $('#obj-title-'+id).text().trim();
	var objText = $('#obj-text-'+id).text().trim();
	var objDate = $('#obj-date-'+id).text().trim();
	objDate = reveseDateFormat(objDate);
	setModal(objID, objTitle, objText, objDate);
	showModal(false);
}

//Method for updating progress bar wth a value
function updateProgressBar(value){
	$('#objStatus').width(value + "%");
}

//Method to handle the submit objective button
//call the addobjective method then clear the modal
function clickSubmitObjective(currentDate){
	var type = $("#modal-type").val();
	
	var userID = 2312;
	var objID = $("#objective-id").val();
	var objTitle = $("#objective-title").val().trim();
	var objText = $("#objective-text").val().trim();
	var objDate = $("#objective-date").val().trim();

	// if(isEmpty(objText,"text-validate") | isEmpty(objDate, "date-validate")){
	// 	return;
	// }
	if(type == 'add'){
		addObjectiveToDB(userID, objTitle, objText, objDate);
		addObjectiveToList((++nextObjID), objTitle, objText, formatEditDate(objDate));
	}else{
		editObjectiveOnDB(userID, objID, objTitle, objText, objDate);
		editObjectiveOnList(userID, objID, objTitle, objText, objDate);
	}
	clearModal(currentDate)
}

//Function to add objective to list
function addObjectiveToList(id, title, description, expectedBy){
	$("#obj-list").append(objectiveListHTML(id, title, description, expectedBy));
}

//Function to update objective on list
function editObjectiveOnList(userID, objID, title, text, date){
	$('#obj-title-'+objID).text(title);
	$('#obj-text-'+objID).text(text);
	$('#obj-date-'+objID).text('').append('<h6><b>' + formatEditDate(date) + '</b></h6>');
}

//HTTP request for adding an objective
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
    
//	alert("Title is : " + objTitle + " | Objective is: " + objText + " | Date is: " + objDate);
}

//Placeholder for http request to EDIT an objective!!
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


//Method that shows modal and default button to enabled/disabled
function showModal(enabledButton){
	$('#submit-obj').prop("disabled", enabledButton);
	$('#objectiveModal').modal({backdrop: 'static', keyboard: false, show: true});
}

//Method to close and clear modal
function clearModal(currentDate){
	$('#objectiveModal').modal('hide');
	var emptyString = '';
	setModal(emptyString, emptyString, currentDate)
	$('#submit-obj').prop("disabled", true);
}

//Method to adjust month format (add '0' for single digit months)
function addZero(month){
	if (month < 10){
		return '0' + month;
	}
	return month;
}

//method that enables the submit button only when all inputs in the modal have content
function validateForm(inputClass, submitButtonID){
	var isEmpty = false;

	$('.'+inputClass).each(function(i) {
		value = $(this).val().trim();
		if(!value){
			isEmpty = true;
			return;
		}
	});
	
	
	if(isEmpty){
		$('#'+submitButtonID).prop("disabled", true);
	}else{
		$('#'+submitButtonID).prop("disabled", false);
	}
}

//Method to set content of modal
function setModal(id, title, text, date){
	$("#objective-id").val(id);
	$("#objective-title").val(title);
	$("#objective-text").val(text);
	$("#objective-date").val(date);
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
                    <div class='col-sm-5' id='obj-title-"+id+"'><h5> "+title+" </h5></div> \
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
                    </div><br> \
                    <div class='col-md-12'> \
                        <div class='col-sm-6'> \
                           <button type='button' class='btn btn-block btn-default' onClick='clickObjectiveFeedback("+id+")'>View Feedback</button> \
                        </div> \
                        <div class='col-sm-6'> \
                            <button type='button' class='btn btn-block btn-default' onClick='openEditModal("+id+")'>Edit</button> \
                        </div> \
                    </div> \
                </div> \
            </div> \
        </div> \
    </div> \
    "
                            
    return html;
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