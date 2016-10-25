$(function() {

	$("#objectives").click(function() {
			highlight('objectives');
	});

	$("#feedback").click(function() {
		highlight('feedback');
	});
	
	$("#development-needs").click(function() {
		highlight('development-needs');
	});


});


function highlight(value) {
	$('.nav-bar-item').each(function(i) {
		var sectionValue = this.id + "-section";
		if(value === this.id) {

			$("#"+this.id).addClass("selected");
			$("#"+sectionValue).show();

		}else{
			$("#"+this.id).removeClass("selected");
			$("#"+sectionValue).hide();
		}
		
	});

}

