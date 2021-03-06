Template.history_side.created = function() {
	Session.set('history_filter', 'WATCHED');
	
	Session.set('history_watches_limit', 30);
	Session.set('history_favorites_limit', 30);
	Session.set('history_comments_limit', 30);
	Session.set('history_suggestions_limit', 30);
	
};

Template.history_side.helpers({
	videos: function() {
		var videos = getHistorySideVideos().fetch(),
			seenVideos = [];
		return _.reject(videos, function(video) {
			if(_.contains(seenVideos, video.youtube_id)) return true;
			else {seenVideos.push(video.youtube_id);
				return false;
			}
		})
	},
	tabSelected: function(tabName) {
		return Session.equals('history_filter', tabName) ? 'selected' : '';
	}
});

Template.history_side.events({
	'click .buddy_list_button': function() {
		Cube.toggleBuddyList();
	},
	'click #history_back': function() {
		Cube.back();
	},
	'click .history_filter_tab': function(e) {
		Session.set('history_filter', $(e.currentTarget).text());
	}
});


getHistorySideVideos = function() {
	if(Session.equals('history_filter', 'WATCHED')) return Watches.find({user_id: Meteor.userId()}, {sort: {created_at: -1}, limit: Session.get('history_watches_limit')});
	if(Session.equals('history_filter', 'STARRED')) return Favorites.find({user_id: Meteor.userId()}, {sort: {created_at: -1}, limit: Session.get('history_favorites_limit')});
	if(Session.equals('history_filter', 'COMMENTED')) return Comments.find({user_id: Meteor.userId()}, {sort: {created_at: -1}, limit: Session.get('history_comments_limit')});
	if(Session.equals('history_filter', 'SUGGESTED')) return Suggestions.find({$or: [{sender_user_id: Meteor.userId()}, {recipient_user_id: Meteor.userId()}]}, {sort: {created_at: -1}, limit: Session.get('history_suggestions_limit')});
};

