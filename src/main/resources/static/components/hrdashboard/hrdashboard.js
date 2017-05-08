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

var $selectpicker = $("#hr-dashboard-selectpicker");
var $hrContainers = $(".hr-container");

var $overviewContainer = $("#overview-container");
var $superSectorContainer = $("#super-sector-container");
var $totalAccountsContainer = $("#total-accounts-container");
var $objectivesOverviewContainer = $("#objectives-overview-container");
var $feedbackContainer = $("#feedback-container");
var $developmentNeedsOverviewContainer = $("#development-needs-overview-container");
var $developmentNeedsBreakdownContainer = $("#development-needs-breakdown-container");

function init(){
	verifyUser();
    $selectpicker.selectpicker();
    
    getMyCareerStats();
    
    $selectpicker.on('change', function(){ showContainer($(this).val()); });
}

function getMyCareerStats(){
	var success = function(data){ console.log(data); }
	var error = function(error) {}
	
	getMyCareerStatsAction(success, error);
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