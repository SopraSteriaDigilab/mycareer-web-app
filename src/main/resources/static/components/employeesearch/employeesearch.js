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

var objectivesColumnList = [ { data: "title" }, { data: "description" }, { data: "progress" }, { data: "dueDate" }, { data: "createdOnAsDate" }, { data: "proposedBy" }, { data: "archived" }];
var feedbackColumnList = [ { data: "providerEmail" }, { data: "feedbackDescription" }, {data: "timestamp"}];
var developmentNeedsColumnList = [ { data: "title" }, { data: "description" }, { data: "progress" }, { data: "dueDate" }, { data: "createdOnAsDate" }, { data: "proposedBy" }, {data: "category"}, { data: "archived" }];
var notesColumnList = [ { data: "providerName" }, { data: "noteDescription" }, {data: "timestamp"} ];
var ratingsColumnList = [ { data: "year" }, { data: "selfEvaluation" }, { data: "managerEvaluation" }, { data: "score" }];

var objectivesColumnDefs = [{ "width": "25%", "targets": [0,1] }];
var feedbackColumnDefs = [{ "width": "60%", "targets": 1 }];
var developmentNeedsColumnDefs = [{ "width": "25%", "targets": [0,1] }];
var notesColumnDefs = [{ "width": "60%", "targets": 1 }];
var ratingsColumnDefs = [{ "width": "30%", "targets": [1,2] }];

function init(){
	$employeeSelectPicker.selectpicker({showSubtext:true});
	
	$employeeSelectPicker.on('change', function() { selectEmployee($(this).val()); });
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

function getTable(selectorId, dataset, columnsList, columnDefs){
	var table;
	if ($.fn.dataTable.isDataTable(selectorId) ) {
	    table = $(selectorId).dataTable();
	    table.fnClearTable();
	    if(dataset.length > 0)
	    	table.fnAddData(dataset);
	}else{	
		 table = $(selectorId).dataTable({
			 columnDefs: columnDefs,
			 data: dataset,
			 columns: columnsList
		 });
	}
}

function updateEmployeeView(employeeId, data){
	getTable($objectivesTable, data.objectives, objectivesColumnList, objectivesColumnDefs);
	getTable($feedbackTable, data.feedback, feedbackColumnList, feedbackColumnDefs);
	getTable($developmentNeedsTable, data.developmentNeeds, developmentNeedsColumnList, developmentNeedsColumnDefs);
	getTable($notesTable, data.notes, notesColumnList, notesColumnDefs);
	getTable($ratingsTable, data.ratings, ratingsColumnList, ratingsColumnDefs);
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