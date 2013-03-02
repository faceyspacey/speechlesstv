Template.footer.events({
	'click #add_video': function() {
		$('#add_video_form').show();
		console.log('wtf');
		$('html,body').animate({scrollTop: 0}, 750, 'easeOutBounce');
	},
	'click #remove_video': function() {
		$('#remove_video_form').show();
		console.log('wtf');
		$('html,body').animate({scrollTop: 0}, 750, 'easeOutBounce');
	},
});