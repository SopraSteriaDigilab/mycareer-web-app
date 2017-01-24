$(function() {
	objectiveDashboard();
    
});

function objectiveDashboard(){
    $('#hr-dashboard').DataTable({
        ajax:
        
    });
}
//End points for 
"http://"+getEnvironment()+":8080/getTotalAccounts"
"http://"+getEnvironment()+":8080/getTotalAccountsWithObjectives"
"http://"+getEnvironment()+":8080/getTotalAccountsWithDevelopmentNeeds"