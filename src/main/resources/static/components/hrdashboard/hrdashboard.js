$(function() {
    
    //inicialization of select picker
    $('.selectpicker').selectpicker();
    
    //verifies that the user has access to HR Dashboard
    verifyUser();
    
    //gets HR data
    getHRdata();
    getEmployeeStats();
    getHRObjectivesStats();
    getHRDevNeedsStats();
    getHRFeedbackStats();
    
    //click functions to display specific report
      $('.selectpicker').on('change', function(){
          if($(this).val() === "Overview"){
            showHrOverviewList(); 
          }else if($(this).val() === "Employees"){
             $('#hrEmployeeTable').dataTable(  showHrEmployeeList()  ); 
          }else if($(this).val() === "Objectives"){
             $('#hrObjectivesTable').dataTable(  showHrObjectivesList()  ); 
          }else if($(this).val() === "Development Needs"){
             $('#hrDevNeedsTable').dataTable( showHrDevelopmentNeedsList() ); 
          }else if($(this).val() === "Feedback"){
             $('#hrFeedbackTable').dataTable( showHrFeedbackList() ); 
          }
        });

});

//verifies if user doesnt have access to HR dashboard it redirects them back to myobjectives
function verifyUser(){
    if(userHasHrDash() === "false" || userHasHrDash() == false){
         window.location ="/myobjectives";
    }
}

//function to get the general HR stats of mycareer
function getHRdata(){
    $.ajax({
       url: 'http://'+getEnvironment()+':8080/hr/getHRData',
       cache: false,
       method: 'GET',
       xhrFields: {'withCredentials': true},
       success: function(data){
           addHrDataToList(data.totalAccounts, data.totalUsersWithObjectives, data.totalUsersWithDevelopmentNeeds, data.totalUsersWithNotes, data.totalUsersWithCompetencies, data.totalUsersWithSubmittedFeedback, data.totalUsersWithFeedback);
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
       url: 'http://'+getEnvironment()+':8080/hr/getEmployeeStats',
       cache: false,
       method: 'GET',
       xhrFields: {'withCredentials': true},
       success: function(data){           
           $(".hr-dashboard").append(hrEmployeeHeader());
           $.each(data, function(key, val){
               addHrEmployeeToList(val.employeeID, val.fullName, val.company, val.superSector, val.department);
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
       url: 'http://'+getEnvironment()+':8080/hr/getObjectiveStats',
       cache: false,
       method: 'GET',
       xhrFields: {'withCredentials': true},
       success: function(data){           
           $(".hr-dashboard").append(hrObjectivesHeader());
           $.each(data, function(key, val){
               addHrObjectivesToList(val.employeeID, val.fullName, val.totalObjectives, val.proposedCount, val.setCount, val.completeCount, val.company, val.superSector, val.department);
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
       url: 'http://'+getEnvironment()+':8080/hr/getDevNeedsStats',
       cache: false,
       method: 'GET',
       xhrFields: {'withCredentials': true},
       success: function(data){           
           $(".hr-dashboard").append(hrDevNeedsHeader());
           $.each(data, function(key, val){
               addHrDevelopmentNeedsToList(val.employeeID, val.fullName, val.totalDevNeeds, val.proposedCount, val.setCount, val.completeCount, val.company, val.superSector, val.department);
            }); 
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            console.log('error', errorThrown);
            toastr.error("Sorry, there was a problem getting HR Development Needs data, please try again later.")
        }
    });
}

//function to get HR feedback stats of mycareer
function getHRFeedbackStats(){
    $.ajax({
       url: 'http://'+getEnvironment()+':8080/hr/getFeedbackStats',
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

//------------------------------------------------- HR Overview ----------------------------------------------------------------

// function to add HR data overview to a list and append it on the HTML
function addHrDataToList(totalAccounts, totalUsersWithObjectives, totalUsersWithDevelopmentNeeds, totalUsersWithNotes, totalUsersWithCompetencies, totalUsersWithSubmittedFeedback, totalUsersWithFeedback){
    $(".hr-dashboard").append(hrOverviewList(totalAccounts, totalUsersWithObjectives, totalUsersWithDevelopmentNeeds, totalUsersWithNotes, totalUsersWithCompetencies, totalUsersWithSubmittedFeedback, totalUsersWithFeedback));
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
    if ($('#hrFeedbackTable_wrapper').not("hidden")){
         $("#hrFeedbackTable_wrapper").addClass("hidden");
    }
}

//Function that returns HR Overview list in html format with the parameters given
function hrOverviewList(totalAccounts, totalUsersWithObjectives, totalUsersWithDevelopmentNeeds, totalUsersWithNotes, totalUsersWithCompetencies, totalUsersWithSubmittedFeedback, totalUsersWithFeedback){
    var html = " \
    <table class='table table-striped hidden' id='hrOverviewTable'> \
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
                <td>"+totalUsersWithObjectives+"</td> \
            </tr> \
            <tr> \
                <td>Users with at least one development need</td> \
                <td>"+totalUsersWithDevelopmentNeeds+"</td> \
            </tr> \
            <tr> \
                <td>Users with at least one note</td> \
                <td>"+totalUsersWithNotes+"</td> \
            </tr> \
            <tr> \
                <td>Users that have clicked a competency</td> \
                <td>"+totalUsersWithCompetencies+"</td> \
            </tr> \
            <tr> \
                <td>Users that have submitted a feedback request</td> \
                <td>"+totalUsersWithSubmittedFeedback+"</td> \
            </tr> \
            <tr> \
                <td>Users that have received feedback</td> \
                <td>"+totalUsersWithFeedback+"</td> \
            </tr> \
        </tbody> \
    </table> \
    "
    return html;
}

//------------------------------------------------- HR Employees ----------------------------------------------------------------

// function to add HR Employee accessed data to a list and append it on the HTML
function addHrEmployeeToList(employeeID, fullName, company, superSector, department){
    $("#employeeDetails").append(hrEmployeeList(employeeID, fullName, company, superSector, department));
}

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
    if ($('#hrFeedbackTable_wrapper').not("hidden")){
         $("#hrFeedbackTable_wrapper").addClass("hidden");
    }
}

//Function that returns the table headings
function hrEmployeeHeader(){
    var html = " \
        <table class='table table-striped hidden' id='hrEmployeeTable'> \
            <thead> \
                <tr> \
                   <th>Employee ID</th> \
                   <th>Employee Name</th> \
                   <th>Company</th> \
                   <th>Super Sector</th> \
                   <th>Department</th> \
                </tr> \
            </thead> \
            <tbody id='employeeDetails'> \
            </tbody> \
        </table> \
    "
    return html;
}

//Function that returns HR Employee accessed list in html format with the parameters given
function hrEmployeeList(employeeID, fullName, company, superSector, department){
    var html = " \
            <tr> \
                <td>"+employeeID+"</td> \
                <td>"+fullName+"</td> \
                <td>"+company+"</td> \
                <td>"+superSector+"</td> \
                <td>"+department+"</td> \
            </tr> \
    "
    return html;
}


//------------------------------------------------- HR Objectives ----------------------------------------------------------------

//function to add HR data overview to a list and append it on the HTML
function addHrObjectivesToList(employeeID, fullName, totalObjectives, proposedCount, setCount, completeCount, company, superSector, department){
    $("#objectiveDetails").append(hrObjectivesList(employeeID, fullName, totalObjectives, proposedCount, setCount, completeCount, company, superSector, department));
}

// function that shows the HR Overview list when clicked
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
    if ($('#hrFeedbackTable_wrapper').not("hidden")){
         $("#hrFeedbackTable_wrapper").addClass("hidden");
    }
}

//Function that returns the table headings
function hrObjectivesHeader(){
    var html = " \
        <table class='table table-striped hidden' id='hrObjectivesTable'> \
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
function hrObjectivesList(employeeID, fullName, totalObjectives, proposedCount, setCount, completeCount, company, superSector, department){
     var html = " \
            <tr> \
                <td>"+employeeID+"</td> \
                <td>"+fullName+"</td> \
                <td>"+totalObjectives+"</td> \
                <td>"+proposedCount+"</td> \
                <td>"+setCount+"</td> \
                <td>"+completeCount+"</td> \
                <td>"+company+"</td> \
                <td>"+superSector+"</td> \
                <td>"+department+"</td> \
            </tr> \
    "
    return html;
}

//------------------------------------------------- HR Development Needs ----------------------------------------------------------------

//function to add HR data overview to a list and append it on the HTML
function addHrDevelopmentNeedsToList(employeeID, fullName, totalDevNeeds, proposedCount, setCount, completeCount, company, superSector, department){
    $("#devNeedsDetails").append(hrDevelopmentNeedsList(employeeID, fullName, totalDevNeeds, proposedCount, setCount, completeCount, company, superSector, department));
}

// function that shows the HR Overview list when clicked
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
}

//Function that returns the table headings
function hrDevNeedsHeader(){
    var html = " \
        <table class='table table-striped hidden' id='hrDevNeedsTable'> \
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


//Function that returns HR development needs list in html format with the parameters given
function hrDevelopmentNeedsList(employeeID, fullName, totalDevNeeds, proposedCount, setCount, completeCount, company, superSector, department){
var html = " \
            <tr> \
                <td>"+employeeID+"</td> \
                <td>"+fullName+"</td> \
                <td>"+totalDevNeeds+"</td> \
                <td>"+proposedCount+"</td> \
                <td>"+setCount+"</td> \
                <td>"+completeCount+"</td> \
                <td>"+company+"</td> \
                <td>"+superSector+"</td> \
                <td>"+department+"</td> \
            </tr> \
    "
    return html;
}

//------------------------------------------------- HR Feedback ----------------------------------------------------------------

//function to add HR data feedback to a list and append it on the HTML
function addHrFeedbackToList(employeeID, fullName, totalFeedback, company, superSector, department){
    $("#feedbackDetails").append(hrFeedbackList(employeeID, fullName, totalFeedback, company, superSector, department));
}

// function that shows the HR Overview list when clicked
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
}

//Function that returns the table headings
function hrFeedbackHeader(){
    var html = " \
        <table class='table table-striped hidden' id='hrFeedbackTable'> \
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