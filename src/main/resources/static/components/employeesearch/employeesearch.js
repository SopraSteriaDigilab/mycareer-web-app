$(function() {
	init();
});

var $loadingEmployeeNameIDs = $("#loading-employee-name-ids");
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

var objectivesColumnDefs = [{ width: "25%", targets: [0,1] }, {render: function(data, type, row){ return formatDate(data)}, targets:3}, {render: function(data, type, row){ return timeStampToLongDate(data)}, targets:4}];
var feedbackColumnDefs = [{ width: "60%", targets: 1 }, {render: function(data, type, row){ return timeStampToDateTime(data)}, targets:2}];
var developmentNeedsColumnDefs = [{ width: "25%", targets: [0,1] }, {render: function(data, type, row){ return formatDate(data)}, targets:3}, {render: function(data, type, row){ return timeStampToLongDate(data)}, targets:4}];
var notesColumnDefs = [{ width: "60%", targets: 1 }, {render: function(data, type, row){ return timeStampToDateTime(data)}, targets:2}];
var ratingsColumnDefs = [{ width: "30%", targets: [1,2] } ];

var emptyCareer = {objectives : [], developmentNeeds: [], competencies: [], notes: [], feedback:[], ratings:[]}

function init(){
	verifyUser();
	getEmployeeNamesAndIds();
	
	$employeeSelectPicker.on('change', function() { selectEmployee($(this).val()); });
}

function getEmployeeNamesAndIds(){
	
	var success = function(data){ initialiseSelectPicker(data); }
	var error = function(error) {}
	
	getEmployeeNamesAndIDsAction(success, error);
}

function initialiseSelectPicker(data){
	$employeeSelectPicker.html(selectPickerOptionsHTML(data));
	$loadingEmployeeNameIDs.remove();
	$employeeSelectPicker.selectpicker({showSubtext:true});
}

function selectPickerOptionsHTML(data){
	var HTML = "";
	$.each(data, function(key, val){
		HTML += "<option value='"+val.profile.employeeID+"'  data-subtext='"+val.profile.employeeID+"'>"+ val.profile.forename + " " + val.profile.surname +"</option>"
	});
	return HTML;
}

function selectEmployee(employeeId){		
	if(!employeeRetrieved(employeeId)){
		getEmployeeCareer(employeeId);
	}else{
		updateEmployeeView(employeeId, retrievedEmployees[employeeId]);
	}
}

function getEmployeeCareer(employeeId){
	
	var success = function(data){ addEmployee(employeeId, data); }
	var error = function(error){ updateEmployeeView(0, emptyCareer) }
	
	getEmployeeCareerAction(getADLoginID(), employeeId, success, error);
}

function addEmployee(employeeId, data){
	initialSelect();
	retrievedEmployees[employeeId] = data;
	updateEmployeeView(employeeId, data);
}

function getTable(selectorId, dataset, columnsList, columnDefs){
	$.fn.dataTable.moment( 'MMM YYYY' );
	$.fn.dataTable.moment( 'MMMM YYYY' );
	$.fn.dataTable.moment( 'dd MMM YYYY' );	
	$.fn.dataTable.moment( 'dd MMM YYYY HH:mm' );
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
	console.log("objectives")
	getTable($objectivesTable, data.objectives, objectivesColumnList, objectivesColumnDefs);
	console.log("feedback")
	getTable($feedbackTable, data.feedback, feedbackColumnList, feedbackColumnDefs);
	console.log("developmentNeeds")
	getTable($developmentNeedsTable, data.developmentNeeds, developmentNeedsColumnList, developmentNeedsColumnDefs);
	console.log("notes")
	getTable($notesTable, data.notes, notesColumnList, notesColumnDefs);
	console.log("ratings")
	getTable($ratingsTable, showIfSubmitted(data.ratings), ratingsColumnList, ratingsColumnDefs);
}

function employeeRetrieved(employeeId){
	if(jQuery.inArray(employeeId, Object.keys(retrievedEmployees)) == -1){
		return false;
	}
	return true;
}

function initialSelect(){
	if(retrievedEmployees.length < 1) {
		$placeholderContainter.remove();
		$employeeDataContainer.prop("hidden", false);
	}
}

function showIfSubmitted(ratings){
	var updatedRatings = [];
	
	for(var i = 0; i < ratings.length; i++){
		var rating = ratings[i];
		
		if(!rating.managerEvaluationSubmitted){
			rating.managerEvaluation = "Not Submitted";
			rating.score = "Not Submitted";
		}
		if(!rating.selfEvaluationSubmitted){
			rating.selfEvaluation = "Not Submitted";
		}
		updatedRatings.push(rating);
	}
	
	return updatedRatings;
}