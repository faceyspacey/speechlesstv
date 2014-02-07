Meteor.startup(function() {	
	Session.set('current_video', undefined); 
	Session.set('video_id_from_url', null);
	
	Session.set('current_category_name', 'all');
	Session.set('current_channel_name', null);
	
	Session.set('limit', 12);
	Session.set('limitIncrement', 12);
	
	Meteor.subscribe('allCategories');
	
	bindMiscInteractions();
	
	Resizeable.init();
});

updateHead = function(currentVideo) {
	if(!currentVideo) return;
	document.title = 'Speechless.TV - ' + currentVideo.title;
	$('meta[property="og:title"]').attr('content', 'Speechless.TV - ' + currentVideo.title);
	$('meta[property="og:url"]').attr('content', 'http://www.speechless.tv' + window.location.pathname);
	$('meta[property="og:image"]').attr('content', 'http://img.youtube.com/vi/' + currentVideo.youtube_id + '/mqdefault.jpg');
	$('meta[property="og:description"]').attr('content', currentVideo.description);
	$('meta[name="description"]').attr('content', currentVideo.description);
};

Deps.autorun(function() {
	var currentVideo = Session.get('current_video');
	updateHead(currentVideo);
});