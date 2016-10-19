$(function() {
    
    
    //Gets the List of Feedback from the DB 
    $.ajax({
        url: 'http://item-s31509.dhcp.edin.uk.sopra:8080/getFeedback/2312',
        method: 'GET',
        success: function(data){
            console.log('success', data);
            $.each(data, function(key, val){
//                console.log(val.id);
//                console.log(val.fromWho);
//                console.log(val.description);
//                console.log(val.timeStamp);
                
                
                var feeTime = new Date(val.timeStamp);
                var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
                var year = feeTime.getFullYear();
                var month = months[feeTime.getMonth()];
                var feedbackDate = month + ' ' + year;
               
                $('.feeList').append("<div class='panel panel-default' id='feedback'>"+
                                        "<div class='panel-heading'>"+
                                            "<button type='button' class='btn btn-link pull-right' id='view-feedback'><h6>View</h6></button>"+
                                                "<h5 class='feedback-author'><b>"+ val.fromWho +"</b></h5>"+
                                                "<h5 class='feedback-date'><b>"+ feedbackDate +"</b></h5>"+
                                        "</div>"+                      
                                    "</div>"); //End of feeList append
                
            $('#view-feedback').click(function(){
                    $('.feeDescription').append("<div class='thumbnail'>"+
                                                    "<h6 class='pull-left'><b>"+ val.fromWho +"</b></h6>"+
                                                    "<h6 class='pull-right'><b>"+ feedbackDate +"</b></h6><br>"+
                                                    "<h5>"+ val.description +"</h5>"+
                                                "</div>");
        
        });//end of view-feedback click function 
        });//end of for each loop
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            console.log('error', errorThrown);
        }
        
    });//End of Ajax request
    
    
    
    
});//End of Document Function

