//$(function() {
//	
//	getDevelopmentNeedsList();
//	
//	
//	
//	
//	
//	
//});

//Gets the List of Objectives from the DB
//function getDevelopmentNeedsList(){
//  $.ajax({
//      url: 'http://127.0.0.1:8080/getDevelopmentNeeds/2312',
//      method: 'GET',
//      success: function(data){
//          $.each(data, function(key, val){
//          	nextID = val.id;
//          	excpectedBy = formatDate(val.timeToCompleteBy);
////          	addDevelopmentNeedToList(val.id, val.title, val.description, excpectedBy);
//          });
//      },
//      error: function(XMLHttpRequest, textStatus, errorThrown){
//          console.log('error', errorThrown);
//          alert("Sorry, there was a problem getting objectives, please try again later.");
//      }
//  });	
//}