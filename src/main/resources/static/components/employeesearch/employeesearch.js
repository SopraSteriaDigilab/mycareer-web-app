$(function() {
	init();
});

$employeeSelectPicker = $('#employee-search-seletpicker');

function init(){
	
	getEmployeeCareer();
	
	//init selectpicker
	$employeeSelectPicker.selectpicker();

	//listeners
	$employeeSelectPicker.on('change', function() { selectEmployee($(this).val()) });
}


function selectEmployee(employeeId){
	alert(employeeId);
}

function getEmployeeCareer(){
	var employeeId = 675590;
	getEmployeeCareerAction(675590, function(data){populateHTML(data)}, function(error){});
}

function populateHTML(){
	
}