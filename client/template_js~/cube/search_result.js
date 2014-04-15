Template.search_result.helpers({
	showStar: function() {
		return this.favorite ? 'display:block; color: rgb(31, 65, 170); text-shadow: 1px 1px 1px white; opacity: .9;' : 'display:none;';
	},
	isLive: function() {
		return LiveVideos.findOne({youtube_id: this.youtube_id});
	}
});

Template.search_result.events({
	'click .search_result': function(e) {
		var $result = $(e.currentTarget);
		$result.removeClass('selected_result');
		$result.find('img.video_image').css('opacity', 1);
		
		$('.search_video_info').hide();
		$('.hover_player_container').css('opacity', 0);
		
		YoutubePlayer.get(currentHoverPlayer()).pause();
		
		YoutubeSearcher.related(this.youtube_id, this.title);
	},
	'mouseenter .search_result': function(e) {
		Session.set('current_search_video_id', this._id); //display video info box
		
		
		var $result = $(e.currentTarget),
			resultOffsetLeft = $result.offset().left,
			percentAcrossPage = resultOffsetLeft / SearchSizes.pageWidth(),
			containerOffsetLeft = $currentSide().find('.search_video_info').parent().offset().left,
			left;
			
		if(percentAcrossPage < .35) left = resultOffsetLeft + SearchSizes.columnAndMarginWidth();
		else left = resultOffsetLeft - (SearchSizes.columnAndMarginWidth() * 2);

		$('.search_video_info').css({
			left: left - containerOffsetLeft - 1, 
			top: $result.offset().top - SearchSizes.header - 1, 
			width: SearchSizes.videoInfoBoxWidth() + 2,
			height: $result.height() + 4
		}).show();
		
		if(percentAcrossPage < .35) {
			Session.set('duration_position', 'left: 4px;');
			Session.set('stats_position', 'right: 4px;');
			$('.search_video_stats').css('text-align', 'right');
		}
		else {
			Session.set('duration_position', 'right: 4px;');
			Session.set('stats_position', 'left: 4px;');
			$('.search_video_stats').css('text-align', 'left');
		}
		
		setupVideoInfoStats();
		
		YoutubePlayer.mini(currentHoverPlayer()).setVideo(this.youtube_id, true);
		
		$('.hover_player_container').css({
			left: resultOffsetLeft - containerOffsetLeft,
			top: $result.offset().top - SearchSizes.header + 1,
			opacity: 1
		});

		$result.find('img.video_image').css('opacity', 0);
		
		$result.addClass('selected_result');
		$result.css('background', 'none');
	},
	'mouseleave .search_result': function(e) {
		var $result = $(e.currentTarget);
		$result.css('background', 'rgb(42, 103, 160)');
		$result.removeClass('selected_result');
		
		$('.search_video_info').hide();
		
		if(YoutubePlayer.get(currentHoverPlayer()).isPlaying()) YoutubePlayer.get(currentHoverPlayer()).pause();

		$('.hover_player_container').css('opacity', 0);
		$result.find('img.video_image').css('opacity', 1);
		
		$(e.currentTarget).find('.suggest_video').animate({left: 0}, 150, 'easeOutExpo');
	},
	'mouseenter .check_video': function(e) {
		var suggestButton = $(e.currentTarget).parent().find('.suggest_video');
		console.log('suggestButton', suggestButton.css('left'));
		if(suggestButton.css('left') != '23px') suggestButton.animate({left: '+=23'}, 150, 'easeOutExpo');
	},
	'click .check_video': function(e) {
		Meteor.user().favorite(this);
		e.stopPropagation();
	},
	'click .suggest_video': function(e) {
		Session.set('buddy_list_suggest', true);
		Session.set('buddy_tab', 'left');
		
		Session.set('current_suggested_youtube_id', this.youtube_id);
		
		setTimeout(function() {
			$('.suggest_search').focus();
		}, 1000);
		
		Cube.toggleBuddyList();
		e.stopPropagation();
	},
	'click .fast_forward': function(e) {
		e.stopPropagation();
		
		YoutubePlayer.get(currentHoverPlayer()).skip();
	},
	'click .search_fullscreen': function(e) {
		e.stopPropagation();
		
		$('.search_video_info').hide();
		YoutubePlayer.get(currentHoverPlayer()).pause();
					
		CubePlayer.start(this.youtube_id);
	}
});