$(function() {
	init();
});

const OVERVIEW = "overview";
const SECTOR_BREAKDOWN = "sector-breakdown";
const TOTAL_ACCOUNTS = "total-accounts";
const OBJECTIVES_OVERVIEW = "objectives-overview";
const FEEDBACK = "feedback";
const DEVELOPMENT_NEEDS_OVERVIEW = "development-needs-overview";
const DEVELOPMENT_NEEDS_BREAKDOWN = "development-needs-breakdown";

var $loadingText = $("#dashboard-loading-text");
var $selectpicker = $("#hr-dashboard-selectpicker");
var $selectpickerContainer = $("#selectpicker-container");
var $hrContainers = $(".hr-container");

var $overviewContainer = $("#overview-container");
var $superSectorContainer = $("#sector-breakdown-container");
var $totalAccountsContainer = $("#total-accounts-container");
var $objectivesOverviewContainer = $("#objectives-overview-container");
var $feedbackContainer = $("#feedback-container");
var $developmentNeedsOverviewContainer = $("#development-needs-overview-container");
var $developmentNeedsBreakdownContainer = $("#development-needs-breakdown-container");

var $accountAccessed = $("#account-accessed");
var $usersWithObjective = $("#users-with-objective");
var $usersWithDevelopmentNeed = $("#users-with-development-need");
var $usersWithNote = $("#users-with-note");
var $usersWithCompetency = $("#users-with-competency");
var $usersWithFeedbackRequest = $("#users-with-feedback-request");
var $usersWithFeedback = $("#users-with-feedback");

var $sectorBreakdownTable = $("#sector-breakdown-table");

var sectorBreakDownColumnList = [ { data: "sector" }, { data: "employees" }, { data: "noWithObjs" }, { data: "noWithDevNeeds" }, { data: "percentObjs" }, { data: "percentDevNeeds" }];

var sectorBreakdownLoaded = false;

function init(){
	verifyUser();
    $selectpicker.selectpicker();
    
    getMyCareerStats();
    
    $selectpicker.on('change', function(){ showContainer($(this).val()); });
}

function getMyCareerStats(){
	var success = function(data){
		setOverviewTable(data);
		loaded($overviewContainer);
	}
	
	var error = function(error){}
	
	getMyCareerStatsAction(success, error);
}

function getSectorBreakDown(){
	
	var success = function(data){
		sectorBreakdownLoaded = true;
		loaded($superSectorContainer);
		loadDatatable($sectorBreakdownTable, data, sectorBreakDownColumnList);
	}
	
	var error = function(error){}
	
	$loadingText.show();
	
	getSectorBreakDownAction(success, error);
	
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
				loaded($superSectorContainer);
			}else{
				getSectorBreakDown();
			}
			break;
		case TOTAL_ACCOUNTS:
			loaded($totalAccountsContainer);
			break;
		case OBJECTIVES_OVERVIEW:
			loaded($objectivesOverviewContainer);
			break;
		case FEEDBACK:
			loaded($feedbackContainer);
			break;
		case DEVELOPMENT_NEEDS_OVERVIEW:
			loaded($developmentNeedsOverviewContainer);
			break;
		case DEVELOPMENT_NEEDS_BREAKDOWN:
			loaded($developmentNeedsBreakdownContainer);
			break;
	}
}

function loadDatatable(selectorId, dataset, columnsList){	
	if (!($.fn.dataTable.isDataTable(selectorId))) {
		console.log("loading datatable")
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