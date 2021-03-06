$(function() {
	initMyFeedback();
});

var $pendingRequestButton = $("#pending-request-button");
var $loadingButtonsText = $("#feedback-tag-loading")
var $feedbackTagButtons = $(".feedback-tag-buttons");
var $pendingRequestsModal = $("#pending-requests-modal");
var $pendingRequeststbody = $("#pending-requests-tbody");
var $noPendingRequests = $("#no-pending-requests");
var $pendingRequestsTable = $("#pending-requests-table");

var dateFilterApplied = false;
var reviewerFilterApplied = false;
var feedbackTagFilterApplied = false;
var firstFeedback = true;
var isEmailclicked=false;
var fbrLoaded = false;
var fbrChanged = false;

function initMyFeedback(){
	//Get list of general feedback
	getFeedback();
	getEmails();
	getFeedbackRequests();
	
	//Initialising the date pickers
	initFeedbackDatePicker("feedback-start", new Date(new Date().setFullYear(new Date().getFullYear() - 1)), new Date() );
	initFeedbackDatePicker("feedback-end", new Date(), new Date() );
	
    //feedback request modal key preses
	keypress('requestFeedbackModal');
    keypress('sendFeedbackModal');
    
    // Event listeners
    $('.send-feedback-validate').on('input', function(){ validateForm('send-feedback-validate', 'submit-send-feedback'); });
	$("#feedback-start-date").change(function (d){ updateEndDate() });
	$("#submit-date-filter").click(function (){ applyDateFilter() })
	$("#general-reviewer-list").change(function(){ applyReviewerFilter(); });
    $('#request-feedback').click(function(){ openRequestFeedbackModal() });
    $('#send-feedback').click(function(){ openSendFeedbackModal() });
    $('#submit-request-feedback').click(function(){ clickSubmitRequestFeedback(); });
    $('#submit-send-feedback').click(function(){ clickSubmitSendFeedback(); });
    $("#view-feedback-template").click(function(){ $('#emailTemplateModal').modal('show') });
    $("#view-feedback-suggestion-template").click(function(){ $('#feedbackTemplateModal').modal('show') });
	$('#cancelSendModal, #close-feedback-send-modal').on('click', function(e) { clickCloseSendFeedback(e); });
	$('#cancelRequestModal, #close-feedback-request-modal').on('click', function(e) { clickCloseRequestFeedback(e); });
	$("#feedback-tag-dropdown").on('change', function(){ applyFeedbackTagFilter($(this).val()); });
	$('#send-to-validate, #request-to-validate').on('mousedown', '.dropdown-item', function() { isEmailclicked=true; });
	$('#send-to-validate').on('blur', 'input', function(){ addTag('#sendFeedbackModal .bootstrap-tagsinput > input','#sendingTo'); })
	$('#request-to-validate').on('blur', 'input', function() { addTag('.bootstrap-tagsinput > input','#requestingTo'); })
	$pendingRequestButton.click(function(){ clickPendingRequestButton(); });
}


function getFeedback(){
	var userId = ADLoginID;
	var success = function(data){
		loaded();
        $.each(data, function(key, val){
            var classDate = moment(val.timestamp).format('YYYY-MM-DD');
            var longDate = moment(val.timestamp).format('DD MMM YYYY');
            var name = (val.providerName) ? val.providerName : val.providerEmail;
            addGeneralFeedbackToList(val.id, name, val.feedbackDescription, longDate, classDate, val.providerEmail, val.taggedObjectiveIds, val.taggedDevelopmentNeedIds);   
        });
        if(data.length === 0) {
        	$("#generalFeeDescription").addClass("text-center").append("<h5>You have no Feedback </h5>");
        	$("#general-reviewer-list, #general-feedback-tab").addClass("text-center").append("<h5>You have no Reviewers </h5>");
        }
    }
	var error = function(error){ loaded(); }
	
	getFeedbackAction(userId, success, error);
}

function getFeedbackRequests(modalAction){
	var userId = ADLoginID;
	var success = function(data){
		loaded();
		addFeedbackRequestsToList(data);
		if(modalAction !== undefined)
			$pendingRequestsModal.modal(modalAction);
	}
	var error = function(error){ loaded(); }
	
	getFeedbackRequestsAction(userId, success, error);
}

function getEmails(){
	var success = function(data){ 
		emails = data;
		initialiseTags();
		$loadingButtonsText.hide();
		$feedbackTagButtons.show();
	}
	var error = function(){}
	
	getEmailsAction(success, error);
}

function initFeedbackDatePicker(id, start, end){    
    $("#"+id+"-date-picker").datepicker({
	   useCurrent: true,
       forceParse: false,
       disabled: true,
       format: "dd-mm-yyyy",
       startDate: start,
       endDate: end, 
       orientation: 'bottom',
       autoclose: true,
    });	
    $("#feedback-start-date, #feedback-end-date").val(timeStampToClassDate(new Date()));
}

function addGeneralFeedbackToList(id, sender, description, date, classDate, email, objTagIds, devNeedTagIds){
      $('#general-feedback-tab').append(feedbackSendersListHTML(id, sender, date, classDate, email, objTagIds, devNeedTagIds));
      $('#generalFeeDescription').append(feedbackDescriptionListHTML(id, sender, description, date, classDate, email, objTagIds, devNeedTagIds));
      if(!reviewerExists(sender)){
    	  $('#general-reviewer-list').append(feedbackReviewersListHTML(sender));
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

function clickSubmitRequestFeedback(){
	 if (validEmails($('#requestingTo').val())){
         submitFeedbackRequest();
     }else{
         toastr.error("One or more email addresses entered are not valid");
     }
}

function clickSubmitSendFeedback(){
    if (validEmails($('#sendingTo').val())){
        submitSendFeedback();
    }else{
        toastr.error("One or more email addresses entered are not valid");
    }  
}

function feedbackSendersListHTML(id, sender, date, classDate, email, objTagIds, devNeedTagIds){
	var HTML = " \
        <div class='panel panel-default sender-panel filterable-feedback' id='view-fee-"+id+"' style='cursor:pointer' onClick='selectedFeedback(this)'> \
        	<input type='hidden' class='reviewer-filter' value='"+sender+"'> \
        	<input type='hidden' class='date-filter' value='"+classDate+"'> \
	  		<input type='hidden' class='feedback-tag-filter feedback-tag-filter-"+id+"' value='"+formatTagFilterValues(objTagIds, devNeedTagIds)+"'> \
	        <div class='panel-heading' onClick='showGeneralFeedback("+id+")'> \
	            <div class='row'> \
	               <div class='col-md-7 wrap-text'><h5><b>"+ sender +"</b></h5></div> \
	               <div class='col-md-5'><h6 class='pull-right'><b>"+ date +"</b></h6></div> \
	            </div> \
	        </div> \
	     </div> ";
	return HTML;
}

function feedbackReviewersListHTML(reviewer){
	var HTML = " \
		<div class='row'> \
			<div class='col-md-12 wrap-only'> \
				<label class='reviewer-label' style='max-width: 80%;''> \
				<input class='reviewer-checkbox pull-right' type='checkbox' value='"+reviewer+"' style='right:35px; top: -2px;'> \
				"+reviewer+" \
				</label> \
		</div>";
	return HTML;
}

function feedbackDescriptionListHTML(id, sender, description, date, classDate, email, objTagIds, devNeedTagIds){
	var HTML = " \
	<div class='panel panel-default filterable-feedback feedback-description hidden' id='feedback-"+id+"'> \
		<input type='hidden' class='reviewer-filter' value='"+sender+"'> \
	    <input type='hidden' class='date-filter' value='"+classDate+"'> \
  		<input type='hidden' class='feedback-tag-filter feedback-tag-filter-"+id+"' value='"+formatTagFilterValues(objTagIds, devNeedTagIds)+"'> \
    	<input type='hidden' id='feedback-obj-tags-"+id+"' value='"+objTagIds+"'> \
    	<input type='hidden' id='feedback-dev-need-tags-"+id+"' value='"+devNeedTagIds+"'> \
		<div class='panel-body'> \
			<div class='row'> \
				<div class='col-md-10'><h6 class='wrap-text' >Tags: <span id=feedback-tag-text-"+id+">"+addTags(objTagIds, devNeedTagIds, "feedback")+"</span></h6></div> \
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
		$("#feedback-end-date").val(moment(startDate).format('DD-MM-YYYY'));
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
		dateRangeList.push(moment(date).format('YYYY-MM-DD'));
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

function applyFeedbackTagFilter(filter){
	if(filter == 0){
		clearFeedbackTagFilter();
	}else{
		$(".feedback-tag-filter").each(function(){
			var tags = $(this).val().split(' ');
			if(tags.indexOf(filter) > -1){
				$(this).closest('div').removeClass("filteredOutByFeedbackTags");
			}else{
				$(this).closest('div').addClass("filteredOutByFeedbackTags");
			}	
		});
		feedbackTagFilterApplied = true;
	}
	updateFilterView();
}

function updateFilterView(){
	$(".filterable-feedback").each(function(index){
		var feedback = $(this);
		if(feedback.hasClass("filteredOutByDate") || feedback.hasClass("filteredOutByReviewer") || feedback.hasClass("filteredOutByFeedbackTags")){
			feedback.hide();
		}else{
			feedback.show();
		}
	});
	
	var filterText = "";
	if(!dateFilterApplied && !reviewerFilterApplied && !feedbackTagFilterApplied){
		filterText = "No Filters Applied";
	}else{
		if(dateFilterApplied)
			filterText += "Date: "+$("#feedback-start-date").val()+" to "+$("#feedback-end-date").val()+".";
		if(reviewerFilterApplied)
			filterText += " Reviewer.";
		if(feedbackTagFilterApplied)
			filterText += " Tags.";
	}
	$("#filter-text").text(filterText);
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

function clearFeedbackTagFilter(){
	$(".feedback-tag-filter").each(function(){
		$(this).closest('div').removeClass("filteredOutByFeedbackTags");
	});
	$(".tag-filter-dropdown").selectpicker('val', 0);
	feedbackTagFilterApplied = false;
	updateFilterView();
}

function clearAllFilters(){
	clearReviewerFilter();
	clearDateFilter();
	clearFeedbackTagFilter();
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
	$("textarea").val("");
	$("#requestingTo").tagsinput('removeAll');
    $('#requestFeedbackModal').modal({backdrop: 'static', keyboard: false, show: true});
}

function openSendFeedbackModal(){
    $("textarea").val("");
    $("#sendingTo").tagsinput('removeAll');
	$('#submit-send-feedback').prop("disabled", true);
    $('#sendFeedbackModal').modal({backdrop: 'static', keyboard: false, show: true});
}

function submitFeedbackRequest(){
	loading("Processing Feedback Request. Please wait.");
	var userId = ADLoginID;
	var emails = $('#requestingTo').val();
	var notes =  $('#requestingText').val();
	
	var success = function(response){
		fbrChanged = true;
    	loaded();
        $('#requestFeedbackModal').modal('hide');
    }
	var error = function(error){ loaded(); }
	
	generateFeedbackRequestAction(userId, emails, notes, success, error);

}

function submitSendFeedback(){
	loading("Processing Feedback. Please wait.");
	var userId = ADLoginID;
	var emails = $('#sendingTo').val();
	var feedback = $('#sendingText').val();
	
	var success = function(response){
    	loaded();
        $('#sendFeedbackModal').modal('hide');
    }
	var error = function(error){
		loaded();
		if(error.indexOf("feedback added") > -1){
			$('#sendFeedbackModal').modal('hide');
    	}
	}
	
	addFeedbackAction(userId, emails, feedback, success, error);
}

function openAddTagModalFeedback(id){
	var objTags = $("#feedback-obj-tags-"+id).val();
	var devNeedTags = $("#feedback-dev-need-tags-"+id).val();
	updateTagCheckboxes(objTags, devNeedTags);
	$("#tag-type").val("feedback");
	openAddTagModal(id);
}

function updateFeedbackTags(id, objectiveTagIds, developmentNeedTagIds){
	var userId = ADLoginID;
	var feedbackId = id;
	var objectiveIds = objectiveTagIds.toString();
	var developmentNeedIds = developmentNeedTagIds.toString();
	
	var success = function(success){
        $("#feedback-tag-text-"+id).text(addTags(objectiveTagIds, developmentNeedTagIds, "feedback"));
        setFeedbackTagValues(id, objectiveTagIds, developmentNeedTagIds);
        $('#add-tag-modal').modal('hide');
        clearTagsCheckboxes();
    }
	var error = function(error){}
	
	updateFeedbackTagsAction(userId, feedbackId, objectiveIds, developmentNeedIds, success, error);
}

function setFeedbackTagValues(id, objTags, devNeedTags){
	$("#feedback-obj-tags-"+id).val(objTags);
	$("#feedback-dev-need-tags-"+id).val(devNeedTags);
	$(".feedback-tag-filter-"+id).val(formatTagFilterValues(objTags, devNeedTags));
}

function initialiseTags(){
    tags("requestingTo", emails);
    tags("sendingTo", emails);
}

function addTag(inputLocation,inputDestination){
	if (!isEmailclicked) {addTagOnBlur(inputLocation,inputDestination);}
	else{isEmailclicked=false;}
}

function addFeedbackRequestsToList(data){
	$pendingRequeststbody.html(feedbackRequestListHTML(data));
}

function clickPendingRequestButton(){
	if(fbrChanged){
		loading("Retrieving Feedback requests. Please wait");
		getFeedbackRequests('show');
		fbrChanged = false;
	}else{
		$pendingRequestsModal.modal('show');
	}
}

function clickDismissFeedbackRequest(id, email){
		var modalTitle = "Dismiss Request";
		var body = "<h5 style='word-break: break-word;'>Dismissing request from: <b>"+ email +"</b></h5><h5>Once you dismiss a request, it cannot be recovered.</h5><h5><b>Are you sure you want to dismiss this request?</b></h5>";
		var buttonText = "Dismiss";
		var buttonFunction = function(){ dismissFeedbackRequest(id); }
		
		openWarningModal(modalTitle, body, buttonText, buttonFunction);
}

function dismissFeedbackRequest(feedbackRequestId){
	var userId = ADLoginID;
	var success = function(response){
		$("#fbr-item-"+feedbackRequestId).remove();
		if($pendingRequeststbody.children().length < 1){
			$pendingRequestsTable.hide();
			$noPendingRequests.html("<h5>No Pending Feedback Requests</h5>");
		}
		closeWarningModal();
	}
	var error = function(error){}
	
	dismissFeedbackRequestAction(userId, feedbackRequestId, success, error);
}

function feedbackRequestListHTML(data){
	var html = "";
	if(data.length === 0){
		$pendingRequestsTable.hide();
		$noPendingRequests.html("<h5>No Pending Feedback Requests</h5>");
		return;
	}
	$noPendingRequests.empty();
	$pendingRequestsTable.show();
	$.each(data, function(key, val){
		html += feedbackRequestItemHTML(val.id, val.recipient, val.timestamp);
	});
	
	return html;
}

function feedbackRequestItemHTML(id, email, date){
	var html = " \
		<tr id='fbr-item-"+id+"'> \
			<td style='width: 60%; word-break: break-word;'>"+email+"</td> \
	        <td style='width: 20%;'>"+moment(date).format('DD MMM YYYY')+"</td> \
	        <td style='text-align: center; width: 20%;'> \
	        	<button type='button' class='close' style='float: none;' onClick='clickDismissFeedbackRequest(\""+id+"\", \""+email+"\")'>&times;</button> \
	        </td> \
        </tr>";
	return html;
}








