HomeController = RouteController.extend({
	layoutTemplate: 'main_layout',
  	template: 'browse_video',
	waitOn: function() {
		return [Meteor.subscribe('allCategories')]
	},
	action: function () {
		if(Session.get('current_video')) Meteor.subscribe('video', Session.get('current_video')._id); //keep previous video playing while browsing
		updateCurrentVideo(this.params.video_id);
		this.render();
	}
});


Router.map(function () {
	this.route('home', {
    	path: '/',
		waitOn: function () {
			Session.set('current_channel_name', null);
			Session.set('current_category_name', 'all');
			return Meteor.subscribe('allVideos', Session.get('limit'));
		},
		controller: HomeController
  	});

	this.route('add_video', {
    	path: '/add-video',
		template: 'add_video',
		action: function() {	
			this.render();
		},
		after: function() {
			scrollToTop();
		},
		controller: HomeController
  	});

	this.route('update_video', {
    	path: '/update-video/:video_id',
		template: 'update_video',
		waitOn: function() {
			Session.set('category_added', false);	
			Session.set('description_added', false);
				
			return [Meteor.subscribe('video', this.params.video_id), Meteor.subscribe('allVideos', Session.get('limit'))];
		},
		controller: HomeController
  	});

	this.route('video', {
    	path: '/video/:video_id',
		waitOn: function () {
			return [Meteor.subscribe('video', this.params.video_id), Meteor.subscribe('allVideos', Session.get('limit'))];
		},
		controller: HomeController
  	});

	this.route('videoAtTime', {
    	path: '/video/:video_id/:seconds',
		before: function() {
			window.secondsFromUrl = this.params.seconds;
		},
		waitOn: function () {
			return [Meteor.subscribe('video', this.params.video_id), Meteor.subscribe('allVideos', Session.get('limit'))];
		},
		controller: HomeController
  	});

	this.route('category', {
    	path: '/category/:name',
		waitOn: function() { 
			Session.set('current_channel_name', null);
			Session.set('current_category_name', this.params.name);
			if(this.params.name == 'all') return Meteor.subscribe('allVideos', Session.get('limit'));
			else return Meteor.subscribe('allVideos', Session.get('limit'), null, this.params.name);
		},
		controller: HomeController
  	});

	this.route('channel', {
    	path: '/channel/:name',
		waitOn: function() { 
			Session.set('current_category_name', 'all');
			Session.set('current_channel_name', this.params.name); 
			return Meteor.subscribe('allVideos', Session.get('limit'), this.params.name, null);
		},
		after: function() {
			if(this.ready() && Videos.find().count() === 0) Router.go('add_video');
			if(this.ready()) $('html,body').animate({scrollTop: 930}, 1000, 'easeOutBounce');
		},
		controller: HomeController
  	});
});


Meteor.startup(function() {	
	Session.set('current_video', undefined); 
	Session.set('video_id_from_url', null);
	
	Session.set('current_category_name', 'all');
	Session.set('current_channel_name', null);
	
	Session.set('limit', 12);
	Session.set('limitIncrement', 12);
	
	Meteor.subscribe('allCategories');
	
	bindMiscInteractions();
});

updateHead = function(currentVideo) {
	if(!currentVideo) return;
	document.title = 'Speechless.TV - ' + currentVideo.title;
	$('meta[property="og:title"]').attr('content', 'Speechless.TV - ' + currentVideo.title);
	$('meta[property="og:url"]').attr('content', 'http://www.speechless.tv' + window.location.pathname);
	$('meta[property="og:image"]').attr('content', 'http://img.youtube.com/vi/' + currentVideo.youtube_id + '/mqdefault.jpg');
	$('meta[property="og:description"]').attr('content', currentVideo.description);
};

Deps.autorun(function() {
	var currentVideo = Session.get('current_video');
	updateHead(currentVideo);
});