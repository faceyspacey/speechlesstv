StateStack = [],
	routes = {
		'popular': {func: 'popularSide', id: '#popular_side'},
		'from-friends': {func: 'fromFriendsSide', id: '#from_friends_side'},
		'history': {func: 'historySide', id: '#history_side'},
		'friends': {func: 'showBuddyList', id: '#buddy_list'}
	};
	
Router.map(function () {

	this.route('home', {
    	path: '/',
		template: 'search',
		layoutTemplate: 'blank_layout',
		data: function() {
			Session.set('search_side', '#popular_side');
			history.pushState({side: 'popularSide'}, null, "/");
			StateStack.push({side: 'popularSide', id: '#popular_side', path: '/'});
		}
  	});


	this.route('other', {
    	path: '/:path',
		template: 'search',
		layoutTemplate: 'blank_layout',
		data: function() {
			var side = routes[this.params.path];
			
			if(side && this.params.path != 'friends') {
				Session.set('search_side', side.id);
				history.pushState({side: side.func}, null, this.params.path);
				StateStack.push({side: side.func, id: side.id, path: this.params.path});
			}
			else {
				Session.set('search_side', '#popular_side');
				history.pushState({side: 'popularSide'}, null, "/");
				StateStack.push({side: 'popularSide', id: '#popular_side', path: '/'});
			}
		}
  	});


	this.route('user', {
    	path: '/user/:id',
		template: 'search',
		layoutTemplate: 'blank_layout',
		data: function() {
			Session.set('search_side', '#user_profile_side');
			Session.set('current_user_profile_id', this.params.id);
			
			history.pushState({side: 'userProfileSide'}, null, this.params.path);
			StateStack.push({side: 'userProfileSide', id: '#user_profile_side', path: this.params.path});
		}
  	});
});

Meteor.startup(function() {
	if(Meteor.isClient) {
		for(var key in Session.keys) if(key.indexOf('player_ready') === 0) Session.set(key, null);
	}
});

