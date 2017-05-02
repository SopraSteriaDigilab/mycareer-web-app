$(function() {
	init();
});

var $employeeSelectPicker = $('#employee-search-seletpicker');
var $objectivesTable = ("#objectives-table");
var $feedbackTable = ("#feedback-table");
var $developmentNeedsTable = ("#development-needs-table");
var $notesTable = ("#notes-table");
var $ratingsTable = ("#ratings-table");
var $employeeDataContainer = $("#employee-data-container");
var $placeholderContainter = $("#placeholder-container");

var retrievedEmployees = [];

var objectivesColumnList = [ { data: "id" }, { data: "title" }, { data: "description" }, { data: "progress" }, { data: "dueDate" }, { data: "createdOnAsDate" }, { data: "proposedBy" }, { data: "archived" }]


function init(){
	
	//initialise selectpicker
	$employeeSelectPicker.selectpicker();

	//listeners
	$employeeSelectPicker.on('change', function() { selectEmployee($(this).val()) });
}

function selectEmployee(employeeId){		
	if(!employeeRetrieved(employeeId)){
		getEmployeeCareer(employeeId);
	}else{
		updateEmployeeView(employeeId, retrievedEmployees[employeeId]);
	}
}

function getEmployeeCareer(employeeId){
	getEmployeeCareerAction(employeeId, function(data){
		addEmployee(employeeId, data)
	}, function(error){});
}

function addEmployee(employeeId, data){
	initialSelect();
	
	retrievedEmployees[employeeId] = data;
	updateEmployeeView(employeeId, data);
}

function getTable(selectorId, dataset, columnsList){
	if ($.fn.dataTable.isDataTable(selectorId) ) {
	    table = $(selectorId).dataTable();
	    table.fnClearTable();
	    table.fnAddData(dataset);
	}else{
	 table = $(selectorId).dataTable({
        data: dataset,
        columns: columnsList
	 });
	}
}

function updateEmployeeView(employeeId, data){
	getTable($objectivesTable, data.objectives, objectivesColumnList);
}

function employeeRetrieved(employeeId){
	if(jQuery.inArray(employeeId, Object.keys(retrievedEmployees)) == -1){
		console.log("adding : " + employeeId);
		return false;
	}
	console.log("already exists : " + employeeId);
	return true;
}

function initialSelect(){
	if(retrievedEmployees.length < 1) {
		$placeholderContainter.remove();
		$employeeDataContainer.prop("hidden", false);
	}
}