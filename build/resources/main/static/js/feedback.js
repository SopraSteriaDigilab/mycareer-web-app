$(function() {
    
    //mike - http://item-s31509.dhcp.edin.uk.sopra:8080/getFeedback/2312
    //Gets the List of Feedback from the DB 
    $.ajax({
        url: 'http://ukl5cg61956zz:8080/getFeedback/2312',
        method: 'GET',
        success: function(data){
            console.log('success', data);
            $.each(data, function(key, val){
           console.log(val.id);
//                console.log(val.fromWho);
//                console.log(val.description);
//                console.log(val.timeStamp);
                
                
                var feeTime = new Date(val.timeStamp);
                var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
                var year = feeTime.getFullYear();
                var month = months[feeTime.getMonth()];
                var day = feeTime.getDay();
                var feedbackDate = day + ' ' + month + ' ' + year;
               
                $('.feeList').append("<div class='panel panel-default' id='view-fee-"+val.id+"'>"+
                                        "<div class='panel-heading'>"+
                                            "<h5 class='from-"+val.id+"'><b>"+ val.fromWho +"</b></h5>"+
                                            "<h5 class='date-rec-"+val.id+"'><b>"+ feedbackDate +"</b></h5>"+
                                            "<button type='button' class='btn btn-link pull left' id='view-feedback'><h6>View</h6></button>"+
                                        "</div>"+                      
                                    "</div>"); //End of feeList append
                
            $('#view-feedback').click(function(){
                    $('.feeDescription').append("<div class='thumbnail' id='view-fee-"+val.id+"'>"+
                                                    "<h6 class='pull-left' id='from-"+val.id+"'><b>"+ val.fromWho +"</b></h6>"+
                                                    "<h6 class='pull-right' id='date-rec-"+val.id+"'><b>"+ feedbackDate +"</b></h6><br><br>"+
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

