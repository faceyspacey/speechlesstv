Template.add_video_row.rendered = function() {
	Session.set('category_id_'+this.data.youtube_id, $('select', this.firstNode).val());
};

Template.add_video_row.helpers({
	categories: function() {
		return Categories.find({name: {$not: 'all'}});
	},
	categorySelected: function(categoryId) {
		return this.category_id == categoryId ? 'selected="selected"' : '';
	},
	timeFormatted: function() {
		var playerId = Session.get('current_player_id'),
			time = Session.get('player_time_'+playerId);

		return YoutubePlayer.get(playerId) ? YoutubePlayer.get(playerId).timeFormatted() : '00:00';
	}
});

Template.add_video_row.events({
	'change select.add_video_row_dropdown': function(e) {
		Session.set('category_id_'+this.youtube_id, $(e.currentTarget).val());
	},
	'click .search_fullscreen': function(e) {
		e.stopPropagation();
		
		CubePlayer.start(this.youtube_id);
	},
	'click .fast_forward': function(e) {
		YoutubePlayer.current.skip();
		e.stopPropagation();
	},
	'mouseenter .add_video_row': function(e) {
		var playerId = $(e.currentTarget).find('.add_video_row_image').attr('id'),
			youtubeId = playerId; 

		YoutubePlayer.mini(playerId).setVideo(youtubeId, true);
	},
	'mouseleave .add_video_row': function(e) {
		var playerId = $(e.currentTarget).find('object').attr('id'),
			youtubeId = playerId; 

		if(YoutubePlayer.get(playerId)) YoutubePlayer.get(playerId).destroy();
	}
});