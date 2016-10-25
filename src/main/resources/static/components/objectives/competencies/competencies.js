$(function() {
	
	//Get general-notes
	getNotesList();
	
	//Validate note
	$('.note-validate').keyup(function() { validateForm('note-validate', 'submit-note'); });

	$('#submit-note').click(function(){ clickSubmitNote(); });
	
});

function addNote(userID, from, body ){
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

function getNotesList(){
    $.ajax({
        url: 'http://127.0.0.1:8080/getNotes/2312',
        method: 'GET',
        success: function(data){
            $.each(data, function(key, val){
//            	alert(val.id);
//            	alert(val.body);
//            	alert(val.timeStamp);
//            	alert(val.fromWho);
   
            	var d = new Date(val.timeStamp);
            	var date = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
            	
            	$("#general-notes-list").append(notesListHTML(val.body, date, val.fromWho));
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            console.log('error', errorThrown);
            alert("Sorry, there was a problem getting objectives, please try again later.");
        }
    });
}



function clickSubmitNote(){
	var userID = 2312;
	var note = $('#note-text').val().trim();
	var from = 'Redhwan';
	
	addNote(userID, from, note);
		
	$('#note-text').val('');
	$('#submit-note').prop("disabled", true);
}


function notesListHTML(body, date, fromWho){
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