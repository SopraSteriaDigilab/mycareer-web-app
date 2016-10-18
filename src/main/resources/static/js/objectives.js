$(function() {
    
    
    //Gets the List of Objectives from the DB 
    //reds db: http://ukl5cg6195g1q:8080/
    //michaels db: http://item-s31509.dhcp.edin.uk.sopra:8080/
    $.ajax({
        url: 'http://ukl5cg6195g1q:8080/getObjectives/2312',
        method: 'GET',
        success: function(data){
            console.log('success', data);
            $.each(data, function(key, val){
//                console.log(val.id);
//                console.log(val.timeToCompleteBy);
//                console.log(val.title);
//                console.log(val.progress);
//                console.log(val.description);
                

               $(".objList").append("<div class='panel-group' id='accordion'>"+
                                        "<div class='panel panel-default' id='panel'>"+
                                            "<div class='panel-heading'>"+
                                                "<div class='row'>"+
                                                    "<div class='col-sm-6' id='obj-no'><h6><b>Objective " + val.id + "</b></h6></div>"+
                                                        "<div class='col-sm-6' id='obj-date-"+val.id+"'><h6><b>" + val.timeToCompleteBy + "</b></h6></div>"+
                                            "</div><br>"+
                                            "<div class='row'>"+
                                                "<div class='col-sm-5' id='obj-title-"+val.id+"'><h5>" + val.title + "</h5></div>"+
                                                    "<div class='col-sm-5'><br>"+
                                                        "<div class='progress progress-striped'>"+
                                                            "<div class='one primary-color' style='cursor:pointer' id='awaiting-progress'><h5 class='progress-label'>Awaiting</h5></div>"+
                                                            "<div class='two primary-color' style='cursor:pointer' id='inflight-progress'><h5 class='progress-label'>InFlight</h5></div>"+
                                                            "<div class='three primary-color' style='cursor:pointer' id='done-progress'><h5 class='progress-label'>Done</h5></div>"+
                                                            "<div class='progress-bar' id='objStatus' role='progressbar' aria-valuemin='0' aria-valuemax='100'></div>"+
                                                        "</div>"+
                                                    "</div>"+
                                                "<div class='col-sm-2'>"+
                                                "<a data-toggle='collapse' href='#collapse"+val.id+"' class='collapsed'></a>"+    
                                                "</div>"+     
                                            "</div>"+
                                        "</div>"+
            
                                          "<div id='collapse"+val.id+"' class='panel-collapse collapse'>"+
                                              "<div class='panel-body'>"+
                                                "<div class='row'>"+
                                                  "<div class='col-md-4'>"+
                                                    "<h5><b>Description</b></h5>"+
                                                  "</div>"+
                                                 " <div class='col-md-8'>"+
                                                    "<div class='row'>"+
                                                      "<div class='col-md-6'>"+
                                                        "<div class='bottomless progress progress-striped'>"+
                                                          "<div class='progress-bar progress-bar-success progress-middle' id='personal-progress-1' role='progressbar' aria-valuemin='0' aria-valuemax='100'></div>"+
                                                        "</div>"+
                                                      "</div>"+
                                                      "<div class='col-md-6'>"+
                                                        "<div class='bottomless progress progress-striped'>"+
                                                          "<div class='progress-bar progress-bar-success progress-middle' id='feedback-progress-1' role='progressbar' aria-valuemin='0' aria-valuemax='100'></div>"+
                                                        "</div>"+
                                                      "</div>"+
                                                    "</div>"+
                                                  "</div>"+
                                                "</div>"+
                                              "<div class='row'>"+
                                                "<div class='col-md-12' id='obj-text-1'>"+
                                                  "<p id='obj-text-"+val.id+"'>" + val.description + "</p>"+
                                                "</div>"+
                                              "</div><br>"+
                                                      "<div class='col-md-12'>"+
                                                          "<div class='col-sm-6'>"+
                                                            "<button type='button' class='btn btn-block btn-default view-fee' id='Feedback'>View Feedback</button>"+
                                                          "</div>"+            
                                                          "<div class='col-sm-6'>"+
                                                              "<button type='button' class='btn btn-block btn-default' id='edit-"+val.id+"'>Edit</button>"+  
                                                          "</div>"+
                                                      "</div>"+    
                                              "</div>"+
                                           "</div>"+
                                        "</div>"+
                                      "</div><!-- End of Objective accordion -->");
            });
            
            
            
            
            
            
            
            
        
    },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            console.log('error', errorThrown);
        }
        
        
        
    });
    
	//Get todays date an currentDate in the format of mm-yyyy
	var today = new Date();
	var currentDate = adjustMonth(today.getFullYear() + '-' + (today.getMonth()+1));

	//Initialising the date picker
	initDatePicker(today, currentDate);

	//onClick for Submit modal
	$('#submit-obj').click(function(){ clickSubmitObjective(currentDate); });

	//modal validation.
	$('.modal-validate').keyup(function() { validateModal(currentDate); });
   
	//onClick for Edit button
	$('#edit-1').click(function(){ 
        
        alert("clicked");
        openEditModal(this.id); });

	$('#add-obj').click(function() { openAddModal(currentDate); });


	//3 onclicks to change the progress of the status bar of an objective
	//status goes from Awaiting, InFlight, Done
	$('.one').click(function(){ updateProgressBar(0); });
	$(".two").click(function(){ updateProgressBar(50); });
	$(".three").click(function(){ updateProgressBar(100); });

	//function when clicked View Feedback, My Feedback shows
	$("#Feedback").click(function() {
        $("#fee").addClass("selected");
		$("#obj").removeClass("selected");
        $("#feedback").show();
		$("#objectives").hide();
    
    });
    
    //Navigation Pills to show All/Awaiting/InFlight/Done objectives
    $("#navTab").click(function(){
                      
    });

	//updateNewProgressBar(-25);
});



//Initialising the date picker
function initDatePicker(today, currentDate){
	//Set up date picker
	
	// $("#objective-date").val(currentDate);

	$("#objective-date-picker").datepicker({
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
	$("#modalType").val('add');
	var emptyString = '';
	setModal(emptyString, emptyString, currentDate);
	showModal(true);
}

//Function to set up adn open add modal
function openEditModal(id){
	$("#modalType").val('edit');
	var objTitle = $('#obj-title-'+val.id+'').text().trim();
	var objText = $('#obj-text-'+val.id+'').text().trim();
	var objDate = $('#obj-date-'+val.id+'').text().trim();
	setModal(objTitle, objText, objDate);
	showModal(false);
}

//Method for updating progress bar wth a value
function updateProgressBar(value){
	$('#objStatus').width(value + "%");
}

//Method to handle the submit objective button
//call the addobjective method then clear the modal
function clickSubmitObjective(currentDate){
	var type = $("#modalType").val();
	
	var userID = 2312;
	var objTitle = $("#objective-title").val().trim();
	var objText = $("#objective-text").val().trim();
	var objDate = $("#objective-date").val().trim();

	// if(isEmpty(objText,"text-validate") | isEmpty(objDate, "date-validate")){
	// 	return;
	// }
	if(type == 'add'){
		addObjective(userID, objTitle, objText, objDate);
	}else{
		editObjective(userID, objTitle, objText, objDate);
	}
	clearModal(currentDate)
}

//HTTP request for adding an objective
function addObjective(userID, objTitle, objText, objDate){
	var url = "http://item-s31509.dhcp.edin.uk.sopra:8080/addObjective/"+userID;
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
	  alert(response);
	});
//	
//	alert("Title is : " + objTitle + " | Objective is: " + objText + " | Date is: " + objDate);
}

//Placeholder for http request to EDIT an objective!!
function editObjective(userID, objTitle, objText, objDate){
	alert("EDIT!")
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
function adjustMonth(month){
	if (month < 10){
		return '0' + month;
	}
	return month;
}

//method that enables the submit button only when all inputs in the modal have content
function validateModal(){
	var isEmpty = false;

	$('.modal-validate').each(function(i) {
		value = $(this).val().trim();
		if(!value){
			isEmpty = true;
			return;
		}

	});

	if(isEmpty){
		$('#submit-obj').prop("disabled", true);
	}else{
		$('#submit-obj').prop("disabled", false);
	}
}

//Method to set content of modal
function setModal(title, text, date){
	$("#objective-title").val(title);
	$("#objective-text").val(text);
	$("#objective-date").val(date);
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