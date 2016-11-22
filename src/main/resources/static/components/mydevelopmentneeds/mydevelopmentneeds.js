$(function() {
	
	//Get list of development needs
	getDevelopmentNeedsList(getADLoginID());
	
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

var lastDevID = 0;


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
	setDevelopmentNeedModalContent('', '', '', categoryIDs[0], getToday(), 0);
	showDevelopmentNeedModal(true);
}

//Function to set up and open EDIT development-need modal
function openEditDevelopmentNeedModal(id){
	$("#dev-need-modal-type").val('edit');
	var devNeedID = id;
	var devNeedTitle = $('#dev-need-title-'+id).text().trim();
	var devNeedText = $('#dev-need-text-'+id).text().trim();
	var devNeedCategory = categoryIDs[$('#dev-need-category-id-'+id).val()];
	var devNeedDate =  $('#dev-need-date-'+id).text().trim();
	devNeedDate = reverseDateFormat(devNeedDate);
	setDevelopmentNeedModalContent(devNeedID, devNeedTitle, devNeedText, devNeedCategory, devNeedDate, 1);
	showDevelopmentNeedModal(true);	
}


function clickSubmitDevelopmentNeed(){
	var type = $("#dev-need-modal-type").val();
	
	var userID = getADLoginID();
	var devNeedID = $("#development-need-id").val();
	var devNeedTitle = $("#development-need-title").val().trim();
	var devNeedText = $("#development-need-text").val().trim();
	var devNeedCategory = $('#category-radio input:radio:checked').val();
	var devNeedDate =  $("#development-need-date").val().trim();
	
	if(type == 'add'){
		addDevelopmentNeedToDB(userID, devNeedTitle, devNeedText, devNeedCategory, devNeedDate);
		addDevelopmentNeedToList((++lastDevID), devNeedTitle, devNeedText, devNeedCategory, formatDate(devNeedDate));
	}else{
		editDevelopmentNeedOnDB(userID, devNeedID, devNeedTitle, devNeedText, devNeedCategory, devNeedDate);
		editDevelopmentNeedOnList(devNeedID, devNeedTitle, devNeedText, devNeedCategory, devNeedDate);
	}
	
	showDevelopmentNeedModal(false);
}

//Function to add development need to list
function addDevelopmentNeedToList(id, title, description, category, expectedBy){
	lastDevID = id;
	$("#dev-needs-list").append(developmentNeedListHTML(id, title, description, category, expectedBy));
}

//Function to update development need on list
function editDevelopmentNeedOnList(id, title, description, category, expectedBy){
	$('#dev-need-title-'+id).text(title);
	$('#dev-need-text-'+id).text(description);
	$('#dev-need-category-'+id).text(categoryList[category]);
	$('#dev-need-category-id-'+id).val(category);
	$('#dev-need-date-'+id).text('').append('<h6><b>' + formatDate(expectedBy) + '</b></h6>');
}

//Method to set and show content of modal
function setDevelopmentNeedModalContent(id, title, text, radioValue, date, type){
	$('#dev-need-modal-title-type').text(modalStatusList[type]);
	$("#development-need-id").val(id);
	$("#development-need-title").val(title);
	$("#development-need-text").val(text);
	$('#'+radioValue).prop('checked', true);
	$("#development-need-date").val(date);
	$('#submit-dev-need').prop("disabled", enableSubmit(type));
}


//Method to show/hide development need modal
function showDevelopmentNeedModal(show){
	if(show){
		$('#development-need-modal').modal({backdrop: 'static', keyboard: false, show: true});
	}else{
		setDevelopmentNeedModalContent('', '', '', categoryIDs[0], getToday(), 0);
		$('#development-need-modal').modal('hide');
	}
}

function updateDevelopmentNeedStatusOnDB(objID, status){
	alert("I am not implemented yet... :s");
}

//Function that returns dev needs list in html format with the parameters given
function developmentNeedListHTML(id, title, description, category, timeToCompleteBy){
	var html = " \
    <div class='panel-group' id='dev-need-item-"+id+"'> \
        <div class='panel panel-default' id='panel'> \
	        <input type='hidden' id='dev-need-status-"+id+"' value='"+status+"'> \
	        <input type='hidden' id='dev-need-category-id-"+id+"' value='"+category+"'> \
        	<div class='panel-heading'> \
            	<div class='row'> \
            		<div class='col-sm-6'> \
	            		<div class='row'> \
		            		<div class='col-sm-6' id='dev-need-no-"+id+"'><h6><b>#"+id+"</b></h6></div> \
		            		<div class='col-sm-6' id='dev-need-date-"+id+"'><h6 class='pull-right'><b>"+timeToCompleteBy+"</b></h6></div> \
	            		</div> \
	            		<div class='row'> \
		            		<div class='col-sm-12 wrap-text' id='dev-need-title-"+id+"'>"+title+"</div> \
	            		</div> \
            		</div> \
            		<div class='col-sm-5 bs-wizard'> \
            			 <div class='col-xs-4 bs-wizard-step complete' id='proposed-dev-need-dot-"+id+"' onClick='updateDevelopmentNeedStatusOnDB("+id+", 0)'> \
					      <div class='text-center' id='test'><h6>Proposed</h6></div> \
					      <div  class='bs-wizard-dot-start' style='cursor:pointer'></div> \
					     </div> \
					     <div class='col-xs-4 bs-wizard-step "+ checkComplete(status, 1) +"' id='started-dev-need-dot-"+id+"' onClick='updateDevelopmentNeedStatusOnDB("+id+", 1)'> \
					       <div class='text-center'><h6>Started</h6></div> \
					       <div class='progress'><div class='progress-bar'></div></div> \
					       <div  class='bs-wizard-dot-start' style='cursor:pointer'></div> \
					       <div  class='bs-wizard-dot-complete' style='cursor:pointer'></div> \
					     </div> \
					     <div class='col-xs-4 bs-wizard-step  "+ checkComplete(status, 2) +"' id='complete-dev-need-dot-"+id+"' onClick='updateDevelopmentNeedStatusOnDB("+id+", 2)'> \
					       <div class='text-center'><h6>Completed</h6></div> \
					       	 <div class='progress'><div class='progress-bar'></div></div> \
					        <div class='bs-wizard-dot-start' style='cursor:pointer'></div> \
					        <div  class='bs-wizard-dot-complete' style='cursor:pointer'></div> \
					     </div> \
            		</div> \
            		<div class='col-sm-1 chev-height'> \
					  <a data-toggle='collapse' href='#collapse-dev-need-"+id+"' class='collapsed'></a> \
					</div> \
            	</div> \
            </div> \
        \
            <div id='collapse-dev-need-"+id+"' class='panel-collapse collapse'> \
    \
                <div class='panel-body'> \
                    <div class='row'> \
                        <div class='col-md-6'> \
                            <h5><b>Description</b></h5> \
                        </div> \
                       	<div class='col-md-6' > \
                        	<input type='hidden' id='dev-need-category-id-"+id+"' value='" + category + "'> \
	                        <h6><b> Category: </b><span id='dev-need-category-"+id+"'>" + categoryList[category] + "</span></h6>\
	                    </div> \
                    </div> \
                    <div class='row'> \
                        <div class='col-md-12 wrap-text'> \
                            <p id='dev-need-text-"+id+"'>"+description+"</p> \
                        </div> \
                    </div> \
                    <div class='row'> \
	                     <div class='col-md-offset-6 col-md-6'> \
	                        <button type='button' class='btn btn-block btn-default' onClick='openEditDevelopmentNeedModal("+id+")'>Edit</button> \
	                     </div> \
	                <div>\
                </div> \
            </div> \
         \
        </div> \
    </div> \
    "
                            
    return html;
}