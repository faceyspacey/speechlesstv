Session.set('home_youtube_id', 'wsCpNnOGucE');

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


