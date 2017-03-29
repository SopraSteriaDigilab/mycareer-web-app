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

});

var noteTypeList = ["general", "objectives", "competencies", "feedback", "development-needs", "team"];
var competencyList = ["Accountability", "Business Awareness", "Effective Communication", "Future Orientation", "Innovation and Change", "Leadership", "Service Excellence", "Teamwork"];

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
          lastNoteID = data.length;
          $.each(data, function(key, val){
          	var date = timeStampToDateTime(new Date(val.timestamp));
          	addNoteToList(val.providerName, val.noteDescription, date);
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
function addNoteToList(fromWho, body, date){
	$("#general-notes-list").prepend(notesListHTML(fromWho, body, date));
}

//Method to return html
function notesListHTML(fromWho, body, date){	
	var html = " \
	  <li class='list-group-item'> \
	  	<div class='row'> \
			<div class='col-md-6 wrap-text'><h6 ><b>" + fromWho + "</b></h6></div> \
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