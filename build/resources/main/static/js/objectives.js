$(function() {
    
    //3 onclicks to change the progress of the status bar of an objective
    //status goes from Awaiting, InFlight, Done
    $('.one').click(function(e){
        var val = 0;
        $('#objStatus').width(val);
    });
    
    $(".two").click(function(){
         var val = 100;
        $('#objStatus').width(val);
    });
    
    $(".three").click(function(){
         var val = 200;
        $('#objStatus').width(val);
    });
    
    //function when clicked View Feedback, Feedback shows
    $("#fee").click(function() {
        
	});
    

	$("#objective-date-picker").datepicker({
		daysOfWeekDisabled: [0, 6],
    format: "mm-yyyy",
    // todayHighlight: true,
    // todayBtn: true,
    startView: "months", 
    minViewMode: "months",
    startDate:new Date(),
	});
});

// });

function clickAddObjective(){
	var objText = $("#objective-text").val();
	var objDate = $("#objective-date").val()

	if(isEmpty(objText,"text-validate") | isEmpty(objDate, "date-validate")){
		return;
	}
	addObjective(objText, objDate);
	clearModal()
}


function addObjective(objText, objDate){
	alert("Objective is: " + objText + " | Date is: " + objDate);
}

function isEmpty(value, className){
	if(!value){
		$('#' + className).addClass("has-error");
		return true;
	}else{
		$('#' + className).removeClass("has-error");
		return false;
	}
}

function clearModal(){
	$('#objectiveModal').modal('hide');
	$("#objective-text").val('');
	$("#objective-date").val('');
}
