$(function() {
	//initialise jquery ui resizable component
	initResizable();
	
	//Get general-notes
	getNotesList(getADLoginID());
    	
	$("#notes-open").click(function(e) { openNotesBar() });
	 
    $("#notes-close").click(function(e) { closeNotesBar() });
    
	//Validate note
	$('.note-validate').keyup(function() { validateForm('note-validate', 'submit-note'); });
	
	//Click listener to submit note
	$('#submit-note').click(function(){ clickSubmitNote(); });
	
	
});

var noteTypeList = ["General", "Objectives", "Competencies", "Feedback", "Development", "Team"];

function initResizable(){
	$( "#resizable" ).resizable({
		 minWidth: 300,
		 handles: "w"
	});
	
	$('.selectpicker').selectpicker({ width: 'fit'});
	
	$('#note-type-picker').on('change', function(){
	    var selected = $(this).find("option:selected").val();
	    showSection(selected);
	  });
}


//Method to get the Notes list
function getNotesList(userID){
  $.ajax({
      url: 'http://127.0.0.1:8080/getNotes/'+userID,
      method: 'GET',
      success: function(data){
          $.each(data, function(key, val){
          	
          	var date = timeStampToDateTime(new Date(val.timeStamp));
          	addNoteToList(val.fromWho, val.noteType, val.linkID, val.body, date);
          });
      },
      error: function(XMLHttpRequest, textStatus, errorThrown){
          console.log('error', errorThrown);
          toastr.error("Sorry, there was a problem getting notes, please try again later.");
      }
  });
}

//Method to add note to list directly
function addNoteToList(fromWho, noteType, linkID, body, date){
	var listID = "";
	switch(parseInt(noteType)){
		case 0:
			listID = "general";
			break;
		case 1:
			listID = "objective";
			break;
		case 2:
			listID = "competency";
			break;
		case 3:
			listID = "feedback";
			break;
		case 4:
			listID = "development";
			break;
		case 5:
			listID = "team";
			break;
	}
	$("#"+listID+"-notes-list").prepend(notesListHTML(fromWho, noteType, linkID, body, date));
}

//Method to return html
function notesListHTML(fromWho, noteType, linkID, body, date){
	var link="";
	if(linkID>0) link = "#" + linkID; 
	
	var html = " \
	  <li class='list-group-item'> \
	  	<div class='row'> \
			<div class='col-md-6 wrap-text'><h6 ><b>" + fromWho + "</b></h6></div> \
			<div class='col-md-2'><h6 class='pull-right'><b> " + link + "</b></h6></div> \
			<div class='col-md-4'><h6 class='pull-right'><b>" + date + "</b></h6></div> \
		</div> \
		<div class='row'> \
			<div class='col-md-12 wrap-text'><p>" + body + "</p></div> \
		</div> \
	  </li> \
	  ";
	return html;	
}

function addLinkID(id){
	if(id > 0){
		return id;
	}
}


//Method to get data and submit data
function clickSubmitNote(){
	var userID = getADLoginID();
	var noteTypeText = $("#note-type-picker").find("option:selected").val();
	var noteType = noteTypeList.indexOf(noteTypeText);
	var linkID = 0;
	var note = $('#note-text').val().trim();
	var from = getADfullName();
	var date = timeStampToDateTime(new Date());
	addNoteToDB(userID, noteType, linkID, from, note);
	addNoteToList(from, noteType, linkID, note, date);
	
	$('#note-text').val('');
	$('#submit-note').prop("disabled", true);
}


//Method to make ajax call to add note to database
function addNoteToDB(userID, noteType, linkID, from, body ){
	var url = "http://127.0.0.1:8080/addNote/"+userID;
	var data = {};
	data["noteType"] = noteType;
	data["linkID"] = linkID;
	data["from"] = from;
	data["body"] = body;
    
	var settings = {
	  "url": url,
	  "method": "POST",
	  "data": data
	}

	$.ajax(settings).done(function (response) {
	  toastr.success(response);
	});
}

function showSection(section){
	$(".notes-div").each(function(i){
		$(this).fadeOut(1);
		if($(this).hasClass(section)){
			$(this).fadeIn(600);
		}
	});
	
	
}
