$(function() {
	adjustDatePicker();
	adjustDataTablesMomentJs();
});

$loadingSpinner = $("#loading-spinner");
$loadingText = $("#loading-text");

var emails = [];
var fullMonths = ['January','February','March','April','May','June','July','August','September','October','November','December'];
var shortMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
var statusList = ['proposed', 'started', 'completed'];
var statusListDivIDs = ['proposed-obj', 'started-obj', 'completed-obj'];
var modalStatusList = ['Add', 'Edit', 'Propose'];
var categoryIDs = ['on-job-radio', 'classroom-radio', 'online-radio', 'self-study-radio', 'other-radio'];
var categoryList = ['On Job Training', 'Classroom Training', 'Online or E-learning', 'Self Study', 'Other'];
var competenciesDescriptions = [
	"Shows drive and commitment to achieve objectives. Is willing to act decisively and strives to find ways of overcoming obstacles. Takes ownership of issues and empowers team members by giving them an appropriate level of responsibility and autonomy. Does not give up and can be counted on to deliver. Is action oriented.",
	"Expresses ideas clearly, persuasively and with impact. Listens to others and convinces them to accept their ideas. Is open and honest with colleagues and clients. Able to write or present clearly and succinctly in a variety of communication settings and audiences. Gets messages across that have the desired effect. Is timely with provision of information.",
	"Provides clear direction and motivates and inspires others to succeed. Seeks to develop the skills and confidence of others and to recognise and develop talent. Acts as a role model and provides appropriate induction, feedback and coaching to team members. Is willing to confront and challenge poor performance and encourages team members to contribute ideas. Brings the best out of others.",
	"Builds Sopra Steria's reputation in the market by setting high standards of service and delivery. Knows what to measure and how to measure it and looks for opportunities for synergies. Is committed to Service Excellence.",
	"Is able to recognise opportunities to leverage Sopra Steria's capabilities to provide practical and profitable solutions to client's needs. Understands the key commercial issues that affect profitability and growth. Builds relationships with clients and seeks to understand their needs and priorities. Uses this knowledge to provide flexible and reliable solutions to meet and exceed clients' expectations and deliver value to Sopra Steria. Acts as a company Ambassador.",
	"Takes account of a wide range of long-term changes and trends in technology, the market-place and in the business and plans ahead accordingly. Has a clear view of where they want to get to in the medium and longer term. Understands competition. Anticipates consequences and trends.",
	"Shows flexibility and the desire to acquire new knowledge and ideas. Accepts and supports the need for change and looks for new ways of solving problems. Demonstrates the ability to lead and foster change within the organisation. Can act differently depending upon the situation and can handle uncertainty. Is committed to continuous improvement. Comes up with practical steps to implement own or others ideas.",
	"Works cooperatively with colleagues and considers their needs and the impact of decisions on them. Seeks to build relationships across the organisation and to work for the overall good of the business. Able to find common ground and gain trust. Encourages collaboration."];
var nextDevNeedId = [];
var nextObjId = [];
var objectiveTagIds = [];
var developmentNeedTagIds = [];
var lastNoteID = 0;
var emptyArray = [];

function adjustDatePicker(){
	$.fn.datepicker.noConflict = function(){
	   $.fn.datepicker = old;
	   return this;
	};
}

function adjustDataTablesMomentJs(){
	$.fn.dataTable.moment( 'MMM YYYY' );
	$.fn.dataTable.moment( 'MMMM YYYY' );
	$.fn.dataTable.moment( 'DD MMM YYYY' );	
	$.fn.dataTable.moment( 'DD MMM YYYY HH:mm' );
}

//------------------------------------- Objectives -------------------------------------

//Function that finds the largest ID for objectives and finds the next one
function nextObjectiveID(){
	if(nextObjId.length <1){
		nextObjId.push(1);
		return 1;
	}
	
    //numerical sort
    nextObjId.sort(function(a,b){ return a - b;});
    //finds the last id in the list
    var lastId = nextObjId[nextObjId.length - 1];
    nextObjId.push(++lastId);
    return lastId;
}

function numberProgress(progress){
    switch(progress){
        case 'Proposed': return 0;
        case 'In-Progress': return 1;
        case 'Complete': return 2;
    }
}

function numberCategory(category){
    switch(category){
        case categoryList[0]: return 0;
        case categoryList[1]: return 1;
        case categoryList[2]: return 2;
        case categoryList[3]: return 3;
        case categoryList[4]: return 4;
    }
}

function checkComplete(status, item){
	if(status >= item){
		return 'complete';
	}
	return "";
}

function escapeStr(str){
	return str.replace(/"/g, '\\&quot;').replace(/'/g, '\\&apos;');
}

//Method to set and show content of modal
function setObjectiveModalContent(id, title, text, date, status, type){
    if (type == 2){
        $('#proposedTo').html(proposedToHTML());
    	//Get email list and initialise tags input
    	tags("proposed-obj-to", emails);
        keypress('objective-modal');
    }else{
        $('#proposedTo').html("");
    }
	$('#obj-modal-title-type').text(modalStatusList[type]);
	$("#objective-id").val(id);
	$("#objective-title").val(title);
	$("#objective-text").val(text);
	$("#objective-date").val(date);
	$("#objective-status").val(status);
	$('#submit-obj').prop("disabled", enableSubmit(type));
}

//Method to show/hide objective modal
function showObjectiveModal(show){
	if(show){
		$('#objective-modal').modal({backdrop: 'static', keyboard: false, show: true});
	}else{
		setObjectiveModalContent('', '', '', getToday(), 0 , 0);
        $('#proposed-obj-to').val("");
		$('#objective-modal').modal('hide');
	}
}

//Method to handle the submit objective button
function clickSubmitObjective(){
	var type = $("#obj-modal-type").val();
    
	var userID = getADLoginID();
	var objID = $("#objective-id").val();
	var objTitle = $("#objective-title").val().trim();
	var objText = $("#objective-text").val().trim();
	var objDate = $("#objective-date").val().trim();
	var objStatus = parseInt($("#objective-status").val());
	var objIsArchived = $("#objective-is-archived").val();
	
	if(checkIfPastDate(objDate) || (checkEmpty("objective-modal-validate", true))){ return false; }
	
	if(type === 'add'){
		addObjectiveToDB(userID, objTitle, objText, objDate, getADfullName());
        showObjectiveModal(false);
	}else if (type === 'edit'){
		editObjectiveOnDB(userID, objID, objTitle, objText, objDate, objStatus, getADfullName());
        showObjectiveModal(false);
	}else{
		var distributionListName = $("#distribution-list-textbox").val().trim();
		var isChecked = $("#distribution-list-checkbox").is(":checked");
		if(isChecked){
			generateDistributionList(userID, distributionListName, objTitle, objText, objDate);
		}else{
	        var proposedTo = $("#proposed-obj-to").val().trim(); 
	         if (validEmails(proposedTo)){
	             proposeObjective(userID, objTitle, objText, objDate, proposedTo);
	             showObjectiveModal(false);
	        }else{
	          toastr.error("One or more email addresses entered are not valid");
	          showObjectiveModal(true);
	        }
		}
    }
}

function showProposedObjTab(){
	if(!$("#obj-all-tab").hasClass("active")){
		$("#obj-proposed-tab").find('a').trigger("click");
	}
}

//Method to handle the close objective button
function clickCloseObjective(e){
	var type = $("#obj-modal-type").val();
	if ((type=== "edit") || (checkEmptyID("objective-title",false) && checkEmptyID("objective-text",false))){
		$('#objective-modal').modal('hide');
	    }
	else {
		 addHTMLforPopUpBox("objective-modal");
		 var $form = $(this).closest('form');
		  e.preventDefault();
		  $('#confirm').modal({
		      backdrop: 'static',
		      keyboard: false
		    })
		    .one('click', '#close-modals', function(e) {
		    	$('#objective-modal').modal('hide');
		    });
	};
}

//------------------------------------------------------------------------------------

//------------------------------------- Competencies -----------------------------------

//Method to change star icon to selected or not
function checkSelected(isSelected){
    if(isSelected){
        return "";
    }else{
        return "-empty";
    }
}

//------------------------------------------------------------------------------------

//------------------------------------- Feedback -------------------------------------

//method to handle the close send feedback button
function clickCloseSendFeedback(e){
	if (checkEmptyID("sendingTo",false) && checkEmptyID("sendingText",false)){
		$('#sendFeedbackModal').modal('hide');
	    }
	else {
		addHTMLforPopUpBox("send-feedback-modal");
		 var $form = $(this).closest('form');
		  e.preventDefault();
		  $('#confirm').modal({
		      backdrop: 'static',
		      keyboard: false
		    })
		    .one('click', '#close-modals', function(e) {
		    	$('#sendFeedbackModal').modal('hide');
              $("textarea").val("");
              $("#sendingTo").tagsinput('removeAll');
		    });
	};
}

//method to handle the close send feedback button
function clickCloseRequestFeedback(e){
	if (checkEmptyID("requestingTo",false) && checkEmptyID("requestingText",false)){
		$('#requestFeedbackModal').modal('hide');
	    }
	else {
		addHTMLforPopUpBox("request-feedback-modal");
		 var $form = $(this).closest('form');
		  e.preventDefault();
		  $('#confirm').modal({
		      backdrop: 'static',
		      keyboard: false
		    })
		    .one('click', '#close-modals', function(e) {
		    	$('#requestFeedbackModal').modal('hide');
              $("textarea").val("");
              $("#requestingTo").tagsinput('removeAll');
		    });
	};
}

//-------------------------------- Development Needs ---------------------------------

//Method to set and show content of modal
function setDevelopmentNeedModalContent(id, title, text, radioValue, date, type, status){
	$('#dev-need-modal-title-type').text(modalStatusList[type]);
	$("#development-need-id").val(id);
	$("#development-need-title").val(title);
	$("#development-need-text").val(text);
	$('#'+radioValue).prop('checked', true);
	$("#development-need-date").val(date);
	$("#development-need-status").val(status);
	$('#submit-dev-need').prop("disabled", enableSubmit(type));
}

//Method to show/hide development need modal
function showDevelopmentNeedModal(show){
	if(show){
		$('#development-need-modal').modal({backdrop: 'static', keyboard: false, show: true});
	}else{
		setDevelopmentNeedModalContent('', '', '', categoryIDs[0], getToday(), 0, 0);
		$('#development-need-modal').modal('hide');
	}
}

//Function to check if development need is ongoing or has an end date
function isOngoing(date){
	if(date === 'Ongoing'){
		return true;
	}else{
		return false;
	}	
}

//Method to handle the close development need button
function clickCloseDevNeed(e){
	var type = $("#dev-need-modal-type").val();
	if ((type === "edit") || (checkEmptyID("development-need-title",false) && checkEmptyID("development-need-text",false))){
		$('#development-need-modal').modal('hide');
	    }
	else {
		addHTMLforPopUpBox("development-need-modal");
		 var $form = $(this).closest('form');
		  e.preventDefault();
		  $('#confirm').modal({
		      backdrop: 'static',
		      keyboard: false
		    })
		    .one('click', '#close-modals', function(e) {
		    	$('#development-need-modal').modal('hide');
		    });
	};
}

function showProposedDevelopmentTab(){
	if(!$("#dev-need-all-tab").hasClass("active")){
		$("#dev-need-proposed-tab").find('a').trigger("click");
	}
}

//Function that finds the largest ID for objectives and finds the next one
function nextDevelopmentNeedID(){
	if(nextDevNeedId.length <1){
		nextDevNeedId.push(1);
		return 1;
	}
    //numerical sort
    nextDevNeedId.sort(function(a,b){ return a - b;});
    //finds the last id in the list
    var lastId = nextDevNeedId[nextDevNeedId.length - 1];
    nextDevNeedId.push(++lastId);
    return lastId;
}

//------------------------------------------------------------------------------------

//--------------------------------------- Notes --------------------------------------
//

//Method to make ajax call to add note to database
function addNoteToDB(userID, from, body, date){
    $.ajax({
        url: "http://"+getEnvironment()+"/addNote/"+userID,
        method: "POST",
        xhrFields: {'withCredentials': true},
        data:{
            'providerName': from,
            'noteDescription': body,
        },
        success: function(response){
            if(lastNoteID == 0)
        		$("#general-notes-list").removeClass("text-center").empty();
            clearAllNotesFilters();
            var dateFormatted = timeStampToDateTimeGMT(date);
            var classDate = timeStampToClassDate(new Date());
            addNoteToList(++lastNoteID, from, body, dateFormatted, classDate, emptyArray, emptyArray);
            toastr.success(response);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            toastr.error(XMLHttpRequest.responseText);
        }
    });
}

//------------------------------------------------------------------------------------

//--------------------------------------- Tags --------------------------------------

function addToTagsLists(key, id, title){
	if(key === "objectivesTags"){
		$("#objectives-tags-checkboxes").append(tagsCheckboxItemHTML(id, title, "objective"));
	}else{
		$("#development-needs-tags-checkboxes").append(tagsCheckboxItemHTML(id, title, "development-need"));
	}
}

function addToOptionsList(key, id, title){
	if(key === "objectivesTags"){
		return tagsOptionItemHTML(id, title, "obj");
	}else{
		return tagsOptionItemHTML(id, title, "dev");
	}
}

function tagsCheckboxItemHTML(id, title, type){
	var HTML = " \
		<div class='col-md-12 checkbox' id='checkbox-"+type+"-"+id+"'> \
		 <label> \
		    <input class='"+type+"-tag-checkbox' type='checkbox' value='"+id+"'> \
		    <b>#"+id+": </b><span class='checkbox-title'>" + title + "</span> \
		  </label> \
		 </div>	\
	    ";
	return HTML
}

function tagsOptionItemHTML(id, title, type){
	var HTML = "<option value='"+type+"-"+id+"'>#"+id+": "+limitCharacters(title, 20)+"</option>";
	return HTML;	
}

function limitCharacters(text, limit){
	if(text.length >= 20){
		text = text.substring(0,limit).concat("...");
	}	
	return text;
}

function clearTagsCheckboxes() {
	$(".objective-tag-checkbox").prop('checked', false);
	$(".development-need-tag-checkbox").prop('checked', false);
	objectiveTagIds = [];
	developmentNeedTagIds = [];
}

function updateObjectivesTagsList(){
	$(".objective-tag-checkbox").each(function(){
		if($(this).prop("checked") == true){
			if(!(objectiveTagIds.indexOf(this.value) > -1))
				objectiveTagIds.push(this.value);
        }else{
        	if(objectiveTagIds.indexOf(this.value) > -1)
        		objectiveTagIds.splice(objectiveTagIds.indexOf(this.value), 1);
        }
	});
}

function updateDevelopmentNeedsTagsList(){
	$(".development-need-tag-checkbox").each(function(){
		if($(this).prop("checked") == true){
			if(!(developmentNeedTagIds.indexOf(this.value) > -1))
				developmentNeedTagIds.push(this.value);
        }else{
        	if(developmentNeedTagIds.indexOf(this.value) > -1)
        		developmentNeedTagIds.splice(developmentNeedTagIds.indexOf(this.value), 1);
        }
	});
}

//------------------------------------------------------------------------------------

//Initialising the date picker
function initDatePicker(id, today){
	
	$("#"+id+"-date-picker").datepicker({
		useCurrent: true,
		forceParse: false,
		disabled: true,
		daysOfWeekDisabled: [0, 6],
		format: "yyyy-mm",
		startView: "months", 
		minViewMode: "months",
		startDate: today,
		autoclose: true,
	});
	
	$("#"+id+"-date").val(getToday());
	
}

//returns todays date in yyyy-mm format
function getToday(){
	var date = new Date();
	return date.getFullYear() + '-' + addZero(date.getMonth()+1);
}

//Formatting from YYYY-MM date to 'MMM YYYY' (e.g '2016-12' to 'December 2016')
function formatDate(date) {
	var d = new Date(date);
	return fullMonths[d.getMonth()] + ' ' + d.getFullYear();
}

//Formatting from YYYY-MM date to 'MMM YYYY' with a short month (e.g '2016-12' to 'Dec 2016')
function formatDateShort(date) {
	var d = new Date(date);
	return shortMonths[d.getMonth()] + ' ' + d.getFullYear();
}

//TimeStamp to dd/mm/yyyy hh:mm
function timeStampToDateTime(date){
	var d = new Date(Date.parse(date)).toUTCString();
	var formattedDate = d.substring(d.indexOf(",") +1, d.length -7);
	
//	var date = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() + ' ' + addZero(d.getHours()) + ':' + addZero(d.getMinutes());
	
	return formattedDate;
}

function timeStampToDateTimeGMT(date) {
	var d =  addZero(date.getDate()) + ' ' +  shortMonths[date.getMonth()] + ' ' + date.getFullYear() + ' ' + addZero(date.getHours()) + ':' + addZero(date.getMinutes());
	return d;
}

//TimeStamp to dd mmm yyyy
function timeStampToLongDate(date){
	var d = new Date(date);
	var date = addZero(d.getDate()) + ' ' + shortMonths[(d.getMonth())] + ' ' + d.getFullYear();

	return date;
}

//TimeStamp to'YYYY-MM-DD'
function timeStampToClassDate(date){
	var d = new Date(date);
	var date =  addZero(d.getDate()) + '-' + addZero(d.getMonth()+1) + '-' +d.getFullYear();
	
	return date;
}

//Opposite of formatDate(). formatting from 'MMM YYYY' format to 'YYYY-MM' (e.g. 'December 2016' to '2016-12')
function reverseDateFormat(date){
	var year = date.slice(-4, date.length);
	var monthIndex = (fullMonths.indexOf(date.slice(0, -5))) +1;
	return year+'-'+ addZero(monthIndex);
}


//Method to add number of days to date
Date.prototype.addDays = function(days)
{
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

//Method to add 0 for numbers less than 10
function addZero(value){
	if (value < 10){
		return '0' + value;
	}
	return value;
}

//method that enables the submit button only when all inputs in the form have content
function validateForm(inputClass, submitButtonID) {
	var isEmpty = checkEmpty(inputClass, false);
	if(isEmpty){
		$('#'+submitButtonID).prop("disabled", true);
	}else{
		$('#'+submitButtonID).prop("disabled", false);
	}
}

function checkEmpty(inputClass, throwError){
	var isEmpty = false;
	$('.'+inputClass).each(function(i) {
		var value = $(this).val().trim();
		if(!value){
			isEmpty = true;
			return true;
		}
	});
	
	if(isEmpty && throwError)
		toastr.error("Please fill in all mandatory fields.");

	return isEmpty;
} 

function checkEmptyID(inputID, throwError){
	var isEmpty = false;
	var value = $('#'+inputID).val().trim();
	if(!value){
		isEmpty = true;
		return true;
	};
	
	if(isEmpty && throwError)
		toastr.error("Please fill in all mandatory fields.");

	return isEmpty;
} 

function addHTMLforPopUpBox(parentModalID){
	$("#pop-up-"+parentModalID).append(""
			+			"<div id=\"confirm\" class=\"modal fade\" role=\"dialog\" style=\"z-index: 1600;\">"
			+			"<div class=\"modal-dialog modal-sm\">"
			+				"<!-- Modal content-->"
		    +				"<div class=\"modal-content\">"
		    +					"<div class=\"modal-body\">"
		    +						"Your changes are unsaved. Are you sure you want to close this window?"
		  	+					"</div>"
		  	+				"<div class=\"modal-footer\">"
		    +					"<button type=\"button\" data-dismiss=\"modal\" class=\"btn btn-primary\" id=\"close-modals\" onClick=\"$(\"#"+parentModalID+"\").modal(\"hide\");\">Close this window</button>"
		    +					"<button type=\"button\" data-dismiss=\"modal\" class=\"btn\">Cancel</button>"
		  	+				"</div>"
		  	+			"</div>"
			+		"</div>"
			+	"</div>");
} 

function enableSubmit(type){
    if (type === 1){
        return false;
    }
    return true;
}

function tags(id, data){ 
    //sets email addresses to use bootstrap tag input
    $('#'+id).tagsinput({
       maxTags: 20,
       confirmKeys: [9,32,44,59],
       trimValue: true,
       typeahead: {
    	   source: data,
           afterSelect: function() {
               this.$element[0].value = '';
           }
       }
    });
}

function keypress(modalID){
    //keypress to change ; character to ,
   $('#'+modalID).keypress(function(evt){ 
        if(evt.which==59){
            $(this).val($(this).val()+',');
            evt.preventDefault();
        }
    });
}

function imgError(image, size){
	image.onerror=false;
	image.src = "http://teams.duns.uk.sopra/_layouts/15/images/PersonPlaceholder.42x42x32.png?";
	image.style = "min-width:"+size+"px; min-height:"+size+"px; clip:rect(0px, "+size+"px, "+size+"px, 0px); max-width:"+size+"px";
	return true;
}

function getProfilePicture(userName, size){
    var d = new Date();
    var n = d.getTime();
	var imageURL = " \
			<img class='backup_picture' src='http://mysite.corp.sopra/User%20Photos/Images%20du%20profil/"+userName+"_SThumb.jpg?"+n+"' alt='' \
	style='min-width:"+size+"px; min-height:"+size+"px; clip:rect(0px, "+size+"px, "+size+"px, 0px); max-width:"+size+"px;' onerror='imgError(this, "+size+");'> \
			";
	return imageURL;
}
	
function openNotesBar(){
	var screenWidth = $(window).width();
	var sidebarWidth = $("#resizable").width();
	$("#resizable").animate({'left':screenWidth-(sidebarWidth+3) + 'px'});
	$("#resizable").addClass("visibleBar");
}

function closeNotesBar(){
	var width = $("#resizable").width();
	$("#resizable").animate({'left':'100vw'});
	$("#resizable").removeClass("visibleBar");
}

function repositionNotesBar(sidebarWidth,screenWidth){
	$(".visibleBar").css('left',screenWidth-(sidebarWidth+3) + 'px');
}

function validEmails(requestingTo){
    var isValid = true;
    var result = requestingTo.split(",");
        $.each(result, function(key, val){
            isValid = isValidEmailAddress(val);
            return isValid;
        });
    return isValid;
}  

//validates to ensure email format
function isValidEmailAddress(requestingTo){
    var pattern = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return pattern.test(requestingTo.trim());
}

function checkIfPastDate (date){
	var date = new Date(date);
	var today = new Date();
	today = new Date(today.getFullYear(), today.getMonth(), 1);
	
	if(date < today){
		toastr.error("The 'Expected By' date can not be in the past, please change the date and try again.");
		return true;
	}
	return false;
}

function addTags(objTagIds, devNeedTagIds, type){
	HTML = "";
	if(objTagIds == '' && devNeedTagIds == ''){
		HTML = "No tags with this " + type + "."
	}else{
		if(objTagIds.length > 0)
			HTML += "Objectives: " + objTagIds + ". ";
		if(devNeedTagIds.length > 0)
			HTML += "Development Needs: " + devNeedTagIds + ".";
	}
	return HTML;
}

function openAddTagModal(id){
	$("#tag-id").val(id);
    $('#add-tag-modal').modal({backdrop: 'static', keyboard: false, show: true});
}

function clickSubmitTags() {
	var type = $("#tag-type").val();
	var id = $("#tag-id").val();
	if(type === "feedback"){
		updateFeedbackTags(id, objectiveTagIds, developmentNeedTagIds);
	}else{
		updateNoteTags(id, objectiveTagIds, developmentNeedTagIds);
	}
}

function updateTagCheckboxes(objTags, devNeedTags){
	var oTags = objTags.split(',');
	var dnTags = devNeedTags.split(',');
	
	$(".objective-tag-checkbox").each(function(index){
		if(jQuery.inArray(this.value, oTags) > -1){
			$(this).prop('checked', true);
		}		
	});
	
	$(".development-need-tag-checkbox").each(function(index){
		if(jQuery.inArray(this.value, dnTags) > -1){
			$(this).prop('checked', true);
		}		
	});
	
	if(objTags !== "")
		objectiveTagIds = oTags;
	if(devNeedTags !== "")
		developmentNeedTagIds = dnTags;
}

function formatTagFilterValues(objTagIds, devNeedTagIds){
	var filterValue = "";
	
	$(objTagIds).each(function(index){
		filterValue += "obj-"+this+" ";
	});
	
	$(devNeedTagIds).each(function(index){
		filterValue += "dev-"+this+" ";
	});
	
	return filterValue;
}

function deleteTag(id, type){	
	removeNoteTagValues(id,type);
	removeNoteTagFilter(id,type);
}


function removeNoteTagValues(id, type){	
	$(".filterable-note").each(function(index){
		var noteId = this.id.replace("note-","");
		var objIds = $("#note-obj-tags-"+noteId).val().split(',');
		var devIds = $("#note-dev-need-tags-"+noteId).val().split(',');
		if(type === "objective"){
			var index = objIds.indexOf(id);
			if(index > -1){
				objIds.splice(index, 1);
				$("#note-obj-tags-"+noteId).val(objIds);
			}
		}else{
			var index = devIds.indexOf(id);
			if(index > -1){
				devIds.splice(index, 1);
				$("#note-dev-need-tags-"+noteId).val(devIds);
			}
		}
		$("#note-tag-text-"+noteId).text(addTags(objIds, devIds, "note"));	
	});
	
}


function removeNoteTagFilter(id, type){
	var shortType = (type === "objective") ? "obj" : "dev";
	
	$("#checkbox-"+type+"-"+id).remove();
	$("#notes-tag-dropdown").find("[value="+shortType+"-"+id+"]").remove();
	$("#notes-tag-dropdown").selectpicker("refresh");
}

function addTag(Id, title, type) {
	addNoteTagCheckbox(Id, title, type);
	addNoteTagFilter(Id, title, type);
}

function addNoteTagCheckbox(Id, title, type){
	var key = (type === "obj") ? "objectivesTags" : "developmentNeedsTags";
	addToTagsLists(key, Id, title);
}

function addNoteTagFilter(Id, title, type){
	var group = (type === "obj") ? "objectivesTags-group" : "developmentNeedsTags-group";
	$("#"+group).append(tagsOptionItemHTML(Id, title, type));
	$("#notes-tag-dropdown").selectpicker("refresh");
}

function editTag(Id, title, type) {
	editNoteTagCheckbox(Id, title, type);
	editNoteTagFilter(Id, title, type);
}

function editNoteTagCheckbox(Id, title, type){
	var key = (type === "obj") ? "objective" : "development-need";
	$("#checkbox-"+key+"-"+Id).find(".checkbox-title").text(limitCharacters(title, 20));	
}

function editNoteTagFilter(Id, title, type){
	var group = (type === "obj") ? "objectivesTags-group" : "developmentNeedsTags-group";
	$("#"+group).find("[value="+type+"-"+Id+"]").text("#"+Id+": " + limitCharacters(title, 20));
	$("#notes-tag-dropdown").selectpicker("refresh");
}

function openWarningModal(title, body, buttonText, buttonFunction){
	$('#warning-modal').html(warningModalHTML(title, body, buttonText, buttonFunction));
	$('#warning-modal-action').click(function(){ buttonFunction() })
	$('#warning-modal').modal({backdrop: 'static', keyboard: false, show: true});
}

function closeWarningModal(){
	$('#warning-modal').html();
	$('#warning-modal').modal('hide');
}

function warningModalHTML(title, body, buttonText, buttonFunction){
	var HTML = " \
		<div class='modal-dialog modal-sm'> \
	    	<div class='modal-content'> \
				<div class='modal-header'> \
					<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>×</span></button> \
					<h4 class='modal-title'>"+title+"</h4> \
				</div> \
				<div class='modal-body'>"+body+"</div> \
			    <div class='modal-footer'> \
					<button type='button' class='btn btn-default pull-left' data-dismiss='modal'>Close</button> \
					<button type='button' class='btn btn-default pull-right' id='warning-modal-action'>"+buttonText+"</button> \
				</div> \
			</div> \
		</div>";
	return HTML;
}

//verifies if user doesnt have access to HR dashboard it redirects them back to myobjectives
function verifyUser(){
    if(userHasHrDash() === "false" || userHasHrDash() == false){
         window.location ="/myobjectives";
    }
}

function emailListHTML(emails){
	var HTML = "<div class='well well-sm' style='max-height:200px; overflow-x: hidden; overflow-y: auto; word-wrap: break-word;'>";
	for (i = 0; i < emails.length; i++) { 
	    HTML += "<h6>"+emails[i]+"</h6>";
	}
	HTML += "</div>";
	return HTML;	
}

function loading(loadingText){
	if(typeof loadingText != 'undefined' && loadingText.length > 0)
		$loadingText.html(loadingText);
	$loadingSpinner.show();
}

function loaded(){
	$loadingSpinner.hide();
	$loadingText.html("Loading... This may take a minute.");
}



