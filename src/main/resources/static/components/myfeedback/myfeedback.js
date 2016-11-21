$(function() {
    
	//Get list of feedback
	getFeedbackList(getADLoginID());
    
});//End of Document Function


var firstFeedback = true;

function addFeedbackToList(id, sender, description, date){
	  $('#feeList').append(feedbackSendersListHTML(id, sender, date)); //End of feeList append
      $('#feeDescription').append(feedbackDescriptionListHTML(id, sender, description, date));
}

function feedbackSendersListHTML(id, sender, date){
	var HTML = " \
	        <div class='panel panel-default' id='view-fee-"+id+"'> \
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

function feedbackDescriptionListHTML(id, sender, description, date){
	var HTML = " \
	<div class='panel panel-default "+ showIfFirstFeeback() +" general-feedback' id='general-feedback-"+id+"'> \
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

