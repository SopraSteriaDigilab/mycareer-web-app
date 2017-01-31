$(function() {
    getHRdata();
    $("#hr-overview").one("click", function(){ showHrOverviewList() });

});


//function to get the HR stats of mycareer
function getHRdata(){
    $.ajax({
       url: 'http://'+getEnvironment()+':8080/getHRData',
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

// function to add HR data overview to a list and append it on the HTML
function addHrDataToList(totalAccounts, totalUsersWithObjectives, totalUsersWithDevelopmentNeeds, totalUsersWithNotes, totalUsersWithCompetencies, totalUsersWithSubmittedFeedback, totalUsersWithFeedback){
    $(".hr-dashboard").append(hrOverviewList(totalAccounts, totalUsersWithObjectives, totalUsersWithDevelopmentNeeds, totalUsersWithNotes, totalUsersWithCompetencies, totalUsersWithSubmittedFeedback, totalUsersWithFeedback));
}

// function that shows the HR Overview list when clicked
function showHrOverviewList(){
    if ($("#hrTable").hasClass("hidden")){
         $("#hrTable").removeClass("hidden");
    }
}

//Function that returns HR Overview list in html format with the parameters given
function hrOverviewList(totalAccounts, totalUsersWithObjectives, totalUsersWithDevelopmentNeeds, totalUsersWithNotes, totalUsersWithCompetencies, totalUsersWithSubmittedFeedback, totalUsersWithFeedback){
    var html = " \
    <br/> \
    <table class='table table-striped hidden' id='hrTable'> \
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