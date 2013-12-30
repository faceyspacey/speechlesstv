Template.video_info.events({
	'click h1#home_video_channel': function(e) {
		Router.go('channel', {name: Session.get('current_video').channel});
	}
});




Template.title_box.rendered = function() {
	setTimeout(function() {
		$('.title_box').animate({
			marginLeft: 0,
			opacity: 1
		}, 400, 'easeOutBack');
	}, 200);
}