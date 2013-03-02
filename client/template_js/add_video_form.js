Template.add_video_form.events({
	'click #submit_button': function() {
		var title = $('#title_field').val();
		var youtube_id = $('#youtube_id_field').val();
		var channel = $('#channel_field').val();
		var length = $('#length_field').val();
		var category_id = $('#category_id_field').val();
		var description = $('#description_field').val();
		
		console.log('wtfhgfdhgfhg', title);
		
		Videos.insert({
			title:title,
			youtube_id:youtube_id,
			channel:channel,
			length:length,
			category_id:category_id,
			description:description,
		});
	},
	'click #cancel_add_video': function(event) {
              $('#add_video_form').hide(); 
              event.preventDefault(); //prevent the link from being followed, so the page doesnt refresh
     }
});