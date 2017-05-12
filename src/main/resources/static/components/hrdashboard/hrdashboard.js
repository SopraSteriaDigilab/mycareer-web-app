$(function() {
	init();
});

const OVERVIEW = "overview";
const SECTOR_BREAKDOWN = "sector-breakdown";
const EMPLOYEE_STATS = "employee-stats";
const OBJECTIVES_STATS = "objectives-stats";
const FEEDBACK_STATS = "feedback-stats";
const DEVELOPMENT_NEEDS_STATS = "development-needs-stats";
const DEVELOPMENT_NEEDS_BREAKDOWN = "development-needs-breakdown";

var $loadingText = $("#dashboard-loading-text");
var $selectpicker = $("#hr-dashboard-selectpicker");
var $selectpickerContainer = $("#selectpicker-container");
var $hrContainers = $(".hr-container");

var $overviewContainer = $("#overview-container");
var $sectorBreakdownContainer = $("#sector-breakdown-container");
var $employeeStatsContainer = $("#employee-stats-container");
var $objectivesStatsContainer = $("#objectives-stats-container");
var $feedbackStatsContainer = $("#feedback-stats-container");
var $developmentNeedsStatsContainer = $("#development-needs-stats-container");
var $developmentNeedsBreakdownContainer = $("#development-needs-breakdown-container");

var $accountAccessed = $("#account-accessed");
var $usersWithObjective = $("#users-with-objective");
var $usersWithDevelopmentNeed = $("#users-with-development-need");
var $usersWithNote = $("#users-with-note");
var $usersWithCompetency = $("#users-with-competency");
var $usersWithFeedbackRequest = $("#users-with-feedback-request");
var $usersWithFeedback = $("#users-with-feedback");

var $sectorBreakdownTable = $("#sector-breakdown-table");
var $employeeStatsTable = $("#employee-stats-table");
var $objectivesStatsTable = $("#objectives-stats-table");
var $feedbackStatsTable = $("#feedback-stats-table");
var $developmentNeedsStatsTable = $("#development-needs-stats-table");
var $developmentNeedsBreakdownTable = $("#development-needs-breakdown-table");

var sectorBreakDownColumnList = [ { data: "sector" }, { data: "employees" }, { data: "noWithObjs" }, { data: "noWithDevNeeds" }, { data: "percentObjs" }, { data: "percentDevNeeds" }];
var employeeStatsColumnList = [ { data: "employeeID" }, { data: "fullName" }, { data: "company" }, { data: "superSector" }, { data: "department" }, { data: "lastLogon" },  { data: "currentEmployee" }];
var objectivesStatsColumnList = [ { data: "employeeID" }, { data: "fullName" }, { data: "totalObjectives" }, { data: "proposed" }, { data: "inProgress" }, { data: "complete" },  { data: "company" }, { data: "superSector" }, { data: "department" }];
var feedbackStatsColumnList = [ { data: "employeeID" }, { data: "fullName" }, { data: "totalFeedback" },  { data: "company" }, { data: "superSector" }, { data: "department" }];
var developmentNeedsStatsColumnList = [ { data: "employeeID" }, { data: "fullName" }, { data: "totalDevelopmentNeeds" }, { data: "proposed" }, { data: "inProgress" }, { data: "complete" },  { data: "company" }, { data: "superSector" }, { data: "department" }];
var developmentNeedsBreakdownColumnList = [ { data: "employeeID" }, { data: "fullName" }, { data: "title" }, { data: "category" }, { data: "company" }, { data: "superSector" }, { data: "department" } ]

var sectorBreakdownLoaded = false;
var employeeStatsLoaded = false;
var objectivesStatsLoaded = false;
var feedbackStatsLoaded = false;
var developmentNeedsStatsLoaded = false;
var developmentNeedsBreakdownLoaded = false;

function init(){
	verifyUser();
    $selectpicker.selectpicker();
    
    getMyCareerStats();
    
    $selectpicker.on('change', function(){ showContainer($(this).val()); });
}

function getMyCareerStats(){
	loading();
	var success = function(data){
		setOverviewTable(data);
		loaded($overviewContainer);
	}
	var error = function(error){ }
	
	getMyCareerStatsAction(success, error);
}

function getSectorBreakDown(){
	var success = function(data){
		sectorBreakdownLoaded = true;
		loaded($sectorBreakdownContainer);
		loadDatatable($sectorBreakdownTable, data, sectorBreakDownColumnList);
	}
	var error = function(error){}
	
	getSectorBreakDownAction(success, error);
}

function getEmployeeStats(){
	var success = function(data){
		employeeStatsLoaded = true;
		loaded($employeeStatsContainer);
		loadDatatable($employeeStatsTable, data, employeeStatsColumnList);
	}
	var error = function(error){}
	
	getEmployeeStatsAction(success, error);
}

function getObjectiveStats(){
	var success = function(data){
		objectivesStatsLoaded = true;
		loaded($objectivesStatsContainer);
		loadDatatable($objectivesStatsTable, data, objectivesStatsColumnList);
	}
	var error = function(error){}
	
	getObjectiveStatsAction(success, error);
}

function getFeedbackStats(){
	var success = function(data){
		feedbackStatsLoaded = true;
		loaded($feedbackStatsContainer);
		loadDatatable($feedbackStatsTable, data, feedbackStatsColumnList);
	}
	var error = function(error){}
	
	getFeedbackStatsAction(success, error);
}

function getDevelopmentNeedStats(){
	var success = function(data){
		developmentNeedsStatsLoaded = true;
		loaded($developmentNeedsStatsContainer);
		loadDatatable($developmentNeedsStatsTable, data, developmentNeedsStatsColumnList);
	}
	var error = function(error){}
	
	getDevelopmentNeedStatsAction(success, error);
}

function getDevelopmentNeedBreakDown(){
	var success = function(data){
		developmentNeedsBreakdownLoaded = true;
		loaded($developmentNeedsBreakdownContainer);
		loadDatatable($developmentNeedsBreakdownTable, data, developmentNeedsBreakdownColumnList);
	}
	var error = function(error){}
	
	getDevelopmentNeedBreakDownAction(success, error);
}

function setOverviewTable(data){
	$accountAccessed.text(data.totalAccounts);
	$usersWithObjective.text(data.usersWithObjectives);
	$usersWithDevelopmentNeed.text(data.usersWithDevNeeds);
	$usersWithNote.text(data.usersWithNotes);
	$usersWithCompetency.text(data.usersWithCompetencies);
	$usersWithFeedbackRequest.text(data.usersWithFeedbackRequests);
	$usersWithFeedback.text(data.usersWithFeedback);
}

function showContainer(container){
	loading();
	switch (container){
		case OVERVIEW:
			loaded($overviewContainer);
			break;
		case SECTOR_BREAKDOWN:
			if(sectorBreakdownLoaded){
				loaded($sectorBreakdownContainer);
			}else{
				getSectorBreakDown();
			}
			break;
		case EMPLOYEE_STATS:
			if(employeeStatsLoaded){
				loaded($employeeStatsContainer);
			}else{
				getEmployeeStats();
			}
			break;
		case OBJECTIVES_STATS:
			if(objectivesStatsLoaded){
				loaded($objectivesStatsContainer);
			}else{
				getObjectiveStats();
			}
			
			break;
		case FEEDBACK_STATS:
			if(feedbackStatsLoaded){
				loaded($feedbackStatsContainer);
			}else{
				getFeedbackStats();
			}
			break;
		case DEVELOPMENT_NEEDS_STATS:
			if(developmentNeedsStatsLoaded){
				loaded($developmentNeedsStatsContainer);
			}else{
				getDevelopmentNeedStats();
			}
			break;
		case DEVELOPMENT_NEEDS_BREAKDOWN:
			if(developmentNeedsBreakdownLoaded){
				loaded($developmentNeedsBreakdownContainer);
			}else{
				getDevelopmentNeedBreakDown();
			}
			break;
	}
}

function loadDatatable(selectorId, dataset, columnsList){	
	if (!($.fn.dataTable.isDataTable(selectorId))) {
		 $(selectorId).dataTable({
			 dom: 'Bfrtip',
             buttons: [{
	             extend: 'csvHtml5',
	             text: 'Export to Excel'
             }],
			 data: dataset,
			 columns: columnsList
		 });
	}
}

function loading(){
	$hrContainers.hide();
	$selectpickerContainer.hide()
	$loadingText.show();
}

function loaded(sectionToShow){
	$loadingText.hide();
	$selectpickerContainer.show();
	sectionToShow.show();
}