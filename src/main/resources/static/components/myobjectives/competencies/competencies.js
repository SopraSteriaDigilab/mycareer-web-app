$(function() {
	initCompetecies();
});

function initCompetecies(){
	getCompetencies(ADLoginID);
	
    $("#view-competency").click(function(){ window.open('http://portal.corp.sopra/hr/HR_UK_SG/mycareerpath/LE/Pages/Competency-Framework.aspx', '_blank'); });
}

function getCompetencies(userId){
	
	var success = function(data){ addCompetenciesToList(data) }
	var error = function(error){}
	
	getCompetenciesAction(userId, success, error);
}

//Method to add competencies to list display
function addCompetenciesToList(data){
	var competenciesHTML = "";
	 $.each(data, function(key, val){
		 competenciesHTML += competenciesListHTML(val.id,val.title,competenciesDescriptions[val.id],val.selected);  
     });
    $("#competency-list").html(competenciesHTML);
}

//Method to return competency html
function competenciesListHTML(id,title,compentencyDescription,isSelected){
    var html = " \
        <div class='panel panel-default competency-item'> \
            <div class='panel-heading panel-heading-sm'> \
                <div class='panel-title notUnderlined'> \
                    <input type='hidden' id='starSelected"+id+"' value='"+isSelected+"'>\
                        <span class='glyphicon glyphicon-star"+ checkSelected(isSelected) +"' id='star-"+ id +"' onClick='starChanger("+id+")' style='cursor:pointer'></span> \
                        <span id='competencyTitle"+ id +"'>" + title + "</span>  \
                        <a class='collapsed' data-toggle='collapse' href='#collapse-" + id + "'></a> \
                </div> \
            </div> \
            <div id='collapse-"+id+"' class='panel-collapse collapse'> \
                <div class='panel-body'> \
                    <h5>"+compentencyDescription+"</h5> \
                </div> \
            </div> \
        </div> \
    "
    return html;
}

//send request to backend to update star to be selected or de-selected
function starChanger(id){
	var userId = ADLoginID;
    var title = $('#competencyTitle'+id).text();
    
    toggleCompetency(userId, id, title);
}


function toggleCompetency(userId, id, title){
	var success = function(response){
        toastr.success("'" + title + "' " + response);
        
        var className = $('#star-'+id).attr('class');
        if (className.indexOf("empty") >= 0){
            $('#star-'+id).removeClass("glyphicon-star-empty").addClass("glyphicon-star");
            $('#starSelected'+id).val("true");
        }else{
            $('#star-'+id).removeClass("glyphicon-star").addClass("glyphicon-star-empty");
            $('#starSelected'+id).val("false");
        }
    }
	var error = function(error){}
	
	toggleCompetencyAction(userId, title, success, error);
}
