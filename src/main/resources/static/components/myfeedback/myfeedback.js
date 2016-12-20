$(function() {
    
	//Get list of general feedback
    getGeneralFeedbackList(getADLoginID());
	
	//Initialising the date pickers
	initFeedbackDatePicker("feedback-start", '');
	initFeedbackDatePicker("feedback-end", new Date());
	
	//Keep end date updated
	$("#feedback-start-date").change(function (d){ updateEndDate() });
	
	$("#submit-date-filter").click(function (){ applyDateFilter() })

	$("#general-reviewer-list").change(function(){ applyReviewerFilter(); });
	
	
	
	
});//End of Document Function

var dateFilterApplied = false;
var reviewerFilterApplied = false;

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

var firstFeedback = true;

function addGeneralFeedbackToList(id, sender, description, date, classDate, email){
      $('#general-feedback-tab').append(feedbackSendersListHTML(id, sender, date, classDate, email));
      $('#generalFeeDescription').append(feedbackDescriptionListHTML(id, sender, description, date, classDate, email));
      if(!reviewerExists(email)){
    	  $('#general-reviewer-list').append(feedbackReviewersListHTML(sender, email));
      }
}

function selectedFeedback(element){
    $(element).each(function(){
        if($(this).hasClass("feedback-unselected")){
            $(this).removeClass("feedback-unselected");
        }
        $(this).addClass("feedback-select"); 
    });
         
}

function feedbackSendersListHTML(id, sender, date, classDate, email){
	var HTML = " \
	        <div class='panel panel-default filterable-feedback feedback-unselected' id='view-fee-"+id+"' style='cursor:pointer' onClick='selectedFeedback(this)'> \
	        <input type='hidden' class='reviewer-filter' value='"+email+"'> \
	        <input type='hidden' class='date-filter' value='"+classDate+"'> \
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
			<div class='col-md-10 wrap-only'> \
				<label class='reviewer-label'>"+reviewer+"</label> \
			</div> \
			<div class='col-md-2'> \
				 <input class='reviewer-checkbox pull-right' type='checkbox' value='"+email+"'> \
			</div> \
		</div>";
	
	return HTML;
}

function feedbackDescriptionListHTML(id, sender, description, date, classDate, email){
	var HTML = " \
	<div class='panel panel-default filterable-feedback feedback-description hidden' id='feedback-"+id+"'> \
	<input type='hidden' class='reviewer-filter' value='"+email+"'> \
    <input type='hidden' class='date-filter' value='"+classDate+"'> \
		<div class='panel-body'> \
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

function clearFilter(filter){
	
	if(filter === "date"){
		clearDateFilter();
	}else{
		clearReviewerFilter();
	}
	
	updateFilterView();
}

function clearReviewerFilter(){
	$(".reviewer-checkbox").prop('checked', false);
	$(".reviewer-filter").each(function(index){ 
		$(this).closest('div').removeClass("filteredOutByReviewer");
	});
	reviewerFilterApplied = false;
}

function clearDateFilter(){
	$("#feedback-start-date, #feedback-end-date").val(timeStampToClassDate(new Date()));
	updateEndDate();
	$(".filterable-feedback").each(function(index){
		$(this).closest('div').removeClass("filteredOutByDate");
	});
	dateFilterApplied = false;
}

function clearAllFilters(){
	clearReviewerFilter()
	clearDateFilter();
	updateFilterView();
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
