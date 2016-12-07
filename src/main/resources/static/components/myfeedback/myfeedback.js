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

function addGeneralFeedbackToList(id, sender, description, date, classDate){
      $('#general-feedback-tab').append(feedbackSendersListHTML(id, sender, date, classDate));
      $('#generalFeeDescription').append(feedbackDescriptionListHTML(id, "general", sender, description, date, classDate));
}


function feedbackSendersListHTML(id, sender, date, classDate){
	var HTML = " \
	        <div class='panel panel-default filterable-feedback d-"+classDate+"' id='view-fee-"+id+"' style='cursor:pointer'> \
	        <div class='panel-heading' onClick='showGeneralFeedback("+id+")'> \
	            <div class='row'> \
	               <div class='col-md-7'><h5><b>"+ sender +"</b></h5></div> \
	               <div class='col-md-5'><h6 class='pull-right'><b>"+ date +"</b></h6></div> \
	            </div> \
	        </div> \
	      </div> ";
	return HTML;
}

function feedbackDescriptionListHTML(id, type, sender, description, date, classDate){
	var HTML = " \
	<div class='panel panel-default filterable-feedback "+ showIfFirstFeeback() +" "+type+"-feedback d-"+classDate+"' id='"+type+"-feedback-"+id+"'> \
		<input type='hidden' class='"+type+"-feedback-id' value='"+id+"'> \
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
    $('#feedbackID-'+feedbackID).append(feedbackDescriptionListHTML(id, "requested", sender, description, date, ""));
    
}

function feedbackRequestersListHTML(requestID, to, longDate){
	var HTML = " \
	        <div class='panel panel-default filterable-feedback' id='view-fee-"+requestID+"' style='cursor:pointer'> \
	        <div class='panel-heading' onClick='showRequestedFeedback(\""+requestID+"\")'> \
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
        <div id='groupID-"+groupID+"'> \
            <div class='row'> \
                <div class='col-md-12'> \
                </div> \
            </div> \
        </div> \
    ";
    
return HTML;
}

function requestPlaceholderHTML(feedbackID, recipient){
    var HTML = " \
            <div id='feedbackID-"+feedbackID+"'> \
                <div class='row'> \
                    <div class='col-md-12'> \
                        <h5>Requested to: "+recipient+"</h5> \
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
	
	$(".filterable-feedback").each(function(index){
		var fullClass = $(this).attr('class');
		var i = fullClass.indexOf('d-');
		
		var tempClass = fullClass.slice(i+2, i+12 );
		
		if(jQuery.inArray(tempClass, dateRangeList) > -1){
			$(this).show();
		}else{
			$(this).hide();
		}
		
	});
	
	
}

function clearDateFilter(){
	$("#feedback-start-date, #feedback-end-date").val(timeStampToClassDate(new Date()));
	updateEndDate();
	$(".filterable-feedback").each(function(index){ $(this).show(); });
}


function showGeneralFeedback(id){
	generalFeedbackID = "general-feedback-"+id;
	$('.general-feedback').each(function(i) {
		if(generalFeedbackID === this.id){
			$(this).removeClass("hidden");
		}else{
			$(this).addClass("hidden");
		}

	});
}

function showRequestedFeedback(requestID){
    requestedFeedbackID = "requested-feedback-"+requestID;
	$('.requested-feedback').each(function(i) {
		if(requestedFeedbackID === this.id){
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

