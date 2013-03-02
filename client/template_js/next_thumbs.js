Meteor.startup(function(){
	var currentIndex = 0;
	var totalVideos = 4;
	
	$('#leftThumb').bind('click', function() {
		
	   currentIndex++;
	   var actualIndex = currentIndex % totalVideos;
	   var youtubeID = $('#thumb_grid').eq(actualIndex).attr('youtube_id');
	   Session.set('youtubeID', youtubeID);
	});
	
});

