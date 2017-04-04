$(function() {
	
	//Get list of general feedback
    getGeneralFeedbackList(getADLoginID());
    
    //initialise Tags
    tags("requestingTo", emails);
    tags("sendingTo", emails);
    
	//Initialising the date pickers
	initFeedbackDatePicker("feedback-start", '');
	initFeedbackDatePicker("feedback-end", new Date());
	
	//Keep end date updated
	$("#feedback-start-date").change(function (d){ updateEndDate() });
	
	$("#submit-date-filter").click(function (){ applyDateFilter() })

	$("#general-reviewer-list").change(function(){ applyReviewerFilter(); });
    
    //feedback request modal key preses
	keypress('requestFeedbackModal');
    keypress('sendFeedbackModal');
    
    //modal validation
    $('.send-feedback-validate').keyup(function() { validateForm('send-feedback-validate', 'submit-send-feedback'); });
	 
    //click to open up feedback request modal
    $('#request-feedback').click(function(){ openRequestFeedbackModal() });
    
    //click to open up feedback sent modal
    $('#send-feedback').click(function(){ openSendFeedbackModal() });
    
    //click to submit feedback request
    $('#submit-request-feedback').click(function(){ 
       if (validEmails($('#requestingTo').val())){
            submitFeedbackRequest();
        }else{
            toastr.error("One or more email addresses entered are not valid");
        }
     });
    
    //click to submit send feedback
    $('#submit-send-feedback').click(function(){ 
       if (validEmails($('#sendingTo').val())){
            submitSendFeedback();
        }else{
            toastr.error("One or more email addresses entered are not valid");
        }    
     });
    
    //click to open a modal that shows the feedback email template
    $("#view-feedback-template").click(function(){ $('#emailTemplateModal').modal('show') });
    //click to open a modal that shows the feedback suggestion template
    $("#view-feedback-suggestion-template").click(function(){ $('#feedbackTemplateModal').modal('show') });
    
    //onClick for Close send feedback modal
	$('#cancelSendModal, #close-feedback-send-modal').on('click', function(e) { clickCloseSendFeedback(e); });
    
    //onClick for Close request feedback modal
	$('#cancelRequestModal, #close-feedback-request-modal').on('click', function(e) { clickCloseRequestFeedback(e); });
    
});//End of Document Function


//var emailList = [];
var dateFilterApplied = false;
var reviewerFilterApplied = false;
var firstFeedback = true;

function initFeedbackDatePicker(id, start){
    
    $("#"+id+"-date-picker").datepicker({
	   useCurrent: true,
       forceParse: false,
       disabled: true,
       format: "dd-mm-yyyy",
       startDate: start,
       orientation: 'bottom',
       autoclose: true,
    });	
    $("#feedback-start-date, #feedback-end-date").val(timeStampToClassDate(new Date()));
}

function addGeneralFeedbackToList(id, sender, description, date, classDate, email, objTagIds, devNeedTagIds){
      $('#general-feedback-tab').append(feedbackSendersListHTML(id, sender, date, classDate, email, objTagIds, devNeedTagIds));
      $('#generalFeeDescription').append(feedbackDescriptionListHTML(id, sender, description, date, classDate, email, objTagIds, devNeedTagIds));
      if(!reviewerExists(email)){
    	  $('#general-reviewer-list').append(feedbackReviewersListHTML(sender, email));
      }
}

function selectedFeedback(element){
	$(".sender-panel").each(function(index){
		if(element.id == this.id){
			$(this).addClass("selected-panel");
		}else{
			$(this).removeClass("selected-panel");
		}
	});     
}

function feedbackSendersListHTML(id, sender, date, classDate, email, objTagIds, devNeedTagIds){
	var HTML = " \
        <div class='panel panel-default sender-panel filterable-feedback' id='view-fee-"+id+"' style='cursor:pointer' onClick='selectedFeedback(this)'> \
        	<input type='hidden' class='reviewer-filter' value='"+email+"'> \
        	<input type='hidden' class='date-filter' value='"+classDate+"'> \
	  		<input type='hidden' class='feedback-obj-tag-filter' value='"+objTagIds+"'> \
	  		<input type='hidden' class='feedback-dev-need-tag-filter' value='"+devNeedTagIds+"'> \
	        <div class='panel-heading' onClick='showGeneralFeedback("+id+")'> \
	            <div class='row'> \
	               <div class='col-md-7 wrap-text'><h5><b>"+ sender +"</b></h5></div> \
	               <div class='col-md-5'><h6 class='pull-right'><b>"+ date +"</b></h6></div> \
	            </div> \
	        </div> \
	     </div> ";
	return HTML;
}

function feedbackReviewersListHTML(reviewer, email){
	var HTML = " \
		<div class='row'> \
			<div class='col-md-12 wrap-only'> \
				<label class='reviewer-label' style='max-width: 80%;''> \
				<input class='reviewer-checkbox pull-right' type='checkbox' value='"+email+"' style='right:35px'> \
				"+reviewer+" \
				</label> \
		</div>";
	return HTML;
}

function feedbackDescriptionListHTML(id, sender, description, date, classDate, email, objTagIds, devNeedTagIds){
	var HTML = " \
	<div class='panel panel-default filterable-feedback feedback-description hidden' id='feedback-"+id+"'> \
		<input type='hidden' class='reviewer-filter' value='"+email+"'> \
	    <input type='hidden' class='date-filter' value='"+classDate+"'> \
		  <input type='hidden' id='feedback-obj-tag-filter-"+id+"' class='feedback-obj-tag-filter' value='"+objTagIds+"'> \
		  <input type='hidden' id='feedback-dev-need-tag-filter-"+id+"' class='feedback-dev-need-tag-filter' value='"+devNeedTagIds+"'> \
		<div class='panel-body'> \
			<div class='row'> \
				<div class='col-md-10'><h6 class='wrap-text' >Tags: <span id=feedback-tag-text-"+id+">"+addTags(objTagIds, devNeedTagIds)+"</span></h6></div> \
    			<div class='col-md-2'><h6 class='pull-right btn-link' style='cursor:pointer' onclick='openAddTagModalFeedback("+id+")'><b>Tags</b></h6></div> \
    		</div> \
			<div class='row'> \
				<div class='col-md-6'><h6 id='from-"+id+"'><b>"+ sender +"</b></h6></div> \
				<div class='col-md-6'><h6 class='pull-right' id='date-rec-"+id+"'><b>"+ date +"</b></h6></div> \
			</div> \
			<div class='row'> \
				<div class='col-md-12 wrap-text'><h5>"+ description +"</h5></div> \
			</div> \
		 </div> \
	</div> ";
	return HTML
}

function updateEndDate(){
	var startDate = formatFeedbackDate($("#feedback-start-date").val());
	var endDate = formatFeedbackDate($("#feedback-end-date").val());
	
	if(startDate > endDate){
		$("#feedback-end-date").val(timeStampToClassDate(startDate));
	}
	$("#feedback-end-date-picker").datepicker('setStartDate', startDate);
}

//From dd-mm-yyyy to timestamp
function formatFeedbackDate(date){
	var day = date.slice(0,2);
	var month = date.slice(3,5);
	var year = date.slice(6,10);
	return new Date(year + '-' + month + '-' + day);
}

function applyDateFilter(){
	var dateRangeList = [];
	var startDate = formatFeedbackDate($("#feedback-start-date").val());
	var endDate = formatFeedbackDate($("#feedback-end-date").val());
	
	for(var date = startDate; date <= endDate; date = date.addDays(1)){
		dateRangeList.push(timeStampToClassDate(date));
	}
	
	$(".date-filter").each(function(index){
		var date = $(this).val()
		
		if(jQuery.inArray(date, dateRangeList) > -1){
			$(this).closest('div').removeClass("filteredOutByDate");
		}else{
			$(this).closest('div').addClass("filteredOutByDate");
		}
	});
	dateFilterApplied = true;
	updateFilterView();
}

function applyReviewerFilter(){
	var reviewerCheckedList = [];
	var show = false;
	
	$(".reviewer-checkbox").each(function(){
		if($(this).prop("checked") == true){
			reviewerCheckedList.push(this.value);
        }
	});

	if(reviewerCheckedList.length == 0){
		clearReviewerFilter();
	}else{
		$(".reviewer-filter").each(function(){
			var reviewer = $(this).val();
			if(jQuery.inArray(reviewer, reviewerCheckedList) > -1){
				$(this).closest('div').removeClass("filteredOutByReviewer");
			}else{
				$(this).closest('div').addClass("filteredOutByReviewer");
			}	
		});
		reviewerFilterApplied = true;
	}
	updateFilterView();
}

function updateFilterView(){
	$(".filterable-feedback").each(function(index){
		var feedback = $(this);
		if(feedback.hasClass("filteredOutByDate") || feedback.hasClass("filteredOutByReviewer")){
			feedback.hide();
		}else{
			feedback.show();
		}
	});
	
	var filterText = $("#filter-text");
	if(dateFilterApplied && reviewerFilterApplied){
		filterText.text("Date: "+$("#feedback-start-date").val()+" to "+$("#feedback-end-date").val()+". Reviewer.");
	}else if(dateFilterApplied){
		filterText.text("Date: "+$("#feedback-start-date").val()+" to "+$("#feedback-end-date").val()+".")
	}else if(reviewerFilterApplied){
		filterText.text("Reviewer.")
	}else {
		filterText.text("No Filters Applied");
	}
}

function clearReviewerFilter(){
	$(".reviewer-checkbox").prop('checked', false);
	$(".reviewer-filter").each(function(index){ 
		$(this).closest('div').removeClass("filteredOutByReviewer");
	});
	reviewerFilterApplied = false;
	updateFilterView();
}

function clearDateFilter(){
	$("#feedback-start-date, #feedback-end-date").val(timeStampToClassDate(new Date()));
	updateEndDate();
	$(".filterable-feedback").each(function(index){
		$(this).closest('div').removeClass("filteredOutByDate");
	});
	dateFilterApplied = false;
	updateFilterView();
}

function clearAllFilters(){
	clearReviewerFilter()
	clearDateFilter();
}

function showGeneralFeedback(id){
	generalFeedbackID = "feedback-"+id;
    
	$('.feedback-description').each(function(i) {
		if(generalFeedbackID === this.id){
			$(this).removeClass("hidden");
		}else{
			$(this).addClass("hidden");
		}
	});
}

function reviewerExists(reviewer){
	var reviewerCheckedList = [];
    
	$(".reviewer-checkbox").each(function(){
		reviewerCheckedList.push(this.value);
	});
	if(jQuery.inArray(reviewer, reviewerCheckedList) > -1){
		return true;		
	}else{
		return false;
	}	
}

function openRequestFeedbackModal(){
    $('#requestFeedbackModal').modal({backdrop: 'static', keyboard: false, show: true});
}

function openSendFeedbackModal(){
    $('#sendFeedbackModal').modal({backdrop: 'static', keyboard: false, show: true});
}

//Email details sent through BE to request feedback.
function submitFeedbackRequest(){
	$("#nav-bar-buttons").append("<h5 class='pull-right'> Loading... <h5>");
    $.ajax({
        url: "http://"+getEnvironment()+":8080/generateFeedbackRequest/"+getADLoginID(),
        method: "POST",
        xhrFields: {'withCredentials': true},
        data: {
            'emailsTo': $('#requestingTo').val(),
            'notes': $('#requestingText').val(),
        },
        success: function(response){
        	$("#nav-bar-buttons").empty();
            toastr.success(response);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
        	$("#nav-bar-buttons").empty();
            toastr.error(XMLHttpRequest.responseText);
        },
    });
        $('#request-feedback').click(function() {
            $("textarea").val("");
            $("#requestingTo").tagsinput('removeAll');
        });
        $('#requestFeedbackModal').modal('hide');
}

//Email details sent to BE to send feedback
function submitSendFeedback(){
    $("#nav-bar-buttons").append("<h5 class='pull-right'> Loading... <h5>");
    $.ajax({
        url: "http://"+getEnvironment()+":8080/addFeedback/"+getADLoginID(),
        method: "POST",
        xhrFields: {'withCredentials': true},
        data: {
            'emails': $('#sendingTo').val(),
            'feedback': $('#sendingText').val(),
        },
        success: function(response){
        	$("#nav-bar-buttons").empty();
            toastr.success(response);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
        	$("#nav-bar-buttons").empty();
            toastr.error(XMLHttpRequest.responseText);
        },
    });
        $('#send-feedback').click(function() {
            $("textarea").val("");
            $("#sendingTo").tagsinput('removeAll');
        });
        $('#sendFeedbackModal').modal('hide');
}

function openAddTagModalFeedback(id){
	var objTags = $("#feedback-obj-tag-filter-"+id).val();
	var devNeedTags = $("#feedback-dev-need-tag-filter-"+id).val();
	updateTagCheckboxes(objTags, devNeedTags);
	$("#tag-type").val("feedback");
	openAddTagModal(id);
}

function updateFeedbackTags(id, objectiveTagIds, developmentNeedTagIds){
    $.ajax({
        url: "http://"+getEnvironment()+":8080/updateFeedbackTags/"+getADLoginID(),
        method: "POST",
        xhrFields: {'withCredentials': true},
        data: {
            'feedbackId': id,
            'objectiveIds': objectiveTagIds.toString(),
            'developmentNeedIds': developmentNeedTagIds.toString()
        },
        success: function(response){
            toastr.success(response);
            $("#feedback-tag-text-"+id).text(addTags(objectiveTagIds, developmentNeedTagIds));
            setFeedbackTagValues(id, objectiveTagIds, developmentNeedTagIds);
            $('#add-tag-modal').modal('hide');
            clearTagsCheckboxes();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
        	$("#nav-bar-buttons").empty();
            toastr.error(XMLHttpRequest.responseText);
        },
    });
}

function setFeedbackTagValues(id, objTags, devNeedTags){
	$("#feedback-obj-tag-filter-"+id).val(objTags);
	$("#feedback-dev-need-tag-filter-"+id).val(devNeedTags);
	
}

