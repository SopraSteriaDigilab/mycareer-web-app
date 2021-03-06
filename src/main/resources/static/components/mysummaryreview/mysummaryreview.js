$(function() {
	initMyRating();
});

/** Constants */
const NO_SELF_EVALUATION = "No self rating has been written.";
const MANAGER_RATING_NOT_SUBMITTED = "Manager evaluation has not yet been submitted.";
const NO_MANAGER_EVALUATION_ADDED = "No manager evaluation was added"
const NO_RATING = "No Rating Entered";
const RATING = "Rating: ";

/** DOM element references */
var $selfEvaluationOptions = $(".self-evaluation-options");
var $selfEvaluationLabels = $(".self-evaluation-labels");
var $selfEvaluationFooter = $("#self-evaluation-footer");
var $managerEvaluationFooter = $("#manager-evaluation-footer");
var $editButtons = $(".edit-buttons");
var $saveCancelButtons = $(".save-cancel-buttons");
var $selfEvaluationText = $("#self-evaluation-text");
var $selfEvaluationInput = $("#self-evaluation-input");
var $managerEvaluationText = $("#manager-evaluation-text");
var $evaluationScore = $("#evaluation-score");

var $editButton = $("#edit-self-evaluation");
var $submitButton = $("#submit-self-evaluation");
var $saveButton = $("#save-self-evaluation");
var $cancelButton = $("#cancel-self-evaluation");

var wasSelfEvaluationEmpty = null;
var lastSavedSelfEvaluationInput = null;


/** Initialise MyRatings Page. */
function initMyRating(){
	getCurrentRating();
	
	$editButton.click(function(){ editSelfEvaluation(); });
	$submitButton.click(function(){ submitSelfEvaluation(); });
	$saveButton.click(function(){ saveSelfEvaluation(); });
	$cancelButton.click(function(){ clickClose(); });
}

/** Retrieve MyRatings details from database and update relevant DOM Elements. */
function getCurrentRating(){
	var success = function(data){
		loaded();
		setMyRatings(data.selfEvaluation, data.managerEvaluation, data.score, data.selfEvaluationSubmitted, data.managerEvaluationSubmitted);
	}
	var error = function(){ loaded(); }
	
	getCurrentRatingAction(ADLoginID, success, error);
}

/** Sets the three evaluations in the HTML */
function setMyRatings(selfEvaluation, managerEvaluation, evaluationScore, isSelfEvaluationSubmitted, isManagerEvaluationSubmitted){
	setSelfEvaluationLabel(selfEvaluation);
	setSelfEvaluationInput(selfEvaluation);
	if(isManagerEvaluationSubmitted) {
		setManagerEvaluation(managerEvaluation, evaluationScore);
		$selfEvaluationFooter.html('');
	}else{
		setManagerEvaluation(MANAGER_RATING_NOT_SUBMITTED, 0);
	}
	
	managerEvaluationSubmitted(isManagerEvaluationSubmitted);
	selfEvaluationSubmitted(isSelfEvaluationSubmitted);
	
	$selfEvaluationFooter.show();
	
	if ($selfEvaluationText.text()==="No self rating has been written."){
		wasSelfEvaluationEmpty=true;
		lastSavedSelfEvaluationInput="";
	}
	else{
		wasSelfEvaluationEmpty=false;
		lastSavedSelfEvaluationInput=$selfEvaluationText.text();
	}
}

/** Sets the self evaluation label */
function setSelfEvaluationLabel(selfEvaluation){
	var self = (selfEvaluation === "") ? NO_SELF_EVALUATION : selfEvaluation;
	$selfEvaluationText.text(self);
}

/** Sets the self evaluation label */
function setSelfEvaluationInput(selfEvaluation){
	var self = (selfEvaluation === NO_SELF_EVALUATION) ? "" : selfEvaluation;
	$selfEvaluationInput.val(self);
}

function setManagerEvaluation(managerEvaluation, evaluationScore){
	var manager = (managerEvaluation === "") ? NO_MANAGER_EVALUATION_ADDED : managerEvaluation;
	var score = (evaluationScore == 0) ? "" : RATING + evaluationScore;
	
	$managerEvaluationText.text(manager);
	$evaluationScore.text(score);
}

function selfEvaluationSubmitted(isSelfEvaluationSubmitted){
	if(isSelfEvaluationSubmitted == true)
		$selfEvaluationFooter.html("<div class='col-md-12'><div class='text-left' style='font-size:20px;'>Submitted</div></div>");
}

function managerEvaluationSubmitted(isManagerEvaluationSubmitted){
	if(isManagerEvaluationSubmitted == true)
		$managerEvaluationFooter.prepend("<div class='col-md-9'>Submitted</div>");
}

/** Make self evaluation editable. */
function editSelfEvaluation(){
	$selfEvaluationLabels.hide();
	$selfEvaluationOptions.show();
}

/** Open Confirmation Modal */
function submitSelfEvaluation(){
	var title = "Submit Evaluation";
	var body = "<h5>Once you have submitted your self evlauation, you will no longer be able to edit this.</h5><h5><b>Are you sure you want to submit?</b></h5>";
	var buttonText = "Submit";
	var buttonFunction = function(){ confirmSubmitEvaluation() }
	
	openWarningModal(title, body, buttonText, buttonFunction);
}

/** Update rating on database to submit self evaluation */
function confirmSubmitEvaluation(){
	var id = ADLoginID;
	var success = function(){
		selfEvaluationSubmitted(true);
		closeWarningModal();
	}
	var error = function(error){}
	
	submitSelfEvaluationAction(id, success, error);
}

/** Save self evaluation to the database. */
function saveSelfEvaluation(){
	wasSelfEvaluationEmpty=checkEmptyID("self-evaluation-input",true);
	lastSavedSelfEvaluationInput=$selfEvaluationText.text();
	var id = ADLoginID;
	var data = $selfEvaluationInput.val();
	var success = function(response){ closeSelfEvaluation(true); }
	var error = function(error){}
	
	addSelfEvaluationAction(id, data, success, error);	
}

/**
 * Hide editable self evaluations
 * @param save true to save, false to cancel
 */
function closeSelfEvaluation(save){
	$selfEvaluationOptions.hide();
	if(save){
		setSelfEvaluationLabel($selfEvaluationInput.val());
	}else{
		setSelfEvaluationInput($selfEvaluationText.text())
	}
	$selfEvaluationLabels.show();
	
	closeWarningModal();
}

function clickClose(){
	lastSavedSelfEvaluationInput=$selfEvaluationText.text();
	var title = "Cancel Evaluation";
	var body = "<h5>You have unsaved changes. If you continue, these changes maybe lost.</h5><h5><b>Are you sure you want to continue?</b></h5>";
	var buttonText = "Continue";
	var buttonFunction = function(){ closeSelfEvaluation(false) }
	if ((checkEmptyID("self-evaluation-input",false) && wasSelfEvaluationEmpty)||(lastSavedSelfEvaluationInput===$selfEvaluationInput.val())){
		closeSelfEvaluation(false);
	}
	else{
		openWarningModal(title, body, buttonText, buttonFunction);
	}
}