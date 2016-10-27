$(function() {
	
	//Get general-notes
	getNotesList();
    
    //Get competencies
    getCompetencyList();
	
	//Validate note
	$('.note-validate').keyup(function() { validateForm('note-validate', 'submit-note'); });
	
	//Click listener to submit note
	$('#submit-note').click(function(){ clickSubmitNote(); });
	
	//Link to competency framework
    $("#view-competency").click(function(){ window.open('http://portal.corp.sopra/hr/HR_UK_SG/mycareerpath/LE/Pages/Competency-Framework.aspx', '_blank'); });
    
    //change status of competency
    $(".competency-Details").click(function(){
        $(this).find('span').toggleClass('glyphicon-star-empty').toggleClass('glyphicon-star');
    })
    
	
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
	  toastr.success(response);
	});
}

//Method to get the Notes list
function getNotesList(){
    $.ajax({
        url: 'http://127.0.0.1:8080/getNotes/2312',
        method: 'GET',
        success: function(data){
            $.each(data, function(key, val){
            	
            	var date = timeStampToDateTime(new Date(val.timeStamp));

            	addNoteToList(val.fromWho, val.body, date);
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            console.log('error', errorThrown);
            toastr.error("Sorry, there was a problem getting notes, please try again later.");
        }
    });
}


//Method to get data and submit data
function clickSubmitNote(){
	var userID = 2312;
	var note = $('#note-text').val().trim();
	var from = 'Redhwan';
	var date = timeStampToDateTime(new Date());
	
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
			<div class='col-md-6 wrap-text'><h6 ><b>" + fromWho + "</b></h6></div> \
			<div class='col-md-6'><h6 class='pull-right'><b>" + date + "</b></h6></div> \
		</div> \
		<div class='row'> \
			<div class='col-md-12 wrap-text'><p>" + body + "</p></div> \
		</div> \
	  </li> \
	  ";
	return html;	
}

//TimeStamp to dd/mm/yyyy hh:mm
function timeStampToDateTime(date){
	var d = new Date(date);
	var date = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() + ' ' + addZero(d.getHours()) + ':' + addZero(d.getMinutes());
	
	return date;
}

//Gets the list of Competencies from the DB
function getCompetencyList(){
    $.ajax({
        url: 'http://127.0.0.1:8080/getCompetencies/2312',
        method: 'GET',
        success: function(data){
            $.each(data, function(key, val){
                addCompetencyToList(val.id,val.title,val.description,val.status);  
            });
    },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            console.log('error', errorThrown);
            toastr.error("Sorry, there was a problem getting competencies, please try again later.");
        }
    });
}

//Method to return competency html
function competenciesListHTML(id,title,description,status){
    
    var html = " \
        <div class='panel panel-default'> \
            <div class='panel-heading panel-heading-sm'> \
                <div class='panel-title'> \
                    <span class='glyphicon glyphicon-star-empty'></span>" + title + " \
                        <a class='collapsed' data-toggle='collapse' href='#collapse-" + id + "'></a> \
                </div> \
            </div> \
            <div id='collapse-"+id+"' class='panel-collapse collapse'> \
                <div class='panel-body'> \
                    <h5><b>"+description+"</b></h5> \
                    <p></p> \
                </div> \
            </div> \
        </div><!--End of panel --> \
    "
    return html;
}

//Method to add competencies to list display
function addCompetencyToList(id,title,description,status){
    $(".competency-Details").append(competenciesListHTML(id,title,description,status));
}

//Method to make Ajax call and return clicked competencies to DB


    
