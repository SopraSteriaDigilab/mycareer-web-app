$(function() {

	//Get todays date an currentDate in the format of mm-yyyy
	var today = new Date();
	var currentDate = adjustMonth(today.getFullYear() + '-' + (today.getMonth()+1));

	//Initialising the date picker
	initDatePicker(today, currentDate);

	//onClick for Submit modal
	$('#submit-obj').click(function(){ clickSubmitObjective(currentDate); })

	//modal validation.
	$('.modal-validate').keyup(function() { validateModal(currentDate); });

	//onClick for Edit button
	$('.edit-obj').click( function() { openEditModal(this.id); });

	$('#add-obj').click(function() { openAddModal(currentDate); });



	//3 onclicks to change the progress of the status bar of an objective
	//status goes from Awaiting, InFlight, Done
	$('.one').click(function(){ updateProgressBar(0); });
	$(".two").click(function(){ updateProgressBar(50); });
	$(".three").click(function(){ updateProgressBar(100); });

	//function when clicked View Feedback, My Feedback shows
	$("#view-fee").click(function() {
        $("#fee").addClass("selected");
		$("#obj").removeClass("selected");
        $("#feedback").show();
		$("#objectives").hide();
    
    });
    
    //Navigation Pills to show All/Awaiting/InFlight/Done objectives
    $("#navTab").click(function(){
                      
    });

	updateNewProgressBar(-25);
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
	var objTitle = $('#obj-title-1').text().trim();
	var objText = $('#obj-text-1').text().trim();
	var objDate = $('#obj-date-1 h6').text().trim();
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
	var url = "http://localhost:8080/addObjective/"+userID;
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

function updateNewProgressBar(score){

	if(score > 0){
		$('#feedback-progress-1').removeClass("progress-bar-danger");
		$('#feedback-progress-1').addClass("progress-bar-success");
		$('#feedback-progress-1').css('margin-left', (50 +'%'));
		$('#feedback-progress-1').width(score + '%')
	}else{
		$('#feedback-progress-1').removeClass("progress-bar-success");
		$('#feedback-progress-1').addClass("progress-bar-danger");
		$('#feedback-progress-1').css('margin-left', (50 + score) + '%');
		$('#feedback-progress-1').width(-score + '%')
	}


}




//function isEmpty(value, className){
//	if(!value){
//		$('#' + className).addClass("has-error");
//		return true;
//	}else{
//		$('#' + className).removeClass("has-error");
//		return false;
//	}
//}