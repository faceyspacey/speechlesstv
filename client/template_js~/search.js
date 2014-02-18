/** SEARCH **/

Template.search.created = function() {
	Session.set('search_side', '#search_results_side');
	
	Deps.afterFlush(function() {
		Resizeable.resizeAllElements();
		$('.cube').cube().prevSide('#search_results_side');
		
		$('#search_bar input').focus();
	});
};


/** ADD_VIDEOS **/

Template.add_videos.created = function() {
	Deps.afterFlush(function() {
		Resizeable.resizeAllElements();
	});
};

Template.add_videos.helpers({
	videos: function() {
		return Videos.find({_local: true, checked: true});
	}
});

Template.add_videos.events({
	'click #add_videos_back': function() {
		Session.set('search_side', '#search_results_side');
		
		$('.cube').cube().prevSideHorizontal('#dummy_side', 1000, 'easeInBack', function() {
			$('.cube').cube().prevSideHorizontal('#search_results_side', 1000, 'easeOutBack');
		});
	},
	'click #add_videos_clear': function() {
		Videos._collection.update({_local: true}, {$set: {description: ''}}, {multi: true});
	},
	'click #add_videos_next': function() {
		Session.set('search_side', '#search_results_side');
		
		
		$('.cube').cube().nextSide('#dummy_side', null, null, function() {
			Videos.find({_local: true, checked: undefined}).forEach(function(video) {
				video.delete();
			});
			
			var first = false;
			Videos.find({_local: true, checked: true}).forEach(function(video) {
				video.user_id = Meteor.userId();
				video.user_facebook_id = Meteor.user().profile.facebook_id;
				video.channel = Meteor.user().profile.username;
				video.comments = [];
				video.category_id = parseInt(Session.get('category_id_'+video.youtube_id));
				video.complete = true;	

				video.persist();
				
				if(!first) {
					video._findBestPhotoMax();
					first = true;
				}
			});
			
			$('#dummy_side').animate({opacity: 0}, 500, 'easeOutExpo');
			Meteor.setTimeout(function() {
				Router.go('home');
			}, 300);
		});
	}
});


/** ADD_VIDEO_ROW **/

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


/** SEARCH_FIELD **/

Template.search_bar.helpers({
	checkallChecked: function() {
		var checkedCount = Videos.find({_local: true, checked: null}).count();
		
		return Session.get('search_check_all') && checkedCount === 0 ? 'checked' : '';
	},
	uncheckallChecked: function() {
		var checkedCount = Videos.find({_local: true, checked: true}).count();
		
		return Session.get('search_uncheck_all') && checkedCount === 0 ? 'checked' : '';
	},
	categories: function() {
		return Categories.find({name: {$not: 'all'}});
	},
	categoryName: function() {
		if(Session.equals('mouse_over_category_dropdown', true)) return 'Select a Category';
		
		var catId = Session.get('selected_search_category_id');
		return catId ? Categories.findOne({category_id: catId}).name : 'Select a Category';
	}
});

Template.search_bar.events({
	'keyup #search_bar input': function(e) {
		console.log('keyup');
		
		if(e.keyCode == 13) {
			var value = $('#search_bar input').val();			
			YoutubeSearcher.query(value);
		}
	},
	'click #search_check_all': function() {
		Session.set('search_check_all', true);
		Session.set('search_uncheck_all', false);
		Videos._collection.update({_local: true}, {$set: {checked: true}}, {multi: true});
	},
	'click #search_uncheck_all': function() {
		Session.set('search_check_all', false);
		Session.set('search_uncheck_all', true);
		Videos._collection.update({_local: true}, {$set: {checked: null}}, {multi: true});
	},
	'mouseenter #search_category_dropdown': function(e) {
		Session.set('mouse_over_category_dropdown', true);
		$('#search_category_options').show();
		$('.search_category_option').slideDownCollection(400, 'easeOutBack', 50);
	},
	'mouseleave #search_category_dropdown': function(e) {
		Session.set('mouse_over_category_dropdown', false);
		$('.search_category_option').slideUpCollection(300, 'easeInBack', 50, function() {
			if(Session.equals('mouse_over_category_dropdown', false)) $('#search_category_options').hide();
		});
	},
	'click .search_category_option': function() {
		Session.set('selected_search_category_id', this.category_id);
		Session.set('mouse_over_category_dropdown', false);
		
		$('.search_category_option').slideUpCollection(300, 'easeInBack', 50, function() {
			if(Session.equals('mouse_over_category_dropdown', false)) $('#search_category_options').hide();
		});
	},
	'click #search_next_button': function() {	
		Session.set('search_side', '#add_videos_side');
		
		var categoryId = Session.get('selected_search_category_id');
		Videos._collection.update({_local: true}, {$set: {category_id: categoryId}}, {multi: true});
		
		
		$('.cube').cube().nextSideHorizontal('#dummy_side', 1000, 'easeInBack', function() {
			$('.cube').cube().nextSideHorizontal('#add_videos_side', 1000, 'easeOutBack', function() {
				vScroll('add_videos_wrapper');
			});
		});
	}
});

Session.set('mouse_over_category_dropdown', false);


/** BACK_NEXT_BUTTONS **/

Template.back_next_buttons.helpers({
	showBack: function() {
		return Session.get('left_column_count') > 0 ? 'block' : 'none';
	},
	showNext: function() {
		return Session.get('right_column_count') > 0 ? 'block' : 'none';
	}
});

Template.back_next_buttons.events({
	'click #search_results_back': function() {
		BackNext.back();
	},
	'click #search_results_next': function() {
		BackNext.next();
	}
});

/** SEARCH_HELP_GRAPHIC **/

Template.search_help_graphic.helpers({
	show: function() {
		return Videos.find({_local: true}).count() === 0;
	}
});

/** SEARCH_COLUMNS **/

Template.search_columns.helpers({
	columns: function() {
		return Columns.find({_local: true}, {sort: {created_at: 1}});
	}
});


/** SEARCH_COLUMN **/

Template.search_column.afterCreated = function() {
	var $column = $(this.firstNode);
	
	$column.fadeIn('slow');
	
	$column.find('.search_result').each(function(index, el) {
		var $el = $(el),
			top = $el.offset().top + $el.height();
			
		$el.hardwareAnimate({translateY: '-='+top}, 0, 'linear', function() {
			setTimeout(function() {
				$el.hardwareAnimate({translateY: '+='+top}, 400, 'easeOutBack');
			}, (index + 1) * 50);
		});
	});
};

Template.search_column.helpers({
	videos: function() {
		return Videos.find({_local: true, column_index: this.index});
	}
});

Template.search_column.events({
	'mouseenter .search_result_column': function(e) {
		$(e.currentTarget).addClass('selected_column');
		$(e.currentTarget).find('.delete_column').show();
	},
	'mouseleave .search_result_column': function(e) {
		$(e.currentTarget).removeClass('selected_column');
		$(e.currentTarget).find('.delete_column').hide();
	},
	'click .delete_column': function(e) {
		var column = this,
			index = this.index, 
			$column = $('.search_result_column[index='+index+']');
		
		$column.css('border', '3px solid white');
		$(e.currentTarget).remove();
		
		$column.find('.search_result').each(function(index, el) {
			var $el = $(el),
				top = $el.offset().top + $el.height();

			setTimeout(function() {
				$el.hardwareAnimate({translateY: '-='+top}, 400, 'easeInBack');
			}, (index + 1) * 50);
		});
		
		setTimeout(function() {
			$column.animate({opacity: 0}, function() {
				column.delete();		
				BackNext.subtractColumn();
			});
		}, 400);
	}
});


/** SEARCH_RESULT **/

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
	},
	'click .check_video': function(e) {
		this.checked = this.checked ? null : true;
		this.store();
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


/** HOVER_PLAYER **/

Template.hover_player.afterCreated = function() {
	YoutubePlayer.mini('hover_player');
};

Template.hover_player.destroyed = function() {
	YoutubePlayer.mini('hover_player').destroy();
};


/** SEARCH_VIDEO_INFO **/
Template.search_video_info.helpers({
	title: function() {
		if(!Session.get('current_search_video_id')) return '';
		return Videos.findOne(Session.get('current_search_video_id')).title;
	},
	time: function() {
		if(!Session.get('current_player_id')) return '00:00';
		return YoutubePlayer.get('hover_player').timeFormatted();
	},
	duration: function() {
		return YoutubePlayer.get('hover_player').durationFormatted();
	}
});



