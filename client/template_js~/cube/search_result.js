Template.search_result.helpers({
	show: function() {
		return this.checked ? 'display:block; color: rgb(31, 65, 170); text-shadow: 1px 1px 1px white; opacity: .9;' : 'display:none;';
	}
});

Template.search_result.events({
	'click .search_result': function(e) {
		var $result = $(e.currentTarget);
		$result.removeClass('selected_result');
		$result.find('img.video_image').css('opacity', 1);
		
		$('#search_video_info').hide();
		$('#hover_player_container').css('opacity', 0);
		
		YoutubePlayer.get('hover_player').pause();
		
		YoutubeSearcher.related(this.youtube_id);
	},
	'mouseenter .search_result': function(e) {
		Session.set('current_search_video_id', this._id); //display video info box
		
		
		var $result = $(e.currentTarget),
			resultOffsetLeft = $result.offset().left,
			percentAcrossPage = resultOffsetLeft / SearchSizes.pageWidth(),
			containerOffsetLeft = $('#search_video_info').parent().offset().left,
			left;
			
		if(percentAcrossPage < .35) left = resultOffsetLeft + SearchSizes.columnAndMarginWidth();
		else left = resultOffsetLeft - (SearchSizes.columnAndMarginWidth() * 2);

		$('#search_video_info').css({
			left: left - containerOffsetLeft - 1, 
			top: $result.offset().top - SearchSizes.header - 1, 
			width: SearchSizes.videoInfoBoxWidth() + 2,
			height: $result.height() + 4
		}).show();
		
		
		YoutubePlayer.mini('hover_player').setVideo(this.youtube_id, true);
		
		$('#hover_player_container').css({
			left: resultOffsetLeft - containerOffsetLeft,
			top: $result.offset().top - SearchSizes.header + 1,
			opacity: 1
		});

		$result.find('img.video_image').css('opacity', 0);
		
		$result.addClass('selected_result');
	},
	'mouseleave .search_result': function(e) {
		var $result = $(e.currentTarget);
		$result.removeClass('selected_result');
		
		$('#search_video_info').hide();
		
		if(YoutubePlayer.get('hover_player').isPlaying()) YoutubePlayer.get('hover_player').pause();

		$('#hover_player_container').css('opacity', 0);
		$result.find('img.video_image').css('opacity', 1);
		
		$(e.currentTarget).find('.suggest_video').animate({left: 0}, 150, 'easeOutExpo');
	},
	'mouseenter .check_video': function(e) {
		var suggestButton = $(e.currentTarget).parent().find('.suggest_video');
		console.log('suggestButton', suggestButton.css('left'));
		if(suggestButton.css('left') != '23px') suggestButton.animate({left: '+=23'}, 150, 'easeOutExpo');
	},
	'click .check_video': function(e) {
		this.checked = this.checked ? null : true;
		this.store();
		e.stopPropagation();
	},
	'click .suggest_video': function(e) {
		Session.set('buddy_list_suggest', true);
		$('.cube').getCube().toggleBuddyList();
		e.stopPropagation();
	},
	'click .fast_forward': function(e) {
		e.stopPropagation();
		
		YoutubePlayer.get('hover_player').skip();
	},
	'click .search_fullscreen': function(e) {
		e.stopPropagation();
		
		$('#search_video_info').hide();
		YoutubePlayer.get('hover_player').pause();
				
		CubePlayer.start(this.youtube_id);
	}
});