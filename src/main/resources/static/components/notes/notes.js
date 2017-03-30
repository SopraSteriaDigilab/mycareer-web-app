$(function() {
	//initialise jquery ui resizable component
	initResizable();

	//Get general-notes and link ids
	getNotesList(getADLoginID());
	
	$("#notes-open").click(function(e) { openNotesBar() });
	 
    $("#notes-close").click(function(e) { closeNotesBar() });
    
	//Validate note
	$('.note-validate').keyup(function() { validateForm('note-validate', 'submit-note'); });
	
	//Click listener to submit note
	$('#submit-note').click(function(){ clickSubmitNote(); });
	
	//Initialising the date pickers
	initNoteDatePicker("note-start", '');
	initNoteDatePicker("note-end", new Date());
	
	//Keep end date updated
	$("#note-start-date").change(function (d){ updateNoteEndDate() });
	
	$("#submit-note-date-filter").click(function (){ applyNoteDateFilter() });
	
	//Click listener to filter note
	$('#filter-note').click(function(){ openNoteFilterModal(); });

});

var noteTypeList = ["general", "objectives", "competencies", "feedback", "development-needs", "team"];
var competencyList = ["Accountability", "Business Awareness", "Effective Communication", "Future Orientation", "Innovation and Change", "Leadership", "Service Excellence", "Teamwork"];

var noteDateFilterApplied = false;
//var noteTagFilterApplied = false;

var firstNoteDate;


function initResizable(){
	$('[data-toggle="tooltip"]').tooltip();
	
	$( "#resizable" ).resizable({
		 minWidth: 300,
		 handles: "w"
	});
	
	$('.selectpicker').selectpicker({ 
		dropupAuto: false,
		width: 'fit'
	});
	
	$('#note-type-picker').on('change', function(){
	    var selected = $(this).find("option:selected").val();
	    showSection(selected);
	  });
}

//Method to get the Notes list
function getNotesList(userID){
  $.ajax({
      url: 'http://'+getEnvironment()+':8080/getNotes/'+userID,
      cache: false,
      method: 'GET',
      xhrFields: {'withCredentials': true},
      success: function(data){
    	  firstNoteDate = timeStampToClassDate(data[0].timestamp);
          lastNoteID = data.length;
          $.each(data, function(key, val){
          	var date = timeStampToDateTime(new Date(val.timestamp));
          	var classDate = timeStampToClassDate(val.timestamp); 
          	addNoteToList(val.providerName, val.noteDescription, date, classDate);
          });
          if(data.length == 0)
        	  $("#general-notes-list").addClass("text-center").append("<h5>You have no Notes</h5>");
      	
      },
      error: function(XMLHttpRequest, textStatus, errorThrown){
          console.log('error', errorThrown);
          toastr.error("Sorry, there was a problem getting notes, please try again later.");
      }
  });
}

//Method to add note to list directly
function addNoteToList(fromWho, body, date, classDate){
	$("#general-notes-list").prepend(notesListHTML(fromWho, body, date, classDate));
}

//Method to return html
function notesListHTML(fromWho, body, date, classDate){	
	var html = " \
		  <li class='list-group-item filterable-note'> \
			  <input type='hidden' class='date-filter' value='"+classDate+"'> \
			  	<div class='row'> \
					<div class='col-md-6 wrap-text'><h6><b>" + fromWho + "</b></h6></div> \
					<div class='col-md-6'><h6 class='pull-right'><b>" + date + "</b></h6></div> \
				</div> \
				<div class='row'> \
					<div class='col-md-12 wrap-text'><p>" + body + "</p></div> \
		            </div> \
		        <div class='row'> \
		            <div class='col-md-8 wrap-text'><p id='linkedTags'></p><div> \
		            <div class='col-md-4 pull-right> \
		  </li> \
	  ";
	return html;
}

//Method to get data and submit data
function clickSubmitNote(){
	var userID = getADLoginID();
	var note = $('#note-text').val().trim();
	var from = getADfullName();
	var date = timeStampToDateTime(new Date());
	
	addNoteToDB(userID, from, note, date);
    
	$('#note-text').val('');
	$('#submit-note').prop("disabled", true);
}

function showSection(section){
	$(".notes-div").each(function(i){
		$(this).fadeOut(1);
		if($(this).hasClass(section)){
			$(this).fadeIn(600);
		}
	});
}

function initNoteDatePicker(id, start){
    $("#"+id+"-date-picker").datepicker({
	   useCurrent: true,
       forceParse: false,
       disabled: true,
       format: "dd-mm-yyyy",
       startDate: start,
       orientation: 'bottom',
       autoclose: true,
    });	
    $("#note-start-date, #note-end-date").val(timeStampToClassDate(new Date()));
}

function updateNoteEndDate(){
	var startDate = formatNoteDate($("#note-start-date").val());
	var endDate = formatNoteDate($("#note-end-date").val());
	
	if(startDate > endDate){
		$("#note-end-date").val(timeStampToClassDate(startDate));
	}
	$("#note-end-date-picker").datepicker('setStartDate', startDate);
}

//Function to open filter modal
function openNoteFilterModal(){
	$('#filter-modal').modal(
			{backdrop: 'static', keyboard: false, show: true}
	);
}

//From dd-mm-yyyy to timestamp
function formatNoteDate(date){
	var day = date.slice(0,2);
	var month = date.slice(3,5);
	var year = date.slice(6,10);
	return new Date(year + '-' + month + '-' + day);
}

function applyNoteDateFilter(){
	var dateRangeList = [];
	var startDate = new formatNoteDate($("#note-start-date").val());
	var endDate = new formatNoteDate($("#note-end-date").val());
	
	for(var date = startDate; date <= endDate; date = date.addDays(1)){
		dateRangeList.push(timeStampToClassDate(date));
	}
	$(".date-filter").each(function(index){
		var date = $(this).val()

		if(jQuery.inArray(date, dateRangeList) > -1){
			$(this).closest('li').removeClass("filteredOutByDate");
		}else{
			$(this).closest('li').addClass("filteredOutByDate");
		}
	});
	noteDateFilterApplied = true;
	updateNoteFilterView();
}

function updateNoteFilterView(){
	$(".filterable-note").each(function(index){
		var note = $(this);
		if(note.hasClass("filteredOutByDate")){
			note.hide();
		}else{
			note.show();
		}
	});
//	var filterText = $("#filter-text");
//	if(dateFilterApplied){
//		filterText.text("Date: "+$("#note-start-date").val()+" to "+$("#note-end-date").val()+".");
//	}else {
//		filterText.text("No Filters Applied");
//	}
}

function clearNoteFilter(filter){
	if(filter === "date"){
		clearNoteDateFilter();
	}
//	else{
//		clearTagFilter();
//	}
	updateNoteFilterView();
}

function clearNoteDateFilter(){
	$("#note-start-date").val(firstNoteDate);
	$("#note-end-date").val(timeStampToClassDate(new Date()));
	updateNoteEndDate();
	$(".filterable-note").each(function(index){
		$(this).closest('div').removeClass("filteredOutByDate");
	});
	applyNoteDateFilter();
	noteDateFilterApplied = false;
}
