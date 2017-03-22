//function to add objectives data overview to a list and append it on the HTML
function addObjectivesDataToList(expectedBy, title, description, status, createdOn, proposedBy){
    $(".objPDF").append(objectivesList(expectedBy, title, description, status, createdOn, proposedBy));
}

//Function that returns objectives list in html format with the parameters given
function objectivesList(expectedBy, title, description, progress, createdOn, proposedBy){
    var html = " \
    <table class='table table-striped hidden' id='objTable'> \
        <thead> \
            <tr> \
               <th>Expected On</th> \
    	       <th>Title and Description</th> \
    		   <th>Progress</th> \
    		   <th>Created On</th> \
    		   <th>Proposed By</th> \
            </tr> \
        </thead> \
        <tbody> \
            <tr> \
                <td>"+expectedBy+"</td> \
                <td><span style=\"font-weight: bold;\">"+title+"</span><br/>"+description+"</td> \
                <td>"+progress+"</td> \
                <td>"+createdOn+"</td> \
                <td>"+proposedBy+"</td> \
            </tr> \
        </tbody> \
    </table> \
    "
    return html;
}

function getObjectivesData(){
	$.ajax({
   // url: 'http://'+getEnvironment()+':8080/getObjectivees/'+"675590",
    url: "http://localhost:8080/getObjectives/675590",
    cache: false,
    method: 'GET',
    xhrFields: {'withCredentials': true},
    success: function(data){
	         $.each(data, function(key, val){
	        	 addObjectivesDataToList(val.timeToCompleteBy, val.title, val.description, val.progress, val.timeStamp, val.proposedBy);
	         }); 
	         openObjPDF();  
     },
     error: function(XMLHttpRequest, textStatus, errorThrown){
         console.log('error', errorThrown);
         toastr.error("Sorry, there was a problem getting Objectives data, please try again later.")
     }
 })
}

function openObjPDF() {
	 $('.objTable').DataTable( {
		 dom: 'Bfrtip',
       buttons: [{
       extend: 'pdfHtml5',
       text: 'DATATABLE BUTTON'
       }]
	 })
	 showTable();
}