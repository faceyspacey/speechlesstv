Template.home_video.category = function() {
	if(Session.get('current_video')) {
		var categoryId = Session.get('current_video').category_id;

		for(var name in categories) {
			if(categories[name] == categoryId) return name;
		}
	}	
}

Template.home_video.user_pic = function() {
	var facebookId = '16404762'; //Session.get('current_video').user_facebook_id;
	return 'https://graph.facebook.com/'+facebookId+'/picture?width=75&height=75'
};

Template.home_video.current_video = function() {	
	return Session.get('current_video');
}

Template.home_video.events({
	'click h1#home_video_channel': function(e) {
		Router.go('channel', {name: Session.get('current_video').channel});
	}
});

Template.home_video.useCustomPlayer = function() {
	return true;
}
