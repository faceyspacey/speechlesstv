Template.volume.events({
	'mouseenter .volume li': function(e) {
		YoutubePlayer.current.getComponent('volume').mouseenter(e.currentTarget);
	},
	'mousedown .volume li': function(e) {
		YoutubePlayer.current.getComponent('volume').mousedown(e.currentTarget);
	},
	'mouseleave .volume': function(e) {
		YoutubePlayer.current.getComponent('volume').mouseleave(e.currentTarget);
	}	
});