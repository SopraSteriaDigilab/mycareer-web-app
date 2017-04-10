$(function() {
	init();
});

//DOM element refrences
var $edit = $("#edit-self-evaluation");
var $save = $("#save-self-evaluation");
var $selfEvaluationText = $("#self-evaluation-text");
var $selfEvaluationInput = $("#self-evaluation-input");
var $managerEvaluationText = $("#manager-evaluation-text");
var $managerEvaluationScore = $("#manager-evaluation-score");

//Constants
var NO_SELF_EVALUATION = "No self evaluation has been written.";
var NO_MANAGER_EVALUATION = "No manager evaluation has been written.";
var NO_RATING = "No Rating Entered";

//Initialise MyRatings Page.
function init(){
	getMyRatings();
	
	$("#edit-self-evaluation").click(function(){ clickEditSelfEvaluation(); });
	$("#save-self-evaluation").click(function(){ clickSaveSelfEvaluation(); });
}

function getMyRatings(){
	console.log("getting my ratings");
	$selfEvaluationText.text(NO_SELF_EVALUATION);
	$managerEvaluationText.text(NO_MANAGER_EVALUATION);
	$managerEvaluationScore.text(NO_RATING);
}

function clickEditSelfEvaluation(){
	$edit.hide();
	$selfEvaluationText.hide();
	$save.show();
	$selfEvaluationInput.text($selfEvaluationText.text().trim()).show();
}

function clickSaveSelfEvaluation(){
	$save.hide();
	$selfEvaluationInput.hide();
	$edit.show();
	$selfEvaluationText.text($selfEvaluationInput.val()).show();
}

