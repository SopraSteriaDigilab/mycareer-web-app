$(function() {
	init();
});

const OVERVIEW = "overview";
const SUPER_SECTOR = "super-sector";
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
var $superSectorContainer = $("#super-sector-container");
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

function init(){
	verifyUser();
    $selectpicker.selectpicker();
    
    getMyCareerStats();
    
    $selectpicker.on('change', function(){ showContainer($(this).val()); });
}

function getMyCareerStats(){
	var success = function(data){
		setOverviewTable(data);
		$loadingText.hide();
		$selectpickerContainer.show();
		$overviewContainer.show();
	}
	var error = function(error) {}
	
	getMyCareerStatsAction(success, error);
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
	$hrContainers.hide();
	switch (container){
		case OVERVIEW:
			$overviewContainer.show();
			break;
		case SUPER_SECTOR:
			$superSectorContainer.show();
			break;
		case TOTAL_ACCOUNTS:
			$totalAccountsContainer.show();
			break;
		case OBJECTIVES_OVERVIEW:
			$objectivesOverviewContainer.show();
			break;
		case FEEDBACK:
			$feedbackContainer.show();
			break;
		case DEVELOPMENT_NEEDS_OVERVIEW:
			$developmentNeedsOverviewContainer.show();
			break;
		case DEVELOPMENT_NEEDS_BREAKDOWN:
			$developmentNeedsBreakdownContainer.show();
			break;
	}
}