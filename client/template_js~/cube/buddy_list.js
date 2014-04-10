Template.buddy_list.afterCreated = function() {
	vScroll('buddy_list_container');
};

Session.set('buddy_tab', 'left');
Template.buddy_list.helpers({
	selected: function(tab) {
		var selectedTab = Session.get('buddy_tab');
		
		if(tab == 'right' && selectedTab == 'right') return 'selected';
		else if(tab == 'left' && selectedTab == 'left') return 'selected';
		else return '';
	},
	watchingTabSelected: function() {
		return Session.get('buddy_tab') == 'right';
	},
	isSuggest: function() {
		return Session.get('buddy_list_suggest');
	},
	onlineUsers: function() {
		if(!Meteor.user()) return;
		return Meteor.user().followedUsersOnline();
	},
	followedUsers: function() {
		if(!Meteor.user()) return;
		return Meteor.user().followedUsers();
	},
	followerUsers: function() {
		if(!Meteor.user()) return;
		return Meteor.user().followerUsers();
	},
	popularUsers: function() {
		if(!Meteor.user()) return;
		return Meteor.user().popularUsers();
	},
	watchingUsers: function() {
		if(!Meteor.user()) return;
		return Meteor.user().watchingUsers();
	},
	followedCount: function() {
		if(!Meteor.user()) return 0;
		return Meteor.user().followedCount();
	},
	followerCount: function() {
		if(!Meteor.user()) return 0;
		return Meteor.user().followerCount();
	},
	watchingUsersCount: function() {
		if(!Meteor.user()) return 0;
		return Meteor.user().watchingUsersCount();
	}
});

Template.buddy_list.events({
	'click #buddy_list_toolbar .left': function() {
		Session.set('buddy_tab', 'left');
	},
	'click #buddy_list_toolbar .right': function() {
		Session.set('buddy_tab', 'right');
	}
});


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
		}, 300);
		
		var playerId = $(e.currentTarget).find('object').attr('id'); 

		if(YoutubePlayer.get(playerId)) YoutubePlayer.get(playerId).destroy();
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
		}, 300);
	}).on('click', '.follow_button', function() {
		var userId = Session.get('current_buddy_row_user_id');
		Meteor.user().followToggle(userId);
	});
});


