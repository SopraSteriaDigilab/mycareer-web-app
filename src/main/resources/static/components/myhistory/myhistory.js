$(function() {
	init();
});

var $historyObjectivesTable = ("#history-objectives-table");
var $historyFeedbackTable = ("#history-feedback-table");
var $historyDevelopmentNeedsTable = ("#history-development-needs-table");
var $historyNotesTable = ("#history-notes-table");
var $historyRatingsTable = ("#history-ratings-table");

var objectivesColumnList = [ { data: "id" }, { data: "title" }, { data: "description" }, { data: "progress" }, { data: "dueDate" }, { data: "createdOnAsDate" }, { data: "proposedBy" }, { data: "archived" }];
var feedbackColumnList = [ { data: "id" }, { data: "providerEmail" }, { data: "feedbackDescription" }, {data: "timestamp"}];
var developmentNeedsColumnList = [ { data: "id" }, { data: "title" }, { data: "description" }, { data: "progress" }, { data: "dueDate" }, { data: "createdOnAsDate" }, { data: "proposedBy" }, {data: "category"}, { data: "archived" }];
var notesColumnList = [ { data: "id" }, { data: "providerName" }, { data: "noteDescription" }, {data: "timestamp"} ];
var ratingsColumnList = [ { data: "year" }, { data: "selfEvaluation" }, { data: "managerEvaluation" }, { data: "score" }];

function init() {
    $('.selectpicker').selectpicker();
    getMyCareer();
}

function getMyCareer(){
	var employeeId = getADLoginID();
	getEmployeeCareerAction(employeeId, function(data){
		getTables(data);
	}, function(error){});
}

function getTables(data){
	getTable($historyObjectivesTable, data.objectives, objectivesColumnList);
	getTable($historyFeedbackTable, data.feedback, feedbackColumnList);
	getTable($historyDevelopmentNeedsTable, data.developmentNeeds, developmentNeedsColumnList);
	getTable($historyNotesTable, data.notes, notesColumnList);
	getTable($historyRatingsTable, data.ratings, ratingsColumnList);
}

function getTable(selectorId, dataset, columnsList){
	if ($.fn.dataTable.isDataTable(selectorId)) {
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