Template.buddy_list.afterCreated = function() {
	vScroll('buddy_list_container');
};

Session.set('buddy_tab', 'left');
Session.set('search_friend_name', '');

Template.buddy_list_toolbar.helpers({
	selected: function(tab) {
		var selectedTab = Session.get('buddy_tab');
		
		if(tab == 'right' && selectedTab == 'right') return 'selected';
		else if(tab == 'left' && selectedTab == 'left') return 'selected';
		else return '';
	},
	liveUsersCount: function() {
		return LiveUsers.find().count();
	},
	currentYoutubeId: function() {
		if(!Meteor.user()) return;
		return Meteor.user().current_youtube_id;
	},
	isSuggest: function() {
		return Session.get('buddy_list_suggest');
	}
});

Template.buddy_list_toolbar.events({
	'click #buddy_list_toolbar .left': function() {
		Session.set('buddy_tab', 'left');
	},
	'click #buddy_list_toolbar .right': function() {
		Session.set('buddy_tab', 'right');
	},
	'keyup input': function(e) {
		var val = $(e.currentTarget).val();
		Session.set('search_friend_name', val);
	}
});


Template.buddy_list.helpers({
	watchingTabSelected: function() {
		return Session.get('buddy_tab') == 'right';
	},
	showSuggest: function() {
		return Session.get('buddy_list_suggest') ? 'block;' : 'none;';
	},
	showWatchingGroup: function() {
		return LiveUsers.find().count() > 0 && Session.get('in_live_mode') && Session.get('buddy_list_suggest');
	},
	onlineUsers: function() {
		if(!Meteor.user()) return;
		
		var users = Meteor.user().followedUsersOnline(),
			searchedName = Session.get('search_friend_name').toLowerCase();
		
		if(!Session.get('buddy_list_suggest')) return users;		
		else {
				users = users.fetch().concat(Meteor.user().watchingUsers().fetch());
				return _.reject(users, function(user) {
					return user.name.toLowerCase().indexOf(searchedName) == -1;
				});
			}
	},
	followedUsers: function() {
		if(!Meteor.user()) return;
		
		var users = Meteor.user().followedUsers(),
			searchedName = Session.get('search_friend_name').toLowerCase();
		
		if(!Session.get('buddy_list_suggest')) return users;		
		else return _.reject(users.fetch(), function(user) {
			return user.name.toLowerCase().indexOf(searchedName) == -1;
		});
	},
	followerUsers: function() {
		if(!Meteor.user()) return;
		
		var users = Meteor.user().followerUsers(),
			searchedName = Session.get('search_friend_name').toLowerCase();
		
		if(!Session.get('buddy_list_suggest')) return users;		
		else return _.reject(users.fetch(), function(user) {
			return user.name.toLowerCase().indexOf(searchedName) == -1;
		});
	},
	popularUsers: function() {
		if(!Meteor.user()) return;
		
		var users = Meteor.user().popularUsers(),
			searchedName = Session.get('search_friend_name').toLowerCase();
		
		if(!Session.get('buddy_list_suggest')) return users;		
		else return _.reject(users.fetch(), function(user) {
			return user.name.toLowerCase().indexOf(searchedName) == -1;
		});
	},
	watchingUsers: function() {
		if(!Meteor.user()) return;
				
		var users = Meteor.user().watchingUsers(),
			searchedName = Session.get('search_friend_name').toLowerCase();
	
		if(!Session.get('buddy_list_suggest')) return users;		
		else return _.reject(users.fetch(), function(user) {
			return user.name.toLowerCase().indexOf(searchedName) == -1;
		});
	},
	liveUsersCount: function() {
		if(!Meteor.user()) return '(0)';
		if(Session.get('search_friend_name').length > 0) return '';
		return '('+LiveUsers.find().count()+')';
	},
	onlineCount: function() {
		if(!Meteor.user()) return '(0)';
		if(Session.get('search_friend_name').length > 0) return '';
		return '('+Meteor.user().followedUsersOnline().count()+')';
	},
	followedCount: function() {
		if(!Meteor.user()) return '(0)';
		if(Session.get('search_friend_name').length > 0) return '';
		return '('+Meteor.user().followedCount()+')';
	},
	followerCount: function() {
		if(!Meteor.user()) return '(0)';
		if(Session.get('search_friend_name').length > 0) return '';
		return '('+Meteor.user().followerCount()+')';
	},
	watchingUsersCount: function() {
		if(!Meteor.user()) return 0;
		return Meteor.user().watchingUsersCount();
	}
});


Template.buddy_list.events({
	'mouseenter .submit_suggestion': function() {
		$('.follow_button').hide();
	},
	'click .submit_suggestion': function() {
		var users = Meteor.users.find().fetch();
		
		var suggestedUserIds = [];
		_.each(users, function(user) {
			var isSuggestedTo = Session.get('buddy_row_suggest_'+user._id); //hacky shit, i know; should use a new local-only model
			if(isSuggestedTo) {
				if(!_.contains(suggestedUserIds, user._id)) {
					Meteor.user().suggest(Session.get('current_suggested_youtube_id'), user._id);
					suggestedUserIds.push(user._id);
				}
			}
		});
		
		Cube.toggleBuddyList();
	}
});

Session.set('current_user_profile_id', Meteor.userId());

Template.online_buddy_row.helpers({
	showBulb: function() {
		if(this.status > Statuses.AWAY) return true;
		else return false;
	},
	bulbColor: function() {
		if(this.status == Statuses.IDLE) return 'orange';
		if(this.status == Statuses.ACTIVE) return 'green';
		if(this.status == Statuses.LIVE) return 'red';
	},
	randomNumber: function() {
		return Math.floor((Math.random()*10000)+1);
	},
	backgroundColor: function() {
		if(Session.get('buddy_row_suggest_'+this._id)) return 'background:black;';
		else return '';
	}
});

var followTimer;
Template.online_buddy_row.events({
	'mouseenter .profile_vid': function(e) {
		console.log('yo', e.currentTarget);
		$(e.currentTarget).parents('.profile_left').find('.profile_name').text(this.title);
	},
	'mouseleave .profile_vid': function(e) {
		var $profileName = $(e.currentTarget).parents('.profile_left').find('.profile_name'),
			userName = $profileName.attr('title');
		
		$profileName.text(userName);
	},
	'mouseenter .buddy_row': function(e) {
		setTimeout(function() { //hack; for some reason mouseenter .buddy_row happens before mouseleave .follow_button
			clearTimeout(followTimer);
		}, 50);
		
		var row = $(e.currentTarget);
			
		$('.follow_button').css({
			left: row.offset().left + row.width() - 6,
			top: row.offset().top
		}).show();
		
		Session.set('current_buddy_row_user_id', this._id);
		
		if(this.status == Statuses.LIVE) {
			var playerId = $(e.currentTarget).find('.profile_vid img').first().attr('id'),
				youtubeId = $(e.currentTarget).find('.profile_vid img').first().attr('title')
				secondsPlayedAlready = this.current_video_time; 

			YoutubePlayer.mini(playerId).setVideo(youtubeId, true).seek(secondsPlayedAlready);
		}
	},
	'mouseleave .buddy_row': function(e) {
		followTimer = setTimeout(function() {
			$('.follow_button').hide();
		}, 100);
		
		var playerId = $(e.currentTarget).find('object').attr('id'); 

		if(YoutubePlayer.get(playerId)) YoutubePlayer.get(playerId).destroy();
	},
	
	'click .profile_pic': function() {
		var userId = this._id,
			userName = this.name;
		
		Session.set('current_user_profile_id', userId);
		
		Cube.hideBuddyList(function() {
			Meteor.setTimeout(function() {
				Cube.userProfileSide(userId, function() {
					$('input.search_query').val(userName);
				});
			}, 100);
		});
	}
});


Template.watched_vid.helpers({
	isLive: function(userId) {
		var user = Meteor.users.findOne(userId),
			isLive = user.status == Statuses.LIVE,
			iteratedVid = this.youtube_id == userId.current_youtube_id;
			
		return (isLive && iteratedVid);
	}
});
$(function() {
	$('body').on('mouseenter', '.follow_button', function() {
		clearTimeout(followTimer);
		$(this).show();
	}).on('mouseleave', '.follow_button', function() {
		followTimer = setTimeout(function() {
			$('.follow_button').hide();
		}, 100);
	}).on('click', '.follow_button', function() {
		var userId = Session.get('current_buddy_row_user_id');
		
		
		if(Session.get('buddy_list_suggest')) {
			var isSuggested = Session.get('buddy_row_suggest_'+userId);
			if(isSuggested) Session.set('buddy_row_suggest_'+userId, false);
			else Session.set('buddy_row_suggest_'+userId, true);
		}
		else Meteor.user().followToggle(userId);
	});
});


Template.follow_button.helpers({
	followText: function() {
		if(!Meteor.user()) return 'follow';
		var userId = Session.get('current_buddy_row_user_id');
		
		if(Session.get('buddy_list_suggest')) {
			if(!Session.get('buddy_row_suggest_'+userId)) return 'suggest';
			else return 'nevermind';
		}
		else return Meteor.user().isFollowed(userId) ? 'unfollow' : 'follow';
		
		Session.get('buddy_list_suggest')
	}
});


