$(function() {
    
	//Get list of reportees
	getReportees();
    
});//End of Document Function

//Method to get the Reportee list
function getReportees(){

	    $.ajax({
	        url: 'http://127.0.0.1:8080/getReportees/'+getADLoginID(),
	        method: 'GET',
	        success: function(data){
	            $.each(data, function(key, val){
	            	addReporteeToList(val.employeeID, val.fullName, val.username);
	            });
	        },
	        error: function(XMLHttpRequest, textStatus, errorThrown){
	            console.log('error', errorThrown);
	            toastr.error("Sorry, there was a problem getting notes, please try again later.");
	        }
	    });
}

function addReporteeToList(employeeID, fullName, userName){
	$('#reportee-list').append(reporteeListItemHTML(employeeID, fullName, userName));
}

function reporteeListItemHTML(employeeID, fullName, userName){
	var HTML = " \
		<div class='panel panel-default' style='cursor:pointer' onClick='getReporteeCareer("+employeeID+")' > \
		    <div class='panel-heading'> \
		        <div class='row'> \
		           <div class='col-md-2'> \
		           		"+getProfilePicture(userName, 36)+" \
		           </div> \
		           <div class='col-md-8'><h5><b>"+fullName+"</b></h5></div> \
		        </div> \
		    </div> \
		  </div> \
  ";

  return HTML;
 
}

function getReporteeCareer(id) {
	alert(id);
	
}