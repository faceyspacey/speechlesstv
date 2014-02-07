HomeController = FastRender.RouteController.extend({
	layoutTemplate: 'main_layout',
  	template: 'browse_video',
	action: function () {
		if(Session.get('current_video')) Meteor.subscribe('video', Session.get('current_video')._id); //keep previous video playing while browsing
		updateCurrentVideo(this.params.video_id);
		this.render();
	}
});


BlankController = FastRender.RouteController.extend({
	layoutTemplate: 'blank_layout',
  	template: 'browse_video'
});

Router.map(function () {
	this.route('home', {
    	path: '/',
		waitOn: function () {
			if(Meteor.isClient) Session.set('current_channel_name', null);
			if(Meteor.isClient) Session.set('current_category_name', 'all');
			var limit = Meteor.isClient ? Session.get('limit') : 12;
			
			return [
				Meteor.subscribe('allVideos', limit), 
				Meteor.subscribe('allCategories')
			];
		},
		fastRender: true,
		controller: HomeController
  	});

	this.route('search', {
    	path: '/search',
		template: 'search',
		action: function() {	
			this.render();
		},
		fastRender: true,
		controller: BlankController
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
		fastRender: true,
		controller: HomeController
  	});

	this.route('update_video', {
    	path: '/update-video/:video_id',
		template: 'update_video',
		waitOn: function() {
			if(Meteor.isClient) Session.set('category_added', false);	
			if(Meteor.isClient) Session.set('description_added', false);
			var limit = Meteor.isClient ? Session.get('limit') : 12;
			
			return [
				Meteor.subscribe('video', this.params.video_id), 
				Meteor.subscribe('allVideos', limit), 
				Meteor.subscribe('allCategories')
			];
		},
		fastRender: true,
		controller: HomeController
  	});

	this.route('video', {
    	path: '/video/:video_id',
		waitOn: function () {
			var limit = Meteor.isClient ? Session.get('limit') : 12;
			
			return [
				Meteor.subscribe('video', this.params.video_id), 
				Meteor.subscribe('allVideos', limit),
				Meteor.subscribe('allCategories')
			];
		},
		fastRender: true,
		controller: HomeController
  	});

	this.route('videoAtTime', {
    	path: '/video/:video_id/:seconds',
		before: function() {
			window.secondsFromUrl = this.params.seconds;
		},
		waitOn: function () {
			var limit = Meteor.isClient ? Session.get('limit') : 12;
			
			return [
				Meteor.subscribe('video', this.params.video_id), 
				Meteor.subscribe('allVideos', limit),
				Meteor.subscribe('allCategories')
			];
		},
		fastRender: true,
		controller: HomeController
  	});

	this.route('category', {
    	path: '/category/:name',
		waitOn: function() { 
			if(Meteor.isClient) Session.set('current_channel_name', null);
			if(Meteor.isClient) Session.set('current_category_name', this.params.name);
			var limit = Meteor.isClient ? Session.get('limit') : 12;
			
			if(this.params.name == 'all') return [
				Meteor.subscribe('allVideos', limit), 
				Meteor.subscribe('allCategories')
			];
			else return [
				Meteor.subscribe('allVideos', limit, null, this.params.name), 
				Meteor.subscribe('allCategories')
			];
		},
		fastRender: true,
		controller: HomeController
  	});

	this.route('channel', {
    	path: '/channel/:name',
		waitOn: function() { 
			if(Meteor.isClient) Session.set('current_category_name', 'all');
			if(Meteor.isClient) Session.set('current_channel_name', this.params.name); 
			var limit = Meteor.isClient ? Session.get('limit') : 12;
			
			return [
				Meteor.subscribe('allVideos', limit, this.params.name, null),
				Meteor.subscribe('allCategories')
			];
		},
		after: function() {
			if(this.ready() && Videos.find().count() === 0) Router.go('add_video');
			if(this.ready()) $('html,body').animate({scrollTop: 930}, 1000, 'easeOutBounce');
		},
		fastRender: true,
		controller: HomeController
  	});
});