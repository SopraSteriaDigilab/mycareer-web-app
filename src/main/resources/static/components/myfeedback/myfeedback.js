$(function() {
    
	//Get list of general feedback
    getGeneralFeedbackList(getADLoginID());
    
    //Get list of requested feedback
    getRequestedFeedbackList(getADLoginID());
	
	//Initialising the date pickers
	initFeedbackDatePicker("feedback-start", '');
	initFeedbackDatePicker("feedback-end", new Date());
	
	//Keep end date updated
	$("#feedback-start-date").change(function (d){ updateEndDate() });
	
	$("#submit-date-filter").click(function (){ applyDateFilter() })

	$("#general-reviewer-list").change(function(){ applyReviewerFilter(); });
	

	
	
});//End of Document Function

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
      $('#general-feedback-tab').append(feedbackSendersListHTML(id, sender, date, classDate));
      $('#general-reviewer-list').append(feedbackReviewersListHTML(sender, email));
      $('#generalFeeDescription').append(feedbackDescriptionListHTML(id, sender, description, date, classDate, "general"));
}


function feedbackSendersListHTML(id, sender, date, classDate){
	var HTML = " \
	        <div class='panel panel-default filterable-feedback id='view-fee-"+id+"' style='cursor:pointer'> \
	        <input type='hidden' class='reviewer-filter' value='"+sender+"'> \
	        <input type='hidden' class='date-filter' value='"+classDate+"'> \
	        <div class='panel-heading' onClick='showGeneralFeedback("+id+")'> \
	            <div class='row'> \
	               <div class='col-md-7'><h5><b>"+ sender +"</b></h5></div> \
	               <div class='col-md-5'><h6 class='pull-right'><b>"+ date +"</b></h6></div> \
	            </div> \
	        </div> \
	      </div> ";
	return HTML;
}

function feedbackReviewersListHTML(reviewer, email){
	var HTML = " \
		<div class='row'> \
			<div class='col-md-10'> \
				<label>"+reviewer+"</label> \
			</div> \
			<div class='col-md-2'> \
				 <input class='reviewer-checkbox pull-right' type='checkbox' value='"+email+"'> \
			</div> \
		</div>";
	
	return HTML;
}

function feedbackDescriptionListHTML(id, sender, description, date, classDate, type){
	var HTML = " \
	<div class='panel panel-default filterable-feedback "+type+"-feedback "+hideIfGeneral(type)+"' id='feedback-"+id+"'> \
	<input type='hidden' class='reviewer-filter' value='"+sender+"'> \
    <input type='hidden' class='date-filter' value='"+classDate+"'> \
		<div class='panel-body'> \
			<div class='row'> \
				<div class='col-md-6'><h6 id='from-"+id+"'><b>"+ sender +"</b></h6></div> \
				<div class='col-md-6'><h6 class='pull-right' id='date-rec-"+id+"'><b>"+ date +"</b></h6></div> \
			</div> \
			<div class='row'> \
				<div class='col-md-12'><h5>"+ description +"</h5></div> \
			</div> \
		 </div> \
	</div> ";
	
	return HTML
}

function addRequestFeedbackSenders(groupID, to, longDate){
     $('#requested-feedback-tab').append(feedbackRequestersListHTML(groupID, to, longDate));
    
}

function addRequestedFeedbackDesc(feedbackID, id, sender, description, date){
    $('#feedback-request-'+feedbackID+'-body').append(feedbackDescriptionListHTML(id, sender, description, date, "", "requested"));
    
}

function feedbackRequestersListHTML(requestID, to, longDate){
	var HTML = " \
	        <div class='panel panel-default filterable-feedback' id='view-fee-"+requestID+"' style='cursor:pointer'> \
	        <div class='panel-heading' onClick='showGroupFeedback(\""+requestID+"\")'> \
	            <div class='row'> \
	               <div class='col-md-8'><h5><b>Feedback Request</b></h5></div> \
	               <div class='col-md-4'><h6 class='pull-right'><b>"+ longDate +"</b></h6></div> \
	            </div> \
                <div class='row'> \
                    <div class='col-md-12 wrap-text'><h5>Sent to: </h5><h6>"+ to +"</h6></div> \
                </div> \
	        </div> \
	      </div> ";
	return HTML;
}

function groupPlaceholderHTML(groupID){
    var HTML = " \
        <div id='groupID-"+groupID+"' class='group-feedback hidden'> \
        </div> \
    ";
    
return HTML;
}

function requestPlaceholderHTML(feedbackID, recipient, type){
    var HTML = " \
    <div class='panel-group'> \
        <div class='panel panel-default'> \
  	         <div class='panel-heading'> \
                <h5 class='panel-title'> \
                    <a data-toggle='collapse' href='#feedback-request-"+feedbackID+"'>Requested to: "+recipient+"</a> \
                 </h5> \
            </div> \
            <div id='feedback-request-"+feedbackID+"'> \
                <div class='panel-body'> \
                    <div id='feedback-request-"+feedbackID+"-body'></div> \
                </div> \
            </div> \
        </div> \
    </div> \
    ";
    
return HTML;
}

function addGroupPlaceholder(groupID){
    $('#requestedFeeDescription').append(groupPlaceholderHTML(groupID));
}
 function addRequestPlaceholder(groupID, feedbackID, recipient){
    $('#groupID-'+groupID).append(requestPlaceholderHTML(feedbackID, recipient));
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
		if($(this).closest('div').hasClass("filteredOutByReviewer")){
			return true;
		}
		var date = $(this).val()
		
		if(jQuery.inArray(date, dateRangeList) > -1){
			$(this).closest('div').removeClass("filteredOutByDate");
			$(this).closest('div').show();
		}else{
			$(this).closest('div').addClass("filteredOutByDate");
			$(this).closest('div').hide();
		}
	});
	
	
}

function applyReviewerFilter(){
	var reviewerCheckedList = [];
	
	$(".reviewer-checkbox").each(function(){
		if($(this).prop("checked") == true){
			reviewerCheckedList.push(this.value);
        }
	});

	if(reviewerCheckedList.length == 0){
		
	}else{
		$(".reviewer-filter").each(function(){
			if($(this).closest('div').hasClass("filteredOutByDate")){
				return true;
			}
			var reviewer = $(this).val();
			
			if(jQuery.inArray(reviewer, reviewerCheckedList) > -1){
				$(this).closest('div').removeClass("filteredOutByReviewer");
				$(this).closest('div').show()
			}else{
				$(this).closest('div').addClass("filteredOutByReviewer");
				$(this).closest('div').hide()
			}	
		});
	}
	

		
	
}

//function clearDateFilter(){
//	$("#feedback-start-date, #feedback-end-date").val(timeStampToClassDate(new Date()));
//	updateEndDate();
//	$(".filterable-feedback").each(function(index){ $(this).show(); });
//}
//
//function clearReviewerFilter(){
//	//Loop and uncheck all.
//    $(".reviewer-checkbox").prop('checked', false);
//	$(".reviewer-filter").each(function(index){ $(this).closest('div').show() });
//}

function clearAllFilters(){
	$("#feedback-start-date, #feedback-end-date").val(timeStampToClassDate(new Date()));
	updateEndDate();
	$(".reviewer-checkbox").prop('checked', false);
	$(".filterable-feedback").each(function(index){ 
		$(this).closest('div').removeClass("filteredOutByReviewer");
		$(this).closest('div').removeClass("filteredOutByDate");
		$(this).show(); 
	});
}

function showGeneralFeedback(id){
	generalFeedbackID = "feedback-"+id;
    
	$('.general-feedback').each(function(i) {
		if(generalFeedbackID === this.id){
			$(this).removeClass("hidden");
		}else{
			$(this).addClass("hidden");
		}

	});
}

function showGroupFeedback(groupID){
    groupFeedbackID = "groupID-"+groupID;
	$('.group-feedback').each(function(i) {
		if(groupFeedbackID === this.id){
			$(this).removeClass("hidden");                           
		}else{
			$(this).addClass("hidden");
		}

	});
}

function showIfFirstFeeback(){
	if(firstFeedback){
		firstFeedback = false;
		return "";
	}else{
		return "hidden";
	}

}

function hideIfGeneral(type){
	if(type === "general"){
		return "hidden";
	}else{
		return "";
	}
}

