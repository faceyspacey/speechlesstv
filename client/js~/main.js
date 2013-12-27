HomeController = RouteController.extend({
	layoutTemplate: 'main_layout',
  	template: 'home',
	after: function () {
		if(!Session.get('current_video')) { //this will insure it only runs once at the right time. 
			var video = Videos.findOne(this.params.video_id || {}) || Videos.findOne();
			Session.set('current_video', video);

			setBackNextButtons(0);
			console.log('setFirstVideo SUCCESSFULLY set');
		}
	}
});


Router.map(function () {
	this.route('home', {
    	path: '/',
		waitOn: function () {
			return Meteor.subscribe('allVideos', Session.get('limit'));
		},
		controller: HomeController
  	});

	this.route('video', {
    	path: '/video/:video_id',
		waitOn: function () {
			return Meteor.subscribe('allVideos', Session.get('limit'));
		},
		controller: HomeController
  	});

	this.route('videoAtTime', {
    	path: '/video/:video_id/:seconds',
		before: function() {
			window.secondsFromUrl = this.params.seconds;
		},
		waitOn: function () {
			return Meteor.subscribe('allVideos', Session.get('limit'));
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
	
	bindPlayerExtras();
});