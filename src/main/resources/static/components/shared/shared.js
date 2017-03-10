$(function() {
	adjustDatePicker();
});

var fullMonths = ['January','Febuary','March','April','May','June','July','August','September','October','November','December'];
var shortMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
var statusList = ['proposed', 'started', 'completed'];
var statusListDivIDs = ['proposed-obj', 'started-obj', 'completed-obj'];
var modalStatusList = ['Add', 'Edit', 'Propose'];
var categoryIDs = ['on-job-radio', 'classroom-radio', 'online-radio', 'self-study-radio', 'other-radio'];
var categoryList = ['On Job Training', 'Classroom Training', 'Online or E-Learning', 'Self-Study', 'Other'];
var lastDevID = 0;
var lastObjID = 0;
var lastNoteID = 0;

function adjustDatePicker(){
	$.fn.datepicker.noConflict = function(){
		   $.fn.datepicker = old;
		   return this;
	};
}

//------------------------------------- Objectives -------------------------------------

//HTTP request for RETRIEVING list of objectives from DB
function getObjectivesList(userID){
  $.ajax({
      url: 'http://'+getEnvironment()+':8080/getObjectives/'+userID,
      cache: false,
      method: 'GET',
      xhrFields: {'withCredentials': true},
      success: function(data){
    	  lastObjID = data.length;
    	  var isEmpty = true;
          $.each(data, function(key, val){
        	  var expectedBy = formatDate(val.timeToCompleteBy);
        	  addObjectiveToList(val.id, val.title, val.description, expectedBy, val.progress, val.isArchived, val.proposedBy);
          });
          if(data.length == 0)
        	  $("#all-obj").addClass("text-center").append("<h5>You have no Objectives</h5>");
      },
      error: function(XMLHttpRequest, textStatus, errorThrown){
          console.log('error', errorThrown);
          toastr.error("Sorry, there was a problem getting objectives, please try again later.");
      }
  });	
}

function checkComplete(status, item){
	if(status >= item){
		return 'complete';
	}
	return "";
}

//Method to set and show content of modal
function setObjectiveModalContent(id, title, text, date, status, type){
    if (type == 2){
        $('#proposedTo').html(proposedToHTML());
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

//------------------------------------------------------------------------------------

//------------------------------------- Competencies -----------------------------------

//Gets the list of Competencies from the DB
function getCompetencyList(userID){
    $.ajax({
        url: 'http://'+getEnvironment()+':8080/getCompetencies/'+userID,
        cache: false,
        method: 'GET',
        xhrFields: {'withCredentials': true},
        success: function(data){
            $.each(data, function(key, val){
                addCompetencyToList(val.id,val.title,val.compentencyDescription,val.isSelected);  
            });
    },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            console.log('error', errorThrown);
            toastr.error("Sorry, there was a problem getting competencies, please try again later.");
        }
    });
}

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
function getGeneralFeedbackList(userID){
    //Gets the List of General Feedback from the DB 
    $.ajax({
        url: 'http://'+getEnvironment()+':8080/getFeedback/'+userID,
        cache: false,
        method: 'GET',
        xhrFields: {'withCredentials': true},
        success: function(data){
            $.each(data, function(key, val){
                var classDate = timeStampToClassDate(val.timeStamp);
                var longDate = timeStampToLongDate(new Date(val.timeStamp));
                var name = (val.providerName) ? val.providerName : val.providerEmail; 
                addGeneralFeedbackToList(val.id, name, val.feedbackDescription, longDate, classDate, val.providerEmail);   
            });//end of for each loop
            if(data.length == 0) {
	        	$("#generalFeeDescription").addClass("text-center").append("<h5>You have no Feedback </h5>");
	        	$("#general-reviewer-list").addClass("text-center").append("<h5>You have no Reviewers </h5>");
	        	$("#general-feedback-tab").addClass("text-center").append("<h5>You have no Reviewers </h5>");
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            console.log('error', errorThrown);
            toastr.error("Sorry, there was a problem getting feedback, please try again later.");
        }
        
    });//End of Ajax request
}

//-------------------------------- Development Needs ---------------------------------

//Gets the List of Development Needs from the DB
function getDevelopmentNeedsList(userID){
	$.ajax({
	    url: 'http://'+getEnvironment()+':8080/getDevelopmentNeeds/'+userID,
        cache: false,
	    method: 'GET',
	    xhrFields: {'withCredentials': true},
	    success: function(data){
        	lastDevID = data.length;
	        $.each(data, function(key, val){
	        	var expectedBy = (isOngoing(val.timeToCompleteBy) ? val.timeToCompleteBy : formatDate(val.timeToCompleteBy) );
	        	addDevelopmentNeedToList(val.id, val.title, val.description, val.category, expectedBy, val.progress);
	        });
	        if(data.length == 0)
	        	  $("#all-dev-need").addClass("text-center").append("<h5>You have no Development Needs</h5>");
	    },
	    error: function(XMLHttpRequest, textStatus, errorThrown){
	        console.log('error', errorThrown);
	        toastr.error("Sorry, there was a problem getting development needs, please try again later.");
	    }
	});	
}

//Function to check if development need is ongoing or has an end date
function isOngoing(date){
	if(date === 'Ongoing'){
		return true;
	}else{
		return false;
	}	
}

//------------------------------------------------------------------------------------

//--------------------------------------- Notes --------------------------------------
//

//Method to make ajax call to add note to database
function addNoteToDB(userID, noteType, linkID, from, body, date){
    $.ajax({
        url: "http://"+getEnvironment()+":8080/addNote/"+userID,
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        xhrFields: {'withCredentials': true},
        data: JSON.stringify({
            'providerName': from,
            'noteDescription': body,
        }),
        success: function(response){
            if(lastNoteID == 0)
        		$("#general-notes-list").removeClass("text-center").empty();
            lastNoteID++;
            addNoteToList(from, body, date);
            toastr.success(response);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            toastr.error(XMLHttpRequest.responseText);
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

//TimeStamp to dd/mm/yyyy hh:mm
function timeStampToDateTime(date){
	var d = new Date(date);
	var date = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() + ' ' + addZero(d.getHours()) + ':' + addZero(d.getMinutes());
	
	return date;
}

//TimeStamp to dd mmm yyyy
function timeStampToLongDate(date){
	var d = new Date(date);
	var date = d.getDate() + ' ' + shortMonths[(d.getMonth())] + ' ' + d.getFullYear();

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
           },
       },

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
	var screenWidth = $(document).width();
	var sidebarWidth = $("#resizable").width();
	$("#resizable").animate({'left':screenWidth-(sidebarWidth+3) + 'px'});
}

function closeNotesBar(){
	var width = $("#resizable").width();
	$("#resizable").animate({'left':'100vw'});
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
    return pattern.test(requestingTo);
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

function showProposedObjTab(){
	if(!$("#obj-all-tab").hasClass("active")){
		$("#obj-proposed-tab").find('a').trigger("click");
	}
}


function getEmailList(tagID){
	   $.ajax({
	    	"async": true,
	        url: 'http://'+getEnvironment()+':8080/data/getAllEmailAddresses',
	        cache: false,
	        method: 'GET',
	        xhrFields: {'withCredentials': true},
	        success: function(data){
	        	tags(tagID, data);
	        },
	        error: function(XMLHttpRequest, textStatus, errorThrown){
	            console.log('error', errorThrown);
	            toastr.error("Sorry, there was a problem getting emails, please try again later.");
	        }
	    });	
	
}