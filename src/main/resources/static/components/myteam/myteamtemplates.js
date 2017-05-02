function activityFeedItem(description, timestamp){
	var HTML = " \
		<div class='row'> \
			<div class='col-md-12'> \
				<h6 style='margin-top:0px; margin-bottom:0px; padding-right: 5px;'>"+description+"</h6> \
			</div> \
			<div class='col-md-12'> \
				<h6 style='margin-top:5px; padding-right: 5px;'><b>"+timestamp+"</b></h6> \
			</div> \
		</div>";
	return HTML;
}