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
var $searchInput = $("#searchInput");
var $submitSearchButton = $("#submit-employee-search");
var $searchOptions = $("#search-options");
var $employeeNameLabel = $(".employee-name");

var retrievedEmployees = [];

var objectivesColumnList = [ { data: "title" }, { data: "description" }, { data: "progress" }, { data: "dueDate" }, { data: "createdOnAsDate" }, { data: "proposedBy" }, { data: "archived" }];
var feedbackColumnList = [ { data: "providerEmail" }, { data: "feedbackDescription" }, {data: "timestamp"}];
var developmentNeedsColumnList = [ { data: "title" }, { data: "description" }, { data: "progress" }, { data: "dueDate" }, { data: "createdOnAsDate" }, { data: "proposedBy" }, {data: "category"}, { data: "archived" }];
var notesColumnList = [ { data: "providerName" }, { data: "noteDescription" }, {data: "timestamp"} ];
var ratingsColumnList = [ { data: "year" }, { data: "selfEvaluation" }, { data: "managerEvaluation" }, { data: "score" }];

var objectivesColumnDefs = [{ width: "25%", targets: [0,1] }, {render: function(data, type, row){ return moment(data).format('MMMM YYYY')}, targets:3}, {render: function(data, type, row){ return moment(data).format('DD MMM YYYY')}, targets:4}];
var feedbackColumnDefs = [{ width: "60%", targets: 1 }, {render: function(data, type, row){ return moment(data).format('DD MMM YYYY HH:mm')}, targets:2}];
var developmentNeedsColumnDefs = [{ width: "25%", targets: [0,1] }, {render: function(data, type, row){ return moment(data).format('MMMM YYYY')}, targets:3}, {render: function(data, type, row){ return moment(data).format('DD MMM YYYY')}, targets:4}];
var notesColumnDefs = [{ width: "60%", targets: 1 }, {render: function(data, type, row){ return moment(data).format('DD MMM YYYY HH:mm')}, targets:2}];
var ratingsColumnDefs = [{ width: "30%", targets: [1,2] } ];

var emptyCareer = {profile: { forename: "", surname: "", employeeID: ""  }, objectives : [], developmentNeeds: [], competencies: [], notes: [], feedback:[], ratings:[]};

function init(){
	verifyUser();
	getEmployeeNamesAndIds();
	
	$submitSearchButton.on('click', function() { clickSearch(); });
}

function getEmployeeNamesAndIds(){
	
	var success = function(data){ initialiseSelectPicker(data); }
	var error = function(error) {}
	
	getEmployeeNamesAndIDsAction(success, error);
	
}

function initialiseSelectPicker(data){

	$searchInput.typeahead({
		items: 10,
		source: data,
		displayText: function(val){ 
			return val.profile.forename + " " + val.profile.surname + " " + val.profile.employeeID;
		}
	});
	
	$loadingEmployeeNameIDs.remove();
	$searchOptions.show();	
}

function clickSearch(){
	var str = $searchInput.val().trim();
	
	if(!isValidSearch(str)){
		 toastr.error("The value submitted is not valid, please select from one of the drop down values or enter a valid employee ID.")
		 return;
	}
	
	var searchStr = str.substring(str.length-6, str.length)
	
	selectEmployee(searchStr);
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
	getTable($ratingsTable, showIfSubmitted(data.ratings), ratingsColumnList, ratingsColumnDefs);
	
	$employeeNameLabel.text(data.profile.forename + " " + data.profile.surname + " " + data.profile.employeeID );
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

function isValidSearch(str){
    var pattern = /([0-9]{6})$/;
    return pattern.test(str);
}

