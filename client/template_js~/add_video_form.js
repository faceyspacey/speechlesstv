Template.add_video_form.events({
	'click #submit_button': function() {
		$('#add_video_form').animate({
			top: -500
		}, 300, 'easeInBack');
		
		var video_id = $('#video_id').val(),
		
			videoObject = {
				title: $('#title_field').val(),
				youtube_id: $('#youtube_id_field').val(),
			 	channel: $('#channel_field').val(),
				length: $('#length_field').val(),
				category_id: parseInt($('#category_id_field').val()),
				initial_comment: $('#initial_comment_field').val(),
				description: $('#description_field').val(),
				time: Date.now()
			};
				

		if(video_id.length > 0) { //if there is a video_id, it means we're updating an existing video
			Videos.update(video_id, {$set: videoObject});
		}
		else { //if there is no video_id, it means we're creating a new video
			videoObject.comments = [];
			Videos.insert(videoObject);
		}
	},
	'click #cancel_add_video': function(event) {
        $('#add_video_form').animate({
			top: -500
		}, 300, 'easeInBack'); 
            event.preventDefault(); //prevent the link from being followed, so the page doesnt refresh
     }
});