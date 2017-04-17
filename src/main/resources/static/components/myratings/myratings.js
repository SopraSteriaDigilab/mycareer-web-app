$(function() {
	init();
});

/** Constants */
const NO_SELF_EVALUATION = "No self evaluation has been written.";
const NO_MANAGER_EVALUATION = "No manager evaluation has been written.";
const NO_RATING = "No Rating Entered";
const RATING = "Rating: ";

/** DOM element references */
var $selfEvaluationOptions = $(".self-evaluation-options");
var $selfEvaluationLabels = $(".self-evaluation-labels");

var $editButtons = $(".edit-buttons");
var $saveCancelButtons = $(".save-cancel-buttons");
var $selfEvaluationText = $("#self-evaluation-text");
var $selfEvaluationInput = $("#self-evaluation-input");
var $managerEvaluationText = $("#manager-evaluation-text");
var $evaluationScore = $("#evaluation-score");

/** Initialise MyRatings Page. */
function init(){
	getCurrentRating();
	
	$("#edit-self-evaluation").click(function(){ editSelfEvaluation(); });
	$("#save-self-evaluation").click(function(){ saveSelfEvaluation(); });
	$("#cancel-self-evaluation").click(function(){ closeSelfEvaluation(false); });
}

/** Retrieve MyRatings details from database and update relevant DOM Elements. */
function getCurrentRating(){
	getCurrentRatingAction(getADLoginID(), function(data){ 
		setMyRatings(data.selfEvaluation, data.managerEvaluation, data.score);
	});
}

/** Sets the three evaluations in the HTML */
function setMyRatings(selfEvaluation, managerEvaluation, evaluationScore){
	var manager = (managerEvaluation == "") ? NO_MANAGER_EVALUATION : managerEvaluation;
	var score = (evaluationScore == 0) ? NO_RATING : RATING + evaluationScore;
	
	setSelfEvaluationLabel(selfEvaluation);
	$selfEvaluationInput.val(selfEvaluation);
	$managerEvaluationText.text(manager);
	$evaluationScore.text(score);
}

/** Sets the self evaluation label */
function setSelfEvaluationLabel(selfEvaluation){
	var self = (selfEvaluation == "") ? NO_SELF_EVALUATION : selfEvaluation;
	$selfEvaluationText.text(self);
}

/** Make self evaluation editable. */
function editSelfEvaluation(){
	$selfEvaluationLabels.hide();
	$selfEvaluationOptions.show();
}

/** Save self evaluation to the database. */
function saveSelfEvaluation(){
	console.log("Saving my self evaluation. Evaluation: " + $selfEvaluationInput.val());
	//TODO Ajax request to save self evaluation.
	closeSelfEvaluation(true); //In Success function 
}

/**
 * Hide editable self evaluations
 * @param save true to save, false to cancel
 */
function closeSelfEvaluation(save){
	$selfEvaluationOptions.hide();
	if(save) 
		setSelfEvaluationLabel($selfEvaluationInput.val());
	$selfEvaluationLabels.show();
}