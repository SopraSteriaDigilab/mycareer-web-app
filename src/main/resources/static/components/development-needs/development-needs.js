$(function() {
	
	getDevelopmentNeedsList();
	
	
	
	
	
	
});

var categoryList = ['Training', 'Coaching', 'Other'];

//Gets the List of Objectives from the DB
function getDevelopmentNeedsList(){
  $.ajax({
      url: 'http://127.0.0.1:8080/getDevelopmentNeeds/2312',
      method: 'GET',
      success: function(data){
          $.each(data, function(key, val){
        	  nextDevID = val.id;
          	excpectedBy = formatDate(val.timeToCompleteBy);
          	categoryText = categoryList[val.category];
          	addDevelopmentNeedToList(val.id, val.title, val.description, categoryText, excpectedBy);
          });
      },
      error: function(XMLHttpRequest, textStatus, errorThrown){
          console.log('error', errorThrown);
          alert("Sorry, there was a problem getting development needs, please try again later.");
      }
  });	
}



//Function to add objective to list
function addDevelopmentNeedToList(id, title, description, category, expectedBy){
	$("#dev-needs-list").append(developmentNeedListHTML(id, title, description, category, expectedBy));
}



//Function that returns dev needs list in html format with the parameters given
function developmentNeedListHTML(id, title, description, category, timeToCompleteBy){
	var html = " \
    <div class='panel-group' id='accordion'> \
        <div class='panel panel-default' id='panel'> \
            <div class='panel-heading'> \
                <div class='row'> \
                    <div class='col-sm-6' id='obj-no-"+id+"'> # "+id+" </div> \
                    <div class='col-sm-6' id='obj-date-"+id+"'><h6><b>" + timeToCompleteBy + ' | ' + category + "</b></h6></div> \
                </div><br> \
                <div class='row'> \
                    <div class='col-sm-5' id='obj-title-"+id+"'><h5> "+title+" </h5></div> \
                        <div class='col-sm-5'><br> \
                            <div class='progress progress-striped'> \
                                <div class='one primary-color' style='cursor:pointer' id='awaiting-progress'><h5 class='progress-label'>Awaiting</h5></div> \
                                <div class='two primary-color' style='cursor:pointer' id='inflight-progress'><h5 class='progress-label'>InFlight</h5></div> \
                                <div class='three primary-color' style='cursor:pointer' id='done-progress'><h5 class='progress-label'>Done</h5></div> \
                                <div class='progress-bar' id='objStatus' role='progressbar' aria-valuemin='0' aria-valuemax='100'></div> \
                            </div> \
                        </div> \
                        <div class='col-sm-2'> \
                            <a data-toggle='collapse' href='#collapse-dev-"+id+"' class='collapsed'></a> \
                        </div> \
                </div> \
            </div> \
        \
            <div id='collapse-dev-"+id+"' class='panel-collapse collapse'> \
                <div class='panel-body'> \
                    <div class='row'> \
                        <div class='col-md-4'> \
                            <h5><b>Description</b></h5> \
                        </div> \
                        <div class='col-md-8'> \
                            <div class='row'> \
                                <div class='col-md-6'> \
                                    <div class='bottomless progress progress-striped'> \
                                        <div class='progress-bar progress-bar-success progress-middle' id='personal-progress-1' role='progressbar' aria-valuemin='0' aria-valuemax='100'></div> \
                                    </div> \
                                </div> \
                                <div class='col-md-6'> \
                                    <div class='bottomless progress progress-striped'> \
                                        <div class='progress-bar progress-bar-success progress-middle' id='feedback-progress-1' role='progressbar' aria-valuemin='0' aria-valuemax='100'></div> \
                                    </div> \
                                </div> \
                            </div> \
                        </div> \
                    </div> \
                    <div class='row'> \
                        <div class='col-md-12 wrap-text'> \
                            <pre><p id='obj-text-"+id+"'> "+description+" </p></pre> \
                        </div> \
                    </div><br> \
                    <div class='col-md-12'> \
                        <div class='col-sm-6'> \
                           \
                        </div> \
                        <div class='col-sm-6'> \
                            <button type='button' class='btn btn-block btn-default' onClick='openEditModalDevNeeds("+id+")'>Edit</button> \
                        </div> \
                    </div> \
                </div> \
            </div> \
        </div> \
    </div> \
    "
                            
    return html;
}