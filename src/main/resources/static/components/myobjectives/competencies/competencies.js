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
    

});

//Method to make ajax call to add note to database
function addNoteToDB(userID, from, body ){
	var url = "http://127.0.0.1:8080/addNote/"+userID;
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
                addCompetencyToList(val.id,val.title,val.compentencyDescription,val.isSelected);  
            });
    },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            console.log('error', errorThrown);
            toastr.error("Sorry, there was a problem getting competencies, please try again later.");
        }
    });
}

//Method to add competencies to list display
function addCompetencyToList(id,title,compentencyDescription,isSelected){
    $(".competency-Details").append(competenciesListHTML(id,title,compentencyDescription,isSelected));
}

//Method to return competency html
function competenciesListHTML(id,title,compentencyDescription,isSelected){
    var html = " \
        <div class='panel panel-default'> \
            <div class='panel-heading panel-heading-sm'> \
                <div class='panel-title'> \
                <input type='hidden' id='starSelected"+id+"' value='"+isSelected+"'>\
                    <span class='glyphicon glyphicon-star"+ checkSelected(isSelected) +"' id='star-"+ id +"' onClick='starChanger("+id+")'></span><span id='competencyTitle"+ id +"'>" + title + "</span>  \
                        <a class='collapsed' data-toggle='collapse' href='#collapse-" + id + "'></a> \
                </div> \
            </div> \
            <div id='collapse-"+id+"' class='panel-collapse collapse'> \
                <div class='panel-body'> \
                    <h5>"+compentencyDescription+"</h5> \
                </div> \
            </div> \
        </div><!--End of panel --> \
    "
    return html;
}

//Method to change star icon to selected or not
function checkSelected(isSelected){
    if(isSelected){
        return "";
    }else{
        return "-empty";
    }
}

//send request to backend to update star to be selected or de-selected
function starChanger(id){
    var status = ($('#starSelected'+id).val() === "true") ? false : true;
    var title = $('#competencyTitle'+id).text();
    var userID = 2312;
    
    updateCompetencyStatus(userID,id,title,status);

}

function test(bool){
    if(!bool){
        return true;
    }else{
        return false;
    }
}
//Method to make Ajax call and return clicked competencies to DB
function updateCompetencyStatus(userID, id, title, status){
    var url = "http://127.0.0.1:8080/updateCompetency/2312";
	var data = {};
	data["title"] = title;
	data["status"] = status;
    
	var settings = {
	  "url": url,
	  "method": "POST",
	  "data": data
	}

	$.ajax(settings).done(function (response) {
	  toastr.success(response);
        
    var className = $('#star-'+id).attr('class');
    if (className.indexOf("empty")>=0){
        $('#star-'+id).removeClass("glyphicon-star-empty");
        $('#star-'+id).addClass("glyphicon-star");
        $('#starSelected'+id).val("true");
    }else{
        $('#star-'+id).removeClass("glyphicon-star");
        $('#star-'+id).addClass("glyphicon-star-empty");
        $('#starSelected'+id).val("false");
    }
	});
    
    
}

    
