$(function() {
	
    //initialization of select picker
    $('.selectpicker').selectpicker();
    
    //verifies that the user has access to HR Dashboard
    verifyUser();
    
    //gets HR data
    getMyCareerStats();
    getHRSuperSectorStats();
    getEmployeeStats();
    getHRObjectivesStats();
    getHRFeedbackStats();
    getHRDevNeedsStats();
    getHRDevNeedBreakdown();

//    //click functions to display specific report and initializarion of specific datatable with added button to export to excel
      $('.selectpicker').on('change', function(){
          if($(this).val() === "MyCareer Overview"){
            showHrOverviewList(); 
          }
          if($(this).val() === "Super Sector"){
             if ( $.fn.dataTable.isDataTable( '#hrSuperSectorTable' ) ) {
                    table = $('#hrSuperSectorTable').DataTable( showHrSuperSectorList() );    
              }
              else {
                    table = $('#hrSuperSectorTable').DataTable( {
                        dom: 'Bfrtip',
                        buttons: [{
                        extend: 'csvHtml5',
                        text: 'Export to Excel'
                        }]
                    });
                showHrSuperSectorList(); 
              }
          }
          if($(this).val() === "Total Accounts"){
              if ( $.fn.dataTable.isDataTable( '#hrEmployeeTable' ) ) {
                    table = $('#hrEmployeeTable').DataTable( showHrEmployeeList() );    
              }
              else {
                    table = $('#hrEmployeeTable').DataTable( {
                        dom: 'Bfrtip',
                        buttons: [{
                        extend: 'csvHtml5',
                        text: 'Export to Excel'
                        }]
                    });
                showHrEmployeeList(); 
              }
            }
          if($(this).val() === "Objectives"){
              if ( $.fn.dataTable.isDataTable( '#hrObjectivesTable' ) ) {
                    table = $('#hrObjectivesTable').DataTable( showHrObjectivesList() );    
              }
              else {
                    table = $('#hrObjectivesTable').DataTable( {
                        dom: 'Bfrtip',
                        buttons: [{
                        extend: 'csvHtml5',
                        text: 'Export to Excel'
                        }]
                    });
                showHrObjectivesList(); 
              }
            }
          if($(this).val() === "Development Needs Overview"){
              if ( $.fn.dataTable.isDataTable( '#hrDevNeedsTable' ) ) {
                    table = $('#hrDevNeedsTable').DataTable( showHrDevelopmentNeedsList() );    
              }
              else {
                    table = $('#hrDevNeedsTable').DataTable( {
                        dom: 'Bfrtip',
                        buttons: [{
                        extend: 'csvHtml5',
                        text: 'Export to Excel'
                        }]
                    });
                showHrDevelopmentNeedsList(); 
              }
            }          
          if($(this).val() === "Development Needs Breakdown"){
              if ( $.fn.dataTable.isDataTable( '#hrDevNeedsBreakdownTable' ) ) {
                    table = $('#hrDevNeedsBreakdownTable').DataTable( showHrDevelopmentNeedsBreakdownList() );    
              }
              else {
                    table = $('#hrDevNeedsBreakdownTable').DataTable( {
                        dom: 'Bfrtip',
                        buttons: [{
                        extend: 'csvHtml5',
                        text: 'Export to Excel'
                        }]
                    });
                showHrDevelopmentNeedsBreakdownList(); 
              }
            }
          if($(this).val() === "Feedback"){
              if ( $.fn.dataTable.isDataTable( '#hrFeedbackTable' ) ) {
                    table = $('#hrFeedbackTable').DataTable( showHrFeedbackList() );    
              }
              else {
                    table = $('#hrFeedbackTable').DataTable( {
                        dom: 'Bfrtip',
                        buttons: [{
                        extend: 'csvHtml5',
                        text: 'Export to Excel'
                        }]
                    });
                showHrFeedbackList(); 
              }
            }          
          });//end of selectpicker change function
});

//verifies if user doesnt have access to HR dashboard it redirects them back to myobjectives
function verifyUser(){
    if(userHasHrDash() === "false" || userHasHrDash() == false){
         window.location ="/myobjectives";
    }
}

//function to get the general HR stats of mycareer
function getMyCareerStats(){
    $.ajax({
       url: 'http://'+getEnvironment()+'/hr/getMyCareerStats',
       cache: false,
       method: 'GET',
       xhrFields: {'withCredentials': true},
       success: function(data){
           addHrDataToList(data.totalAccounts, data.usersWithObjectives, data.usersWithDevNeeds, data.usersWithNotes, data.usersWithCompetencies, data.usersWithFeedbackRequests, data.usersWithFeedback);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            console.log('error', errorThrown);
            toastr.error("Sorry, there was a problem getting HR data, please try again later.")
        }
    });
}

//function to get HR Employee stats of mycareer
function getEmployeeStats(){
    $.ajax({
       url: 'http://'+getEnvironment()+'/hr/getEmployeeStats',
       cache: false,
       method: 'GET',
       xhrFields: {'withCredentials': true},
       success: function(data){           
           $(".hr-dashboard").append(hrEmployeeHeader());
           $.each(data, function(key, val){
               if(val.lastLogon === "Never"){
                   var lastLogged = val.lastLogon;
               }else{
                   var lastLogged = timeStampToLongDate(val.lastLogon);
               }
               addHrEmployeeToList(val.employeeID, val.fullName, val.company, val.superSector, val.department, lastLogged, val.currentEmployee);
            }); 
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            console.log('error', errorThrown);
            toastr.error("Sorry, there was a problem getting HR Employee data, please try again later.")
        }
    });
}

//function to get HR Objectives stats of mycareer
function getHRObjectivesStats(){
    $.ajax({
       url: 'http://'+getEnvironment()+'/hr/getObjectiveStats',
       cache: false,
       method: 'GET',
       xhrFields: {'withCredentials': true},
       success: function(data){           
           $(".hr-dashboard").append(hrObjectivesHeader());
           $.each(data, function(key, val){
               addHrObjectivesToList(val.employeeID, val.fullName, val.totalObjectives, val.proposed, val.inProgress, val.complete, val.company, val.superSector, val.department);
            }); 
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            console.log('error', errorThrown);
            toastr.error("Sorry, there was a problem getting HR Objective data, please try again later.")
        }
    });
}

//function to get HR Development Needs stats of mycareer
function getHRDevNeedsStats(){
    $.ajax({
       url: 'http://'+getEnvironment()+'/hr/getDevelopmentNeedStats',
       cache: false,
       method: 'GET',
       xhrFields: {'withCredentials': true},
       success: function(data){           
           $(".hr-dashboard").append(hrDevNeedsHeader());
           $.each(data, function(key, val){
               addHrDevelopmentNeedsToList(val.employeeID, val.fullName, val.totalDevelopmentNeeds, val.proposed, val.inProgress, val.complete, val.company, val.superSector, val.department);
            }); 
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            console.log('error', errorThrown);
            toastr.error("Sorry, there was a problem getting HR Development Needs overview data, please try again later.")
        }
    });
}

//function to get HR Development Need breakdown stats of mycareer
function getHRDevNeedBreakdown(){
    $.ajax({
       url: 'http://'+getEnvironment()+'/hr/getDevelopmentNeedBreakDown',
       cache: false,
       method: 'GET',
       xhrFields: {'withCredentials': true},
       success: function(data){ 
           $(".hr-dashboard").append(hrDevNeedsBreakdownHeader());
           $.each(data, function(key, val){
               addHrDevelopmentNeedsBreakdownToList(val.employeeID, val.fullName, val.title, val. category, val.company, val.superSector, val.department);
            }); 
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            console.log('error', errorThrown);
            toastr.error("Sorry, there was a problem getting HR Development Needs breakdown data, please try again later.")
        }
    });
}

//function to get HR feedback stats of mycareer
function getHRFeedbackStats(){
    $.ajax({
       url: 'http://'+getEnvironment()+'/hr/getFeedbackStats',
       cache: false,
       method: 'GET',
       xhrFields: {'withCredentials': true},
       success: function(data){           
           $(".hr-dashboard").append(hrFeedbackHeader());
           $.each(data, function(key, val){
                addHrFeedbackToList(val.employeeID, val.fullName, val.totalFeedback, val.company, val.superSector, val.department);
            }); 
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            console.log('error', errorThrown);
            toastr.error("Sorry, there was a problem getting HR Feedback data, please try again later.")
        }
    });
}

//function to get the Super Sector HR stats of mycareer
function getHRSuperSectorStats(){
    $.ajax({
       url: 'http://'+getEnvironment()+'/hr/getSectorBreakDown',
       cache: false,
       method: 'GET',
       xhrFields: {'withCredentials': true},
       success: function(data){
           $(".hr-dashboard").append(hrSuperSectorHeader());
           $.each(data, function(key, val){
                addHrSuperSectorToList(val.sector, val.employees, val.noWithObjs, val.noWithDevNeeds, val.percentObjs, val.percentDevNeeds);
            }); 
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            console.log('error', errorThrown);
            toastr.error("Sorry, there was a problem getting HR Super Sector data, please try again later.")
        }
    });
}


//------------------------------------------------- HR Overview ----------------------------------------------------------------

// function to add HR data overview to a list and append it on the HTML
function addHrDataToList(totalAccounts, usersWithObjectives, usersWithDevNeeds, usersWithNotes, usersWithCompetencies, usersWithFeedbackRequests, usersWithFeedback){
    $(".hr-dashboard").append(hrOverviewList(totalAccounts, usersWithObjectives, usersWithDevNeeds, usersWithNotes, usersWithCompetencies, usersWithFeedbackRequests, usersWithFeedback));
}

// function that shows the HR Overview list when clicked
function showHrOverviewList(){
    if ($("#hrOverviewTable").hasClass("hidden")){
         $("#hrOverviewTable").removeClass("hidden");
    }
    if ($('#hrEmployeeTable_wrapper').not("hidden")){
         $("#hrEmployeeTable_wrapper").addClass("hidden");
    }
    if ($('#hrObjectivesTable_wrapper').not("hidden")){
         $("#hrObjectivesTable_wrapper").addClass("hidden");
    }
    if ($('#hrDevNeedsTable_wrapper').not("hidden")){
         $("#hrDevNeedsTable_wrapper").addClass("hidden");
    }
    if ($('#hrDevNeedsBreakdownTable_wrapper').not("hidden")){
         $("#hrDevNeedsBreakdownTable_wrapper").addClass("hidden");
    }
    if ($('#hrFeedbackTable_wrapper').not("hidden")){
         $("#hrFeedbackTable_wrapper").addClass("hidden");
    }
    if ($("#hrSuperSectorTable_wrapper").not("hidden")){
         $("#hrSuperSectorTable_wrapper").addClass("hidden");
    }
}

//Function that returns HR Overview list in html format with the parameters given
function hrOverviewList(totalAccounts, usersWithObjectives, usersWithDevNeeds, usersWithNotes, usersWithCompetencies, usersWithFeedbackRequests, usersWithFeedback){
    var html = " \
    <table class='table table-striped hidden HRtable' id='hrOverviewTable'> \
        <thead> \
            <tr> \
               <th>Overview of MyCareer</th> \
    	       <th>Number of Users</th> \
            </tr> \
        </thead> \
        <tbody> \
            <tr> \
                <td>Total Accounts Accessed</td> \
                <td>"+totalAccounts+"</td> \
            </tr> \
            <tr> \
                <td>Users with at least one objective</td> \
                <td>"+usersWithObjectives+"</td> \
            </tr> \
            <tr> \
                <td>Users with at least one development need</td> \
                <td>"+usersWithDevNeeds+"</td> \
            </tr> \
            <tr> \
                <td>Users with at least one note</td> \
                <td>"+usersWithNotes+"</td> \
            </tr> \
            <tr> \
                <td>Users that have clicked a competency</td> \
                <td>"+usersWithCompetencies+"</td> \
            </tr> \
            <tr> \
                <td>Users that have submitted a feedback request</td> \
                <td>"+usersWithFeedbackRequests+"</td> \
            </tr> \
            <tr> \
                <td>Users that have received feedback</td> \
                <td>"+usersWithFeedback+"</td> \
            </tr> \
        </tbody> \
    </table> \
    "
    return html;
}

//------------------------------------------------- HR Employees ----------------------------------------------------------------

// function to add HR Employee accessed data to a list and append it on the HTML
function addHrEmployeeToList(employeeID, fullName, company, superSector, department, lastLogged, currentEmployee){
    $("#employeeDetails").append(hrEmployeeList(employeeID, fullName, company, superSector, department, lastLogged, currentEmployee));
}

// function that shows the HR Employee list when clicked
function showHrEmployeeList(){
    if ($("#hrEmployeeTable").hasClass("hidden")){
         $("#hrEmployeeTable").removeClass("hidden");
    }
    if($("#hrEmployeeTable_wrapper").hasClass("hidden")){
         $("#hrEmployeeTable_wrapper").removeClass("hidden");
    }
    if ($("#hrOverviewTable").not("hidden")){
         $("#hrOverviewTable").addClass("hidden");
    }
    if ($('#hrObjectivesTable_wrapper').not("hidden")){
         $("#hrObjectivesTable_wrapper").addClass("hidden");
    }
    if($("#hrDevNeedsTable_wrapper").not("hidden")){
         $("#hrDevNeedsTable_wrapper").addClass("hidden");
    }
    if ($('#hrDevNeedsBreakdownTable_wrapper').not("hidden")){
         $("#hrDevNeedsBreakdownTable_wrapper").addClass("hidden");
    }
    if ($('#hrFeedbackTable_wrapper').not("hidden")){
         $("#hrFeedbackTable_wrapper").addClass("hidden");
    }
    if ($("#hrSuperSectorTable_wrapper").not("hidden")){
         $("#hrSuperSectorTable_wrapper").addClass("hidden");
    }
}

//Function that returns the table headings
function hrEmployeeHeader(){
    var html = " \
        <table class='table table-striped hidden HRtable' id='hrEmployeeTable'> \
            <thead> \
                <tr> \
                   <th>Employee ID</th> \
                   <th>Employee Name</th> \
                   <th>Company</th> \
                   <th>Super Sector</th> \
                   <th>Department</th> \
                   <th>Last Logged On</th> \
                   <th>Current Employee</th> \
                </tr> \
            </thead> \
            <tbody id='employeeDetails'> \
            </tbody> \
        </table> \
    "
    return html;
}

//Function that returns HR Employee accessed list in html format with the parameters given
function hrEmployeeList(employeeID, fullName, company, superSector, department, lastLogged, currentEmployee){
    var html = " \
            <tr> \
                <td>"+employeeID+"</td> \
                <td>"+fullName+"</td> \
                <td>"+company+"</td> \
                <td>"+superSector+"</td> \
                <td>"+department+"</td> \
                <td>"+lastLogged+"</td> \
                <td>"+currentEmployee+"</td> \
            </tr> \
    "
    return html;
}


//------------------------------------------------- HR Objectives ----------------------------------------------------------------

//function to add HR objectives to a list and append it on the HTML
function addHrObjectivesToList(employeeID, fullName, totalObjectives, proposed, inProgress, complete, company, superSector, department){
    $("#objectiveDetails").append(hrObjectivesList(employeeID, fullName, totalObjectives, proposed, inProgress, complete, company, superSector, department));
}

// function that shows the HR Objectives list when clicked
function showHrObjectivesList(){
    if ($("#hrObjectivesTable").hasClass("hidden")){
         $("#hrObjectivesTable").removeClass("hidden");
    }
    if($("#hrObjectivesTable_wrapper").hasClass("hidden")){
         $("#hrObjectivesTable_wrapper").removeClass("hidden");
    }
    if ($("#hrOverviewTable").not("hidden")){
         $("#hrOverviewTable").addClass("hidden");
    }
    if ($('#hrEmployeeTable_wrapper').not("hidden")){
         $("#hrEmployeeTable_wrapper").addClass("hidden");
    }
    if ($('#hrDevNeedsTable_wrapper').not("hidden")){
         $("#hrDevNeedsTable_wrapper").addClass("hidden");
    }
    if ($('#hrDevNeedsBreakdownTable_wrapper').not("hidden")){
         $("#hrDevNeedsBreakdownTable_wrapper").addClass("hidden");
    }
    if ($('#hrFeedbackTable_wrapper').not("hidden")){
         $("#hrFeedbackTable_wrapper").addClass("hidden");
    }
    if ($("#hrSuperSectorTable_wrapper").not("hidden")){
         $("#hrSuperSectorTable_wrapper").addClass("hidden");
    }
}

//Function that returns the table headings
function hrObjectivesHeader(){
    var html = " \
        <table class='table table-striped hidden HRtable' id='hrObjectivesTable'> \
            <thead> \
                <tr> \
                   <th>Employee ID</th> \
                   <th>Employee Name</th> \
                   <th>Total no of Objectives</th> \
                   <th>Objectives Proposed</th> \
                   <th>Objectives In-Progress</th> \
                   <th>Objectives Complete</th> \
                   <th>Company</th> \
                   <th>Super Sector</th> \
                   <th>Department</th> \
                </tr> \
            </thead> \
            <tbody id='objectiveDetails'> \
            </tbody> \
        </table> \
    "
    return html;
}

//Function that returns HR objectives list in html format with the parameters given
function hrObjectivesList(employeeID, fullName, totalObjectives, proposed, inProgress, complete, company, superSector, department){
     var html = " \
            <tr> \
                <td>"+employeeID+"</td> \
                <td>"+fullName+"</td> \
                <td>"+totalObjectives+"</td> \
                <td>"+proposed+"</td> \
                <td>"+inProgress+"</td> \
                <td>"+complete+"</td> \
                <td>"+company+"</td> \
                <td>"+superSector+"</td> \
                <td>"+department+"</td> \
            </tr> \
    "
    return html;
}

//------------------------------------------------- HR Development Needs ----------------------------------------------------------------

//function to add HR Development Needs to a list and append it on the HTML
function addHrDevelopmentNeedsToList(employeeID, fullName, totalDevelopmentNeeds, proposed, inProgress, complete, company, superSector, department){
    $("#devNeedsDetails").append(hrDevelopmentNeedsList(employeeID, fullName, totalDevelopmentNeeds, proposed, inProgress, complete, company, superSector, department));
}

//function to add HR Development Needs Breakdown to a list and append it on the HTML
function addHrDevelopmentNeedsBreakdownToList(employeeID, fullName, title, category, company, superSector, department){
    $("#devNeedsBreakdownDetails").append(hrDevelopmentNeedsBreakdownList(employeeID, fullName, title, category, company, superSector, department));
}

// function that shows the HR Development Needs list when clicked
function showHrDevelopmentNeedsList(){
    if ($("#hrDevNeedsTable").hasClass("hidden")){
         $("#hrDevNeedsTable").removeClass("hidden");
    }
    if($("#hrDevNeedsTable_wrapper").hasClass("hidden")){
         $("#hrDevNeedsTable_wrapper").removeClass("hidden");
    }
    if ($("#hrOverviewTable").not("hidden")){
         $("#hrOverviewTable").addClass("hidden");
    }
    if ($('#hrEmployeeTable_wrapper').not("hidden")){
         $("#hrEmployeeTable_wrapper").addClass("hidden");
    }
    if ($('#hrObjectivesTable_wrapper').not("hidden")){
         $("#hrObjectivesTable_wrapper").addClass("hidden");
    }
    if ($('#hrFeedbackTable_wrapper').not("hidden")){
         $("#hrFeedbackTable_wrapper").addClass("hidden");
    }
    if ($('#hrDevNeedsBreakdownTable_wrapper').not("hidden")){
         $("#hrDevNeedsBreakdownTable_wrapper").addClass("hidden");
    }
    if ($("#hrSuperSectorTable_wrapper").not("hidden")){
         $("#hrSuperSectorTable_wrapper").addClass("hidden");
    }
}

// function that shows the HR Development Needs breakdown list when clicked
function showHrDevelopmentNeedsBreakdownList(){
    if ($("#hrDevNeedsBreakdownTable").hasClass("hidden")){
         $("#hrDevNeedsBreakdownTable").removeClass("hidden");
    }
    if($("#hrDevNeedsBreakdownTable_wrapper").hasClass("hidden")){
         $("#hrDevNeedsBreakdownTable_wrapper").removeClass("hidden");
    }
    if ($("#hrOverviewTable").not("hidden")){
         $("#hrOverviewTable").addClass("hidden");
    }
    if ($('#hrEmployeeTable_wrapper').not("hidden")){
         $("#hrEmployeeTable_wrapper").addClass("hidden");
    }
    if ($('#hrObjectivesTable_wrapper').not("hidden")){
         $("#hrObjectivesTable_wrapper").addClass("hidden");
    }
    if ($('#hrFeedbackTable_wrapper').not("hidden")){
         $("#hrFeedbackTable_wrapper").addClass("hidden");
    }
    if ($('#hrDevNeedsTable_wrapper').not("hidden")){
         $("#hrDevNeedsTable_wrapper").addClass("hidden");
    }
    if ($("#hrSuperSectorTable_wrapper").not("hidden")){
         $("#hrSuperSectorTable_wrapper").addClass("hidden");
    }
}

//Function that returns the table headings for dev needs overview
function hrDevNeedsHeader(){
    var html = " \
        <table class='table table-striped hidden HRtable' id='hrDevNeedsTable'> \
            <thead> \
                <tr> \
                   <th>Employee ID</th> \
                   <th>Employee Name</th> \
                   <th>Total no of Development Needs</th> \
                   <th>Development Needs Proposed</th> \
                   <th>Development Needs In-Progress</th> \
                   <th>Development Needs Complete</th> \
                   <th>Company</th> \
                   <th>Super Sector</th> \
                   <th>Department</th> \
                </tr> \
            </thead> \
            <tbody id='devNeedsDetails'> \
            </tbody> \
        </table> \
    "
    return html;
}

//Function that returns the table headings for dev needs breakdown
function hrDevNeedsBreakdownHeader(){
    var html = " \
        <table class='table table-striped hidden HRtable' id='hrDevNeedsBreakdownTable'> \
            <thead> \
                <tr> \
                   <th>Employee ID</th> \
                   <th>Employee Name</th> \
                   <th>Title</th> \
                   <th>Category</th> \
                   <th>Company</th> \
                   <th>Super Sector</th> \
                   <th>Department</th> \
                </tr> \
            </thead> \
            <tbody id='devNeedsBreakdownDetails'> \
            </tbody> \
        </table> \
    "
    return html;
}


//Function that returns HR development needs list in html format with the parameters given
function hrDevelopmentNeedsList(employeeID, fullName, totalDevelopmentNeeds, proposed, inProgress, complete, company, superSector, department){
var html = " \
            <tr> \
                <td>"+employeeID+"</td> \
                <td>"+fullName+"</td> \
                <td>"+totalDevelopmentNeeds+"</td> \
                <td>"+proposed+"</td> \
                <td>"+inProgress+"</td> \
                <td>"+complete+"</td> \
                <td>"+company+"</td> \
                <td>"+superSector+"</td> \
                <td>"+department+"</td> \
            </tr> \
    "
    return html;
}

//Function that returns HR development needs breakdown list in html format with the parameters given
function hrDevelopmentNeedsBreakdownList(employeeID, fullName, company, superSector, department, title, category){
var html = " \
            <tr> \
                <td>"+employeeID+"</td> \
                <td>"+fullName+"</td> \
                <td>"+company+"</td> \
                <td>"+superSector+"</td> \
                <td>"+department+"</td> \
                <td>"+title+"</td> \
                <td>"+category+"</td> \
            </tr> \
    "
    return html;
}

//------------------------------------------------- HR Feedback ----------------------------------------------------------------

//function to add HR data feedback to a list and append it on the HTML
function addHrFeedbackToList(employeeID, fullName, totalFeedback, company, superSector, department){
    $("#feedbackDetails").append(hrFeedbackList(employeeID, fullName, totalFeedback, company, superSector, department));
}

// function that shows the HR feedback list when clicked
function showHrFeedbackList(){
    if ($("#hrFeedbackTable").hasClass("hidden")){
         $("#hrFeedbackTable").removeClass("hidden");
    }
    if($("#hrFeedbackTable_wrapper").hasClass("hidden")){
         $("#hrFeedbackTable_wrapper").removeClass("hidden");
    }
    if ($("#hrOverviewTable").not("hidden")){
         $("#hrOverviewTable").addClass("hidden");
    }
    if ($('#hrEmployeeTable_wrapper').not("hidden")){
         $("#hrEmployeeTable_wrapper").addClass("hidden");
    }
    if ($('#hrObjectivesTable_wrapper').not("hidden")){
         $("#hrObjectivesTable_wrapper").addClass("hidden");
    }
    if($("#hrDevNeedsTable_wrapper").not("hidden")){
         $("#hrDevNeedsTable_wrapper").addClass("hidden");
    }
    if ($('#hrDevNeedsBreakdownTable_wrapper').not("hidden")){
         $("#hrDevNeedsBreakdownTable_wrapper").addClass("hidden");
    }
    if ($("#hrSuperSectorTable_wrapper").not("hidden")){
         $("#hrSuperSectorTable_wrapper").addClass("hidden");
    }   
}

//Function that returns the table headings
function hrFeedbackHeader(){
    var html = " \
        <table class='table table-striped hidden HRtable' id='hrFeedbackTable'> \
            <thead> \
                <tr> \
                   <th>Employee ID</th> \
                   <th>Employee Name</th> \
                   <th>Total no of Feedback recieved</th> \
                   <th>Company</th> \
                   <th>Super Sector</th> \
                   <th>Department</th> \
                </tr> \
            </thead> \
            <tbody id='feedbackDetails'> \
            </tbody> \
        </table> \
    "
    return html;
}

//Function that returns HR feedback list in html format with the parameters given
function hrFeedbackList(employeeID, fullName, totalFeedback, company, superSector, department){
var html = " \
            <tr> \
                <td>"+employeeID+"</td> \
                <td>"+fullName+"</td> \
                <td>"+totalFeedback+"</td> \
                <td>"+company+"</td> \
                <td>"+superSector+"</td> \
                <td>"+department+"</td> \
            </tr> \
    "
    return html;
}

//------------------------------------------------- HR Super Sector  ----------------------------------------------------------------

function addHrSuperSectorToList(sector, employees, noWithObjs, noWithDevNeeds, percentObjs, percentDevNeeds){
     $("#superSectorDetails").append(hrSuperSectorList(sector, employees, noWithObjs, noWithDevNeeds, percentObjs, percentDevNeeds));
}

function showHrSuperSectorList(){
    if ($("#hrSuperSectorTable").hasClass("hidden")){
         $("#hrSuperSectorTable").removeClass("hidden");
    }
    if ($("#hrSuperSectorTable_wrapper").hasClass("hidden")){
         $("#hrSuperSectorTable_wrapper").removeClass("hidden");
    }  
    if ($("#hrOverviewTable").not("hidden")){
         $("#hrOverviewTable").addClass("hidden");
    }
    if ($('#hrEmployeeTable_wrapper').not("hidden")){
         $("#hrEmployeeTable_wrapper").addClass("hidden");
    }
    if ($('#hrObjectivesTable_wrapper').not("hidden")){
         $("#hrObjectivesTable_wrapper").addClass("hidden");
    }
    if ($('#hrDevNeedsTable_wrapper').not("hidden")){
         $("#hrDevNeedsTable_wrapper").addClass("hidden");
    }
    if ($('#hrDevNeedsBreakdownTable_wrapper').not("hidden")){
         $("#hrDevNeedsBreakdownTable_wrapper").addClass("hidden");
    }
    if ($('#hrFeedbackTable_wrapper').not("hidden")){
         $("#hrFeedbackTable_wrapper").addClass("hidden");
    }
}

function hrSuperSectorHeader(){
    var html = " \
    <table class='table table-striped hidden HRtable' id='hrSuperSectorTable'> \
        <thead> \
            <tr> \
               <th>Super Sector</th> \
    	       <th>Employees</th> \
               <th>No. with Objectives</th> \
               <th>No. with Development</th> \
               <th>% with Objectives</th> \
               <th>% with Development</th> \
            </tr> \
        </thead> \
        <tbody id='superSectorDetails'> \
        </tbody> \
    </table> \
    "
    return html;    
}

function hrSuperSectorList(sector, employees, noWithObjs, noWithDevNeeds, percentObjs, percentDevNeeds){
        var html = " \
            <tr> \
               <td>"+sector+"</td> \
    	       <td>"+employees+"</td> \
               <td>"+noWithObjs+"</td> \
               <td>"+noWithDevNeeds+"</td> \
               <td>"+percentObjs+"%</td> \
               <td>"+percentDevNeeds+"%</td> \
            </tr> \
    "
    return html;
}