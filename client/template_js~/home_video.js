Session.set('home_youtube_id', '4w41ESyvHxg');

Template.home_video.category = function() {
	if(Session.get('current_video')) {
		var categoryId = Session.get('current_video').category_id;

		for(var name in categories) {
			if(categories[name] == categoryId) return name;
		}
	}	
}

Template.home_video.current_video = function() {	
	return Session.get('current_video');
}

Template.home_video.events({
	'click h1#home_video_channel': function(e) {
		Session.set('current_category_id', 0);
		Session.set('current_channel', Session.get('current_video').channel);
		$('html,body').animate({scrollTop: $('#thumb_grid').offset().top - 150}, 400, 'easeOutExpo');
	}
});

Template.home_video.useCustomPlayer = function() {
	return true;
}
