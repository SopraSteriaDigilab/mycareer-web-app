$(function() {
	init();
});

var $historyObjectivesTable = ("#history-objectives-table");
var $historyFeedbackTable = ("#history-feedback-table");
var $historyDevelopmentNeedsTable = ("#history-development-needs-table");
var $historyNotesTable = ("#history-notes-table");
var $historyRatingsTable = ("#history-ratings-table");

var objectivesColumnList = [ { data: "title" }, { data: "description" }, { data: "progress" }, { data: "dueDate" }, { data: "createdOnAsDate" }, { data: "proposedBy" }, { data: "archived" }];
var feedbackColumnList = [ { data: "providerEmail" }, { data: "feedbackDescription" }, {data: "timestamp"}];
var developmentNeedsColumnList = [ { data: "title" }, { data: "description" }, { data: "progress" }, { data: "dueDate" }, { data: "createdOnAsDate" }, { data: "proposedBy" }, {data: "category"}, { data: "archived" }];
var notesColumnList = [ { data: "providerName" }, { data: "noteDescription" }, {data: "timestamp"} ];
var ratingsColumnList = [ { data: "year" }, { data: "selfEvaluation" }, { data: "managerEvaluation" }, { data: "score" }];

var objectivesColumnDefs = [{ width: "25%", targets: [0,1] }, {render: function(data, type, row){ return formatDate(data)}, targets:3}, {render: function(data, type, row){ return timeStampToLongDate(data)}, targets:4}];
var feedbackColumnDefs = [{ width: "60%", targets: 1 }, {render: function(data, type, row){ return timeStampToDateTime(data)}, targets:2}];
var developmentNeedsColumnDefs = [{ width: "25%", targets: [0,1] }, {render: function(data, type, row){ return formatDate(data)}, targets:3}, {render: function(data, type, row){ return timeStampToLongDate(data)}, targets:4}];
var notesColumnDefs = [{ width: "60%", targets: 1 }, {render: function(data, type, row){ return timeStampToDateTime(data)}, targets:2}];
var ratingsColumnDefs = [{ width: "30%", targets: [1,2] }];

function init() {
    getMyCareer();
}

function getMyCareer(){
	var employeeId = getADLoginID();
	var success = function(data){ getTables(data); }
	var error = function(error){}
	
	getEmployeeCareerAction(employeeId, success, error);
}

function getTables(data){
	getTable($historyObjectivesTable, data.objectives, objectivesColumnList, objectivesColumnDefs);
	getTable($historyFeedbackTable, data.feedback, feedbackColumnList, feedbackColumnDefs);
	getTable($historyDevelopmentNeedsTable, data.developmentNeeds, developmentNeedsColumnList, developmentNeedsColumnDefs);
	getTable($historyNotesTable, data.notes, notesColumnList, notesColumnDefs);
	getTable($historyRatingsTable, data.ratings, ratingsColumnList, ratingsColumnDefs);
}

function getTable(selectorId, dataset, columnsList, columnDefs){
	$.fn.dataTable.moment( 'MMM YYYY' );
	$.fn.dataTable.moment( 'MMMM YYYY' );
	$.fn.dataTable.moment( 'D MMM YYYY' );	
	$.fn.dataTable.moment( 'DD MMM YYYY HH:mm' );
	 table = $(selectorId).dataTable({
		columnDefs: columnDefs,
        data: dataset,
        columns: columnsList
	 });
}