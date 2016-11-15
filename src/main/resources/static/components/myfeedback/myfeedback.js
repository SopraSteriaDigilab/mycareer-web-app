$(function() {
    
	//Get list of feedback
	getFeedbackList();
    
});//End of Document Function

var shortMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];

function getFeedbackList(){
    //mike - http://item-s31509.dhcp.edin.uk.sopra:8080/getFeedback/1111
    //Gets the List of Feedback from the DB 
    $.ajax({
        url: 'http://127.0.0.1:8080/getFeedback/1111',
        method: 'GET',
        success: function(data){
            console.log('success', data);
            $.each(data, function(key, val){                
                
                var feeTime = new Date(val.timeStamp);
                var year = feeTime.getFullYear();
                var month = shortMonths[feeTime.getMonth()];
                var day = feeTime.getDate();
                var feedbackDate = day + ' ' + month + ' ' + year;
                
                
                $('.feeList').append(" \
	                <div class='panel panel-default' id='view-fee-"+val.id+"'> \
	                    <div class='panel-heading'> \
	                        <div class='row'> \
	                           <div class='col-md-7'><h5><b>"+ val.fromWho +"</b></h5></div> \
	                           <div class='col-md-5'><h6 class='pull-right'><b>"+ feedbackDate +"</b></h6></div> \
	                        </div> \
	                        <div class='row'> \
	                            <div class='col-md-offset-6 col-md-6'> \
	                            	<button type='button' class='btn btn-link pull-right' onClick='showGeneralFeedback("+val.id+")'><h6>View</h6></button> \
	                            </div> \
	                        </div> \
	                    </div> \
	                  </div> \
                "); //End of feeList append
                
//            $('#view-feedback').click(function(){
                $('.feeDescription').append(" \
					<div class='thumbnail hidden general-feedback' id='general-feedback-"+val.id+"'> \
						<input type='hidden' class='general-feedback-id' value='"+val.id+"'> \
						<div class='panel-heading'> \
							<div class='row'> \
								<div class='col-md-6'><h6 id='from-"+val.id+"'><b>"+ val.fromWho +"</b></h6></div> \
								<div class='col-md-6'><h6 class='pull-right' id='date-rec-"+val.id+"'><b>"+ feedbackDate +"</b></h6></div> \
							</div> \
						</div> \
						<div class='panel-body'> \
							<div class='row'> \
								<div class='col-md-12'><h5>"+ val.description +"</h5></div> \
							</div> \
						 </div> \
					</div> \
                ");
        
//        });//end of view-feedback click function 
        });//end of for each loop
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            console.log('error', errorThrown);
            toastr.error("Sorry, there was a problem getting feedback, please try again later.");
        }
        
    });//End of Ajax request
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