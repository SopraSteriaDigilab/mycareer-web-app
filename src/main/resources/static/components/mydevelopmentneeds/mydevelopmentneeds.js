$(function() {
	
	//Get list of development needs
	getDevelopmentNeedsList();
	
	//Initialising the date picker
	initDatePicker('development-need', new Date());
	
	//onClick for opening modal
	$('#add-dev-need').click(function() { openAddDevelopmentNeedModal(); });
	
	//modal validation.
	$('.development-need-modal-validate').keyup(function() { validateForm('development-need-modal-validate', 'submit-dev-need'); });
	
	//hide/show date field
	$('#timeframe-radio').change(function(){ toggleInputeDate($('#timeframe-radio input:radio:checked').val()); });
	
	//onClick for Submit modal
	$('#submit-dev-need').click(function(){ clickSubmitDevelopmentNeed(); });
	
	
});

var nextdevID = 0;
var categoryList = ['On Job Training', 'Classroom Training', 'Computer-Based Training (CBT)', 'Online or E-Learning', 'Self-Study', 'Other'];

//Gets the List of Development Needs from the DB
function getDevelopmentNeedsList(){
  $.ajax({
      url: 'http://127.0.0.1:8080/getDevelopmentNeeds/2312',
      method: 'GET',
      success: function(data){
          $.each(data, function(key, val){
        	nextdevID = val.id;
          	excpectedBy = (isOngoing(val.timeToCompleteBy) ? val.timeToCompleteBy : formatDate(val.timeToCompleteBy) );
          	categoryText = categoryList[val.category];
          	addDevelopmentNeedToList(val.id, val.title, val.description, categoryText, excpectedBy);
          });
      },
      error: function(XMLHttpRequest, textStatus, errorThrown){
          console.log('error', errorThrown);
          toastr.error("Sorry, there was a problem getting development needs, please try again later.");
      }
  });	
}

//HTTP request for INSERTING an development need to DB
function addDevelopmentNeedToDB(userID, devNeedTitle, devNeedText, devNeedCategory, devNeedDate){
	var url = "http://127.0.0.1:8080/addDevelopmentNeed/"+userID;
	var data = {};
	data["title"] = devNeedTitle;
	data["description"] = devNeedText;
	data["category"] = devNeedCategory;
	data["timeToCompleteBy"] = devNeedDate;
  
	var settings = {
	  "url": url,
	  "method": "POST",
	  "data": data
	}

	$.ajax(settings).done(function (response) {
	  toastr.success(response);
	});
  
}

//HTTP request for INSERTING an development need to DB
function editDevelopmentNeedOnDB(userID, devNeedID, devNeedTitle, devNeedText, devNeedCategory, devNeedDate){
	var url = "http://localhost:8080/editDevelopmentNeed/"+userID;
	var data = {};
	data["devNeedID"] = devNeedID;
	data["title"] = devNeedTitle;
	data["description"] = devNeedText;
	data["category"] = devNeedCategory;
	data["timeToCompleteBy"] = devNeedDate;
  
	var settings = {
	  "url": url,
	  "method": "POST",
	  "data": data
	}

	$.ajax(settings).done(function (response) {
	  toastr.success(response);
	});
  
}

//Function to set up and open ADD development-need modal
function openAddDevelopmentNeedModal(){
	$("#dev-need-modal-type").val('add');
	setDevelopmentNeedModalContent('', '', '', categoryList[0], getToday(), true);
	showDevelopmentNeedModal(true);
}

//Function to set up and open EDIT development-need modal
function openEditModalDevNeeds(id){
	$("#dev-need-modal-type").val('edit');
	var devNeedID = id;
	var devNeedTitle = $('#dev-need-title-'+id).text().trim();
	var devNeedText = $('#dev-need-text-'+id).text().trim();
	var devNeedCategory = $('#dev-need-category-'+id).text().trim();
	var devNeedDate =  $('#dev-need-date-'+id).text().trim();
	devNeedDate = reverseDateFormat(devNeedDate);
	setDevelopmentNeedModalContent(devNeedID, devNeedTitle, devNeedText, devNeedCategory, devNeedDate, false);
	showDevelopmentNeedModal(true);	
}


function clickSubmitDevelopmentNeed(){
	var type = $("#dev-need-modal-type").val();
	
	var userID = 2312;
	var devNeedID = $("#development-need-id").val();
	var devNeedTitle = $("#development-need-title").val().trim();
	var devNeedText = $("#development-need-text").val().trim();
	var devNeedCategory = $('#category-radio input:radio:checked').val();
	var devNeedDate =  $("#development-need-date").val().trim();
	
	if(type == 'add'){
		addDevelopmentNeedToDB(userID, devNeedTitle, devNeedText, devNeedCategory, devNeedDate);
		addDevelopmentNeedToList((++nextdevID), devNeedTitle, devNeedText, categoryList[devNeedCategory], formatDate(devNeedDate));
	}else{
		editDevelopmentNeedOnDB(userID, devNeedID, devNeedTitle, devNeedText, devNeedCategory, devNeedDate);
		editDevelopmentNeedOnList(devNeedID, devNeedTitle, devNeedText, categoryList[devNeedCategory], devNeedDate);
	}
	
	showDevelopmentNeedModal(false);
}

//Function to add development need to list
function addDevelopmentNeedToList(id, title, description, category, expectedBy){
	$("#dev-needs-list").append(developmentNeedListHTML(id, title, description, category, expectedBy));
}

//Function to update objective on list
function editDevelopmentNeedOnList(id, title, description, category, expectedBy){
	$('#dev-need-title-'+id).text(title);
	$('#dev-need-text-'+id).text(description);
	$('#dev-need-category-'+id).text(category);
	$('#dev-need-date-'+id).text('').append('<h6><b>' + formatDate(expectedBy) + '</b></h6>');
}

//Method to set and show content of modal
function setDevelopmentNeedModalContent(id, title, text, radioValue, date, isAdd){
	$('#dev-need-modal-title-type').text(setTitleType(isAdd));
	$("#development-need-id").val(id);
	$("#development-need-title").val(title);
	$("#development-need-text").val(text);
	$('#'+radioValue.toLowerCase()+'-radio').prop('checked', true);
	$("#development-need-date").val(date);
	$('#submit-dev-need').prop("disabled", isAdd);
}


//Method to show/hide development need modal
function showDevelopmentNeedModal(show){
	if(show){
		$('#development-need-modal').modal({backdrop: 'static', keyboard: false, show: true});
	}else{
		setDevelopmentNeedModalContent('', '', '', categoryList[0], getToday(), true);
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


//Function that returns dev needs list in html format with the parameters given
function developmentNeedListHTML(id, title, description, category, timeToCompleteBy){
	var html = " \
    <div class='panel-group' id='accordion'> \
        <div class='panel panel-default' id='panel'> \
            <div class='panel-heading'> \
                <div class='row'> \
                    <div class='col-sm-6' id='dev-need-no-"+id+"'> # "+id+" </div> \
                    <div class='col-sm-6' id='dev-need-date-"+id+"'><h6><b>" + timeToCompleteBy + "</b></h6></div> \
                </div><br> \
                <div class='row'> \
                    <div class='col-sm-5 wrap-text' id='dev-need-title-"+id+"' ><h5> "+title+" </h5></div> \
                        <div class='col-sm-5'><br> \
                            <div class='progress progress-striped'> \
                                <div class='one primary-color' style='cursor:pointer' id='awaiting-progress'><h5 class='progress-label'>Awaiting</h5></div> \
                                <div class='two primary-color' style='cursor:pointer' id='inflight-progress'><h5 class='progress-label'>InFlight</h5></div> \
                                <div class='three primary-color' style='cursor:pointer' id='done-progress'><h5 class='progress-label'>Done</h5></div> \
                                <div class='progress-bar' id='devNeedStatus' role='progressbar' aria-valuemin='0' aria-valuemax='100'></div> \
                            </div> \
                        </div> \
                        <div class='col-sm-2'> \
                            <a data-toggle='collapse' href='#collapse-dev-"+id+"' class='collapsed'></a> \
                        </div> \
                </div> \
            </div> \
        \
            <div id='collapse-dev-"+id+"' class='panel-collapse collapse'> \
                <div class='panel-body'> \
                    <div class='row'> \
                        <div class='col-md-4'> \
                            <h5><b>Description</b></h5> \
                        </div> \
                        <div class='col-md-8'> \
                            <div class='row'> \
                                <div class='col-md-6'> \
                                    <div class='bottomless progress progress-striped'> \
                                        <div class='progress-bar progress-bar-success progress-middle' id='personal-progress-1' role='progressbar' aria-valuemin='0' aria-valuemax='100'></div> \
                                    </div> \
                                </div> \
                                <div class='col-md-6'> \
                                    <div class='bottomless progress progress-striped'> \
                                        <div class='progress-bar progress-bar-success progress-middle' id='feedback-progress-1' role='progressbar' aria-valuemin='0' aria-valuemax='100'></div> \
                                    </div> \
                                </div> \
                            </div> \
                        </div> \
                    </div> \
                    <div class='row'> \
                        <div class='col-md-12 wrap-text'> \
                            <h5 id='dev-need-text-"+id+"'> "+description+" </h5> \
                        </div> \
                    </div> \
                    <div class='row'> \
	                        <div class='col-md-6' > \
	                           <h6><b> Category: </b><span id='dev-need-category-"+id+"'>" + category + "</span></h6>\
	                        </div> \
	                        <div class='col-md-6'> \
	                            <button type='button' class='btn btn-block btn-default' onClick='openEditModalDevNeeds("+id+")'>Edit</button> \
	                        </div> \
	                <div>\
                </div> \
            </div> \
        </div> \
    </div> \
    "
                            
    return html;
}