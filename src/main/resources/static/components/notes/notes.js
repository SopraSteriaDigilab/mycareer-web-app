$(function() {
	//initialise jquery ui resizable component
	initResizable();

	//Get general-notes and link ids
	getNotesList(getADLoginID());
//	getNoteLinks(getADLoginID());
	
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
          	
          	var date = timeStampToDateTime(new Date(val.timeStamp));
          	addNoteToList(val.fromWho, val.noteType, val.linkID, val.body, date);
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

//function getNoteLinks(userID){
//	  $.ajax({
//	      url: 'http://'+getEnvironment()+':8080/getIDTitlePairs/'+userID,
//	      method: 'GET',
//	      success: function(data){
//	          $.each(data, function(key, val){
//	          	 
//	          	 $.each(val, function(k, v){
//	          		 if(key === "Competencies"){
//	          			addLinkID(key.toLowerCase(), ("#"+(++k)+" "+v), k);
//	          		 }else{
//	          			addLinkID(key.toLowerCase(), ("#"+k), v);
//	          		 }
//	          	 });
//	          });
//	      },
//	      error: function(XMLHttpRequest, textStatus, errorThrown){
//	          console.log('error', errorThrown);
//	          toastr.error("Sorry, there was a problem getting notes, please try again later.");
//	      }
//	  });
//	
//}

function addLinkID(divID, id, title){
	$("#"+divID+"-links").append(optionHTML(id, title)).selectpicker("refresh");
}

function optionHTML(id, title){
	var HTML = "<option>"+id+"</option>";
	return HTML;
}

//Method to add note to list directly
function addNoteToList(fromWho, noteType, linkID, body, date){
//	var listID = "";
//	switch(parseInt(noteType)){
//		case 0:
//			listID = "general";
//			break;
//		case 1:
//			listID = "objective";
//			break;
//		case 2:
//			listID = "competency";
//			break;
//		case 3:
//			listID = "feedback";
//			break;
//		case 4:
//			listID = "development-needs";
//			break;
//		case 5:
//			listID = "team";
//			break;
//	}
//	$("#"+listID+"-notes-list").prepend(notesListHTML(fromWho, noteType, linkID, body, date));

	$("#general-notes-list").prepend(notesListHTML(fromWho, noteType, linkID, body, date));
}

//Method to return html
function notesListHTML(fromWho, noteType, linkID, body, date){
	var link="";
//	if(parseInt(noteType)>0){
//		link = linkID
//		if(parseInt(noteType)==2){
//			link++;
//		}
//		link = '#'+link;
//	};
	
	var html = " \
	  <li class='list-group-item'> \
	  	<div class='row'> \
			<div class='col-md-6 wrap-text'><h6 ><b>" + fromWho + "</b></h6></div> \
			<!--<div class='col-md-2'><h6 class='pull-right'><b> " + link + "</b></h6></div> --> \
			<div class='col-md-6'><h6 class='pull-right'><b>" + date + "</b></h6></div> \
		</div> \
		<div class='row'> \
			<div class='col-md-12 wrap-text'><p>" + body + "</p></div> \
		</div> \
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
	var noteType = 0;
	var linkID = 0;
//	var noteTypeText = $("#note-type-picker").find("option:selected").val();
//	var noteType = noteTypeList.indexOf(noteTypeText.toLowerCase());	
//	var linkID = linkID = $("#"+noteTypeText.toLowerCase()+"-links").find("option:selected").val();;
//	if(noteTypeText === "Competencies"){
//		linkID = competencyList.indexOf(linkID);
//	}
//	if(noteTypeText === "General"){
//		linkID = 0;
//	}
	
	addNoteToDB(userID, noteType, linkID, from, note, date);
    
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