$(function() {

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
