Template.remove_video_form.events({
	'click #submit_button': function() {
		$('#remove_video_form').hide();
		var title = $('#video_title').val();
		
		console.log('wtfhgfdhgfhg', title);
		
		var x = window.confirm("Nigga r u sure u want to delete '"+this.title+"'?");
		
		if(x) Videos.remove({title:title});
	},
	'click #cancel_remove_video': function(event) {
              $('#remove_video_form').hide(); 
              event.preventDefault(); //prevent the link from being followed, so the page doesnt refresh
     }
});