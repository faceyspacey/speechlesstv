Template.history_side.created = function() {
	Deps.afterFlush(function() {
		Resizeable.resizeAllElements();
	});
	Session.set('history_filter', 'WATCHED');
	
	Session.set('history_watches_limit', 8);
	Session.set('history_favorites_limit', 8);
	Session.set('history_comments_limit', 8);
	Session.set('history_suggestions_limit', 8);
	
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
		$('.cube').getCube().toggleBuddyList();
	},
	'click #history_back': function() {
		Cube.back();
	},
	'click .history_filter_tab': function(e) {
		Session.set('history_filter', $(e.currentTarget).text());
	},
	'click #history_spacer': function(e) {
		$(e.currentTarget).parents('.message_cube').cube().rotate({rotateX: '+=90'}, null, null, null, function() {
			
		});
	}
});


getHistorySideVideos = function() {
	if(Session.equals('history_filter', 'WATCHED')) return Watches.find({user_id: Meteor.userId()}, {sort: {created_at: -1}, limit: Session.get('history_watches_limit')});
	if(Session.equals('history_filter', 'STARRED')) return Favorites.find({user_id: Meteor.userId()}, {sort: {created_at: -1}, limit: Session.get('history_favorites_limit')});
	if(Session.equals('history_filter', 'COMMENTED')) return Comments.find({user_id: Meteor.userId()}, {sort: {created_at: -1}, limit: Session.get('history_comments_limit')});
	if(Session.equals('history_filter', 'SUGGESTED')) return Suggestions.find({user_id: Meteor.userId()}, {sort: {created_at: -1}, limit: Session.get('history_suggestions_limit')});
};

