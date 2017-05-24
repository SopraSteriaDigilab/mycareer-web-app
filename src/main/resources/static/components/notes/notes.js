$(function() {
	//initialise jquery ui resizable component
	initResizable();
	
	getTags(getADLoginID());
	
	//Get general-notes and link ids
	getNotes(getADLoginID());
	
	$("#notes-open").click(function(e) { openNotesBar() });
	 
    $("#notes-close").click(function(e) { closeNotesBar() });
    
	//Validate note
	$('.note-validate').on('input', function() { validateForm('note-validate', 'submit-note'); });
	
	//Click listener to submit note
	$('#submit-note').click(function(){ clickSubmitNote(); });
	
	initNoteDatePicker("notes-start", new Date(new Date().setFullYear(new Date().getFullYear() - 1)), new Date() );
	initNoteDatePicker("notes-end", new Date(), new Date() );
	
	//Keep end date updated
	$("#notes-start-date").change(function (d){ updateNoteEndDate() });
	
	$("#submit-note-date-filter").click(function (){ applyNoteDateFilter() });
	
	//Click listener to filter note
	$('#filter-note').click(function(){ openNoteFilterModal(); });
	
	$("#submit-add-tags").click(function(){ clickSubmitTags() });
	$("#close-tag-button, #close-tag-button-x").click(function(){ clearTagsCheckboxes() });
	
	$("#objectives-tags-checkboxes").change(function(){ updateObjectivesTagsList(); });
	$("#development-needs-tags-checkboxes").change(function(){ updateDevelopmentNeedsTagsList(); });
	
	$("#notes-tag-dropdown").on('change', function(){ applyNotesTagFilter($(this).val()); });
	
	//Detect window resizing and reposition the Notes side bar if it is opened
	$(window).on('resize', function(){
		var sidebarWidth = $("#resizable").width();
		screenWidth = $(window).width();
		repositionNotesBar(sidebarWidth,screenWidth);
	});
});

var noteTypeList = ["general", "objectives", "competencies", "feedback", "development-needs", "team"];
var competencyList = ["Accountability", "Business Awareness", "Effective Communication", "Future Orientation", "Innovation and Change", "Leadership", "Service Excellence", "Teamwork"];
var noteDateFilterApplied = false;
var notesTagFilterApplied = false;
var noNotes = false;

function getNotes(userId){
	var success = function(data){
        $.each(data, function(key, val){
        	var date = moment(val.timestamp).format('DD MMM YYYY HH:mm');
        	var classDate = moment(val.timestamp).format('YYYY-MM-DD');
        	addNoteToList(val.id, val.providerName, val.noteDescription, date, classDate, val.taggedObjectiveIds, val.taggedDevelopmentNeedIds);
        });
        if(data.length === 0){
        	noNotes = true;
      	  	$("#general-notes-list").append("<h5 id='no-notes-text' class='text-center'>You have no Notes</h5>");	
        }
	}
	var error = function(error){}
	
	getNotesAction(userId, success, error);
}

function getTags(userId){
	var success = function(data){
    	var optionsHTML = "<option value='0'>No Filter</option>";
    	$.each(data, function(key, val){
    		optionsHTML += "<optgroup label='"+key+"' id='"+key+"-group'>";
        	$.each(val, function(id, title){
        		addToTagsLists(key, id, title);
        		optionsHTML += addToOptionsList(key, id, title);
            });
        	optionsHTML += "</optgroup>";
        	
        });
    	$(".tag-filter-dropdown").html(optionsHTML).selectpicker('refresh');
    }
	var error = function(error){}
	
	getTagsAction(userId, success, error);
}

function addNote(userId, providerName, noteDescription, date){
	var success = function(response){
		var id = response.noteID;
        if(noNotes){
        	noNotes = false;
        	$("#no-notes-text").remove();
        }
        clearAllNotesFilters();
        var dateFormatted = moment(date).format('DD MMM YYYY HH:mm'); 
        var classDate = moment(date).format('YYYY-MM-DD');
        addNoteToList(id, providerName, noteDescription, dateFormatted, classDate, emptyArray, emptyArray);
    }
	var error = function(error){}
	
	addNoteAction(userId, providerName, noteDescription, success, error);
}

function initResizable(){
	$( "#resizable" ).resizable({
		 minWidth: 300,
		 handles: "w"
	});
}


function updateNoteTags(id, objectiveTagIds, developmentNeedTagIds){
	var userId = getADLoginID();
	var noteId = id;
	var objectiveIds = objectiveTagIds.toString();
	var developmentNeedIds = developmentNeedTagIds.toString();
	
	var success = function(response){
        $("#note-tag-text-"+noteId).text(addTags(objectiveTagIds, developmentNeedTagIds, "note"));
        setNoteTagValues(noteId, objectiveTagIds, developmentNeedTagIds);
        $('#add-tag-modal').modal('hide');
        clearTagsCheckboxes();
    }
	var error = function(error){}
	
	updateNotesTagsAction(userId, noteId, objectiveIds, developmentNeedIds, success, error)
}
                                                                                                                                                                                                                                                                                                                                                                                                  
//Method to add note to list directly
function addNoteToList(id, providerName, body, date, classDate, objTagIds, devNeedTagIds){
	$("#general-notes-list").prepend(notesListHTML(id, providerName, body, date, classDate, objTagIds, devNeedTagIds));
}

//Method to return html
function notesListHTML(id, providerName, body, date, classDate, objTagIds, devNeedTagIds){
	var html = " \
		  <li class='list-group-item filterable-note' id='note-"+id+"'> \
			  <input type='hidden' class='note-date-filter' value='"+classDate+"'> \
			  <input type='hidden' id='note-obj-tags-"+id+"' class='notes-obj-tag' value='"+objTagIds+"'> \
			  <input type='hidden' id='note-dev-need-tags-"+id+"' class='notes-dev-need-tag' value='"+devNeedTagIds+"'> \
	  		  <input type='hidden' class='notes-tag-filter notes-tag-filter-"+id+"' value='"+formatTagFilterValues(objTagIds, devNeedTagIds)+"'> \
  		  		<div class='row'> \
					<div class='col-md-6 wrap-text'><h6><b>" + providerName + "</b></h6></div> \
					<div class='col-md-6'><h6 class='pull-right'><b>" + date + "</b></h6></div> \
				</div> \
				<div class='row'> \
					<div class='col-md-12 wrap-text'><p>" + body + "</p></div> \
	            </div> \
			<div class='row'> \
				<div class='col-md-10'><h6 class='wrap-text'>Tags: <span id=note-tag-text-"+id+">"+addTags(objTagIds, devNeedTagIds, "note")+"</span></h6></div> \
    			<div class='col-md-2'><h6 class='pull-right btn-link' style='cursor:pointer' onclick='openAddTagModalNotes("+id+")'><b>Tags</b></h6></div> \
    		</div> \
		  </li> \
	  ";
	return html;
}

//Method to get data and submit data
function clickSubmitNote(){
	var userID = getADLoginID();
	var note = $('#note-text').val().trim();
	var from = getADfullName();
	var date = new Date();
	
	addNote(userID, from, note, date);
    
	$('#note-text').val('');
	$('#submit-note').prop("disabled", true);
}

function showSection(section){
	$(".notes-div").each(function(i){
		$(this).fadeOut(1);
		if($(this).hasClass(section)){
			$(this).fadeIn(600);
		}
	});
}

function initNoteDatePicker(id, start, end){
    $("#"+id+"-date-picker").datepicker({
	   useCurrent: true,
       forceParse: false,
       disabled: true,
       format: "dd-mm-yyyy",
       startDate: start,
       endDate: end,
       orientation: 'bottom',
       autoclose: true,
    });	
    $("#notes-start-date, #notes-end-date").val(timeStampToClassDate(new Date()));
}

function updateNoteEndDate(){
	var startDate = formatNoteDate($("#notes-start-date").val());
	var endDate = formatNoteDate($("#notes-end-date").val());
	
	if(startDate > endDate){
		$("#notes-end-date").val(moment(startDate).format('DD-MM-YYYY'));
	}
	$("#notes-end-date-picker").datepicker('setStartDate', startDate);
}

//Function to open filter modal
function openNoteFilterModal(){
	$('#filter-modal').modal({keyboard: false, show: true});
}

//From dd-mm-yyyy to timestamp
function formatNoteDate(date){
	var day = date.slice(0,2);
	var month = date.slice(3,5);
	var year = date.slice(6,10);
	var a =  new Date(year + '-' + month + '-' + day);
	return new Date(year + '-' + month + '-' + day);
}

//moment(date).format('YYYY-MM-DD')

function applyNoteDateFilter(){
	var dateRangeList = [];
	var startDate = formatNoteDate($("#notes-start-date").val());
	var endDate = formatNoteDate($("#notes-end-date").val());
	
	for(var date = startDate; date <= endDate; date = date.addDays(1)){
		dateRangeList.push(moment(date).format('YYYY-MM-DD'));
	}
	
	$(".note-date-filter").each(function(index){
		var date = $(this).val()

		if(jQuery.inArray(date, dateRangeList) > -1){
			$(this).closest('li').removeClass("filteredOutByDate");
		}else{
			$(this).closest('li').addClass("filteredOutByDate");
		}
	});
	noteDateFilterApplied = true;
	updateNoteFilterView();
}

function applyNotesTagFilter(filter){
	if(filter == 0){
		clearNotesTagFilter();
	}else{
		$(".notes-tag-filter").each(function(){
			var tags = $(this).val().split(' ');
			if(tags.indexOf(filter) > -1){
				$(this).closest('li').removeClass("filteredOutByNotesTags");
			}else{
				$(this).closest('li').addClass("filteredOutByNotesTags");
			}	
		});
		notesTagFilterApplied = true;
	}
	updateNoteFilterView();
}

function clearNotesDateFilter(){
	$("#notes-start-date, #notes-end-date").val(timeStampToClassDate(new Date()));
	updateNoteEndDate();
	$(".filterable-note").each(function(index){
		$(this).removeClass("filteredOutByDate");
	});
	noteDateFilterApplied = false;
	updateNoteFilterView();
}

function clearNotesTagFilter(){
	$(".notes-tag-filter").each(function(){
		$(this).closest('li').removeClass("filteredOutByNotesTags");
	});
	$(".tag-filter-dropdown").selectpicker('val', 0);
	notesTagFilterApplied = false;
	updateNoteFilterView();
}

function clearAllNotesFilters(filter){
	clearNotesDateFilter();
	clearNotesTagFilter();
}

function updateNoteFilterView(){
	$(".filterable-note").each(function(index){
		var note = $(this);
		if(note.hasClass("filteredOutByDate") || note.hasClass("filteredOutByNotesTags")){
			note.hide();
		}else{
			note.show();
		}
	});
	
	var filterText = "";
	if(!notesTagFilterApplied && !noteDateFilterApplied){
		filterText = "No Filters Applied";
	}else{
		if(noteDateFilterApplied)
			filterText += "Date: "+$("#notes-start-date").val()+" to "+$("#notes-end-date").val()+".";
		if(notesTagFilterApplied)
			filterText += " Tags.";
	}
	$(".notes-filter-text").text(filterText);
}


function openAddTagModalNotes(id){
	var objTags = $("#note-obj-tags-"+id).val();
	var devNeedTags = $("#note-dev-need-tags-"+id).val();
	updateTagCheckboxes(objTags, devNeedTags);
	$("#tag-type").val("note");
	openAddTagModal(id);
}

function setNoteTagValues(id, objTags, devNeedTags){
	$("#note-obj-tags-"+id).val(objTags);
	$("#note-dev-need-tags-"+id).val(devNeedTags);
	$(".notes-tag-filter-"+id).val(formatTagFilterValues(objTags, devNeedTags));
}
