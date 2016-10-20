$(function() {

	$("#obj").click(function() {
			highlight('obj');
	});

	$("#fee").click(function() {
		highlight('fee');
	});

});


function highlight(value) {

	if(value == 'obj'){
		$("#obj").addClass("selected");
		$("#fee").removeClass("selected");
		$("#objectives").show();
		$("#feedback").hide();
	}else{
		$("#fee").addClass("selected");
		$("#obj").removeClass("selected");
		$("#feedback").show();
		$("#objectives").hide();
	}

}

