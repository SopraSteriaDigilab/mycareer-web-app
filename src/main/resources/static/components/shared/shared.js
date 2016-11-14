$(function() {


});

//Functino to load profile section
function loadProfile(){
	$("#profile").load("../components/profile/profile.html");
}

//List of months for conversion
var fullMonths = ['January','Febuary','March','April','May','June','July','August','September','October','November','December'];

//Initialising the date picker
function initDatePicker(id, today){
	
	$("#"+id+"-date-picker").datepicker({
		useCurrent: true,
		forceParse: false,
		disabled: true,
		daysOfWeekDisabled: [0, 6],
		format: "yyyy-mm",
		startView: "months", 
		minViewMode: "months",
		startDate: today,
		// defaultDate: '01-10-2016',
		// todayHighlight: true,
		// todayBtn: true,
	});
}

//returns todays date in yyyy-mm format
function getToday(){
	var date = new Date();
	return date.getFullYear() + '-' + addZero(date.getMonth()+1);
}

//Formatting from YYYY-MM date to 'MMM YYYY' (e.g '2016-12' to 'December 2016')
function formatDate(date) {
	var d = new Date(date);
	return fullMonths[d.getMonth()] + ' ' + d.getFullYear();
}

//Opposite of formatDate(). formatting from 'MMM YYYY' format to 'YYYY-MM' (e.g. 'December 2016' to '2016-12')
function reverseDateFormat(date){
	var year = date.slice(-4, date.length);
	var monthIndex = (fullMonths.indexOf(date.slice(0, -5))) +1;
	return year+'-'+ addZero(monthIndex);
}


//Method to add 0 for numbers less than 10
function addZero(value){
	if (value < 10){
		return '0' + value;
	}
	return value;
}


//method that enables the submit button only when all inputs in the form have content
function validateForm(inputClass, submitButtonID) {
	var isEmpty = false;

	$('.'+inputClass).each(function(i) {
		value = $(this).val().trim();
		if(!value){
			isEmpty = true;
			return;
		}
	});
	
	if(isEmpty){
		$('#'+submitButtonID).prop("disabled", true);
	}else{
		$('#'+submitButtonID).prop("disabled", false);
	}
}

//Method to set title to the correct type
function setTitleType(isAdd){
	if(isAdd){
		return 'Add';
	}else{
		return 'Edit';
	}
}

