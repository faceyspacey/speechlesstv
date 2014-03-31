Template.buddy_list.afterCreated = function() {
	vScroll('buddy_list');
};

Template.buddy_list.helpers({
	isSuggest: function() {
		return Session.get('buddy_list_suggest');
	},
	onlineUsers: function() {
		return Meteor.users.find();
	}
});


Template.online_buddy_row.helpers({
	showBulb: function() {
		if(this.status > 1) return true;
		else return false;
	},
	bulbColor: function() {
		if(this.status == 2) return 'orange';
		if(this.status == 3) return 'green';
		if(this.status == 4) return 'red';
	}
});

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
		var playerId = $(e.currentTarget).find('.profile_vid img').first().attr('id'),
			youtubeId = playerId; 

		YoutubePlayer.mini(playerId).setVideo(youtubeId, true);
	},
	'mouseleave .buddy_row': function(e) {
		var playerId = $(e.currentTarget).find('object').attr('id'),
			youtubeId = playerId; 

		if(YoutubePlayer.get(playerId)) YoutubePlayer.get(playerId).destroy();
	}
});