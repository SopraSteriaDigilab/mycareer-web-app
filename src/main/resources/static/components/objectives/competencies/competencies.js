$(function() {
	
	//Get general-notes
	getNotesList();
	
	//Validate note
	$('.note-validate').keyup(function() { validateForm('note-validate', 'submit-note'); });
	
	//Click listener to submit note
	$('#submit-note').click(function(){ clickSubmitNote(); });
	
	//Link to competency framework
    $("#view-competency").click(function(){ window.open('http://portal.corp.sopra/hr/HR_UK_SG/mycareerpath/LE/Pages/Competency-Framework.aspx', '_blank'); });
    
    //Click listener to submit competency
    $('.glyphicon-star-empty').click(function(){ selectedCompetency(); });
    
	
});

//Method to make ajax call to add note to database
function addNoteToDB(userID, from, body ){
	var url = "http://localhost:8080/addNote/"+userID;
	var data = {};
	data["from"] = from;
	data["body"] = body;
    
	var settings = {
	  "url": url,
	  "method": "POST",
	  "data": data
	}

	$.ajax(settings).done(function (response) {
	  alert(response);
	});
}

//Method to 
function getNotesList(){
    $.ajax({
        url: 'http://127.0.0.1:8080/getNotes/2312',
        method: 'GET',
        success: function(data){
            $.each(data, function(key, val){
   
            	
            	var date = timeStampToDate(new Date(val.timeStamp));

            	addNoteToList(val.fromWho, val.body, date);
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            console.log('error', errorThrown);
            alert("Sorry, there was a problem getting notes, please try again later.");
        }
    });
}


//Method to get data and submit data
function clickSubmitNote(){
	var userID = 2312;
	var note = $('#note-text').val().trim();
	var from = 'Redhwan';
	var date = timeStampToDate(new Date());
	
	addNoteToDB(userID, from, note);
	addNoteToList(from, note, date);
	
	$('#note-text').val('');
	$('#submit-note').prop("disabled", true);
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
			<div class='col-md-6'><h6 ><b>" + fromWho + "</b></h6></div> \
			<div class='col-md-6'><h6 class='pull-right'><b>" + date + "</b></h6></div> \
		</div> \
		<div class='row'> \
			<div class='col-md-12'><p>" + body + "</p></div> \
		</div> \
	  </li> \
	  ";
	return html;	
}

//TimeStamp to dd/mm/yyyy
function timeStampToDate(date){
	var d = new Date(date);
	var date = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
	
	return date;
}

function selectedCompetency(){
    $('.glyphicon-star-empty').append("<span class='glyphicon glyphicon-star'></span>");
}

    
