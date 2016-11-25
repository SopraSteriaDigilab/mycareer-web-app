$(function() {
    
	//Get list of feedback
	getFeedbackList(getADLoginID());
	
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

function addFeedbackToList(id, sender, description, date, classDate){
	  $('#feeList').append(feedbackSendersListHTML(id, sender, date, classDate)); //End of feeList append
      $('#feeDescription').append(feedbackDescriptionListHTML(id, sender, description, date, classDate));
}

function feedbackSendersListHTML(id, sender, date, classDate){
	var HTML = " \
	        <div class='panel panel-default filterable-feedback d-"+classDate+"' id='view-fee-"+id+" '> \
	        <div class='panel-heading'> \
	            <div class='row'> \
	               <div class='col-md-7'><h5><b>"+ sender +"</b></h5></div> \
	               <div class='col-md-5'><h6 class='pull-right'><b>"+ date +"</b></h6></div> \
	            </div> \
	            <div class='row'> \
	                <div class='col-md-offset-6 col-md-6'> \
	                	<button type='button' class='btn btn-link pull-right' onClick='showGeneralFeedback("+id+")'><h6>View</h6></button> \
	                </div> \
	            </div> \
	        </div> \
	      </div> ";
	return HTML;
}

function feedbackDescriptionListHTML(id, sender, description, date, classDate){
	var HTML = " \
	<div class='panel panel-default filterable-feedback "+ showIfFirstFeeback() +" general-feedback d-"+classDate+"' id='general-feedback-"+id+"'> \
		<input type='hidden' class='general-feedback-id' value='"+id+"'> \
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

function showIfFirstFeeback(){
	if(firstFeedback){
		firstFeedback = false;
		return "";
	}else{
		return "hidden";
	}

}

