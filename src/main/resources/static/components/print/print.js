//Function to get Objectives data of the user
function getObjectivesData(){
	$.ajax({
	url: 'http://'+getEnvironment()+':8080/getObjectives/'+ getADLoginID(),
    cache: false,
    method: 'GET',
    xhrFields: {'withCredentials': true},
    success: function(data){
    	 	 $("#pdf-modal-body").append(printObjectivesHeader());
	         $.each(data, function(key, val){
	        	 addObjectivesDataToList(val.dueDate, val.title, val.description, val.progress, val.createdOn, val.proposedBy);
	         }); 
	         openPDF("objTable");
     },
     error: function(XMLHttpRequest, textStatus, errorThrown){
         console.log('error', errorThrown);
         toastr.error("Sorry, there was a problem getting Objectives data, please try again later.")
     }
	})
}

//Function to get Feedbacks data of the user
function getFeedbacksData(){
	$.ajax({
    url: 'http://'+getEnvironment()+':8080/getFeedback/'+ getADLoginID(),
    cache: false,
    method: 'GET',
    xhrFields: {'withCredentials': true},
    success: function(data){
    	 	 $("#pdf-modal-body").append(printFeedbacksHeader());
	         $.each(data, function(key, val){
	        	 addFeedbacksDataToList(val.providerEmail, val.providerName, val.feedbackDescription, val.timeStamp);
	         }); 
	         openPDF("feedTable");
     },
     error: function(XMLHttpRequest, textStatus, errorThrown){
         console.log('error', errorThrown);
         toastr.error("Sorry, there was a problem getting Feedbacks data, please try again later.")
     }
	})
}

//Function to get Development Needs data of the user
function getDevelopmentNeedsData(){
	$.ajax({
	url: 'http://'+getEnvironment()+':8080/getDevelopmentNeeds/'+ getADLoginID(),
    cache: false,
    method: 'GET',
    xhrFields: {'withCredentials': true},
    success: function(data){
    	 	 $("#pdf-modal-body").append(printDevelopmentNeedsHeader());
	         $.each(data, function(key, val){
	        	 addDevelopmentNeedsDataToList(val.dueDate, val.title, val.description, val.progress, val.createdOn, val.category);
	         });
	         openPDF("devNeedsTable");
     },
     error: function(XMLHttpRequest, textStatus, errorThrown){
         console.log('error', errorThrown);
         toastr.error("Sorry, there was a problem getting Development Needs data, please try again later.")
     }
	})
}

//Function to get Notes data of the user
function getNotesData(){
	$.ajax({
	url: 'http://'+getEnvironment()+':8080/getNotes/'+ getADLoginID(),
    cache: false,
    method: 'GET',
    xhrFields: {'withCredentials': true},
    success: function(data){
    	 	 $("#pdf-modal-body").append(printNotesHeader());
	         $.each(data, function(key, val){
	        	 addNotesDataToList(val.providerName, val.noteDescription, val.timestamp);
	         }); 
	         openPDF("notesTable");
     },
     error: function(XMLHttpRequest, textStatus, errorThrown){
         console.log('error', errorThrown);
         toastr.error("Sorry, there was a problem getting Notes data, please try again later.")
     }
	})
}

//function to add objectives data to a list and append it on the HTML
function addObjectivesDataToList(dueDate, title, description, progress, createdOn, proposedBy){
    $("#objDetails").append(printObjectivesList(dueDate, title, description, progress, createdOn, proposedBy));
}

//function to add feedbacks data to a list and append it on the HTML
function addFeedbacksDataToList(providerEmail, providerName, feedbackDescription, timeStamp){
    $("#feedDetails").append(printFeedbacksList(providerEmail, providerName, feedbackDescription, timeStamp));
}

//function to add development needs data to a list and append it on the HTML
function addDevelopmentNeedsDataToList(dueDate, title, description, progress, createdOn, category){
    $("#devNeedsDetails").append(printDevelopmentNeedsList(dueDate, title, description, progress, createdOn, category));
}

//function to add notes data to a list and append it on the HTML
function addNotesDataToList(providerName, noteDescription, timestamp){
    $("#notesDetails").append(printNotesList(providerName, noteDescription, timestamp));
}


//Function that returns the objectives table headings
function printObjectivesHeader(){
    var html = " \
         <table class='table table-striped hidden' id='objTable'> \
        <thead> \
            <tr> \
               <th>Expected By</th> \
    	       <th>Title and Description</th> \
    		   <th>Progress</th> \
    		   <th>Created On</th> \
    		   <th>Proposed By</th> \
            </tr> \
            </thead> \
            <tbody id='objDetails'> \
            </tbody> \
        </table> \
    "
    return html;
}

//Function that returns the feedbacks table headings
function printFeedbacksHeader(){
    var html = " \
         <table class='table table-striped hidden' id='feedTable'> \
        <thead> \
            <tr> \
               <th>Provider</th> \
    	       <th>Description</th> \
    		   <th>Provided On</th> \
            </tr> \
            </thead> \
            <tbody id='feedDetails'> \
            </tbody> \
        </table> \
    "
    return html;
}

//Function that returns the development needs table headings
function printDevelopmentNeedsHeader(){
    var html = " \
         <table class='table table-striped hidden' id='devNeedsTable'> \
        <thead> \
            <tr> \
               <th>Expected By</th> \
    	       <th>Title and Description</th> \
    		   <th>Progress</th> \
    		   <th>Created On</th> \
    		   <th>Category</th> \
            </tr> \
            </thead> \
            <tbody id='devNeedsDetails'> \
            </tbody> \
        </table> \
    "
    return html;
}

//Function that returns the notes table headings
function printNotesHeader(){
    var html = " \
         <table class='table table-striped hidden' id='notesTable'> \
        <thead> \
            <tr> \
               <th>Provider</th> \
    	       <th>Description</th> \
    		   <th>Date</th> \
            </tr> \
            </thead> \
            <tbody id='notesDetails'> \
            </tbody> \
        </table> \
    "
    return html;
}

//Function that returns the objectives list in html format with the parameters given
function printObjectivesList(dueDate, title, description, progress, createdOn, proposedBy){
	var html = " \
            <tr> \
                <td>"+timeStampToLongDate(dueDate)+"</td> \
                <td><span style=\"font-weight: bold;\">"+title+"</span><br/>"+description+"</td> \
                <td>"+progress+"</td> \
                <td>"+timeStampToLongDate(createdOn)+"</td> \
                <td>"+proposedBy+"</td> \
            </tr> \
    "
    return html;
}

//Function that returns the feedbacks list in html format with the parameters given
function printFeedbacksList(providerEmail, providerName, feedbackDescription, timeStamp){
    var html = " \
            <tr> \
                <td><span style=\"font-weight: bold;\">"+providerName+"\n\n</span><br/>"+providerEmail+"</td> \
                <td>"+feedbackDescription+"</td> \
                <td>"+timeStampToLongDate(timeStamp)+"</td> \
            </tr> \
    "
    return html;
}

//Function that returns the  development needs list in html format with the parameters given
function printDevelopmentNeedsList(dueDate, title, description, progress, createdOn, category){
	var html = " \
            <tr> \
                <td>"+timeStampToLongDate(dueDate)+"</td> \
                <td><span style=\"font-weight: bold;\">"+title+"\n\n</span><br/>"+description+"</td> \
                <td>"+progress+"</td> \
                <td>"+timeStampToLongDate(createdOn)+"</td> \
                <td>"+category+"</td> \
            </tr> \
    "
    return html;
}

//Function that returns the notes list in html format with the parameters given
function printNotesList(providerName, noteDescription, timestamp){
    var html = " \
            <tr> \
                <td>"+providerName+"</td> \
                <td>"+noteDescription+"</td> \
                <td>"+timeStampToLongDate(timestamp)+"</td> \
            </tr> \
    "
    return html;
}

//Function that creates the table and opens the printable page in a new window
function openPDF(id){
	$('#'+id).DataTable({
		dom: 'Brfti',
		   buttons: [{
			   extend: 'print',
			   exportOptions: {
			        stripHtml: false
			    },
			   customize: function (win) {
		            $(win.document.body).find('table').css('font-size', '10pt');
				   },
			   download: 'open',
			   text: 'Print',
			   title: setDocumentTitle(id),
			   		   
		   }]
		 })
	 $(".dt-buttons").appendTo(".modal-footer");
	 showTable(id);
}

//Function that sets the title that appears on th top of the printed document
function setDocumentTitle(id){
	if(id=== "objTable"){			
		 return("My Objectives");
	}
	else if(id=== "feedTable"){
		return("My Feedbacks");
	}
	else if(id=== "devNeedsTable"){
		return("My Development Needs");
	}
	else if(id=== "notesTable"){
		return("My Notes");
	}
}

//Function that shows the table when clicked
function showTable(id){
    if ($("#"+id).hasClass("hidden")){
         $("#"+id).removeClass("hidden");       
    }
};