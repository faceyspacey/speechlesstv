/** SEARCH **/

Template.search.created = function() {
	console.log('search created');

	Deps.afterFlush(function() {
		Resizeable.resizeAllElements();
	});
};


/** ADD_VIDEOS **/

Template.add_videos.rendered = function() {
	Deps.afterFlush(function() {
		Meteor.setTimeout(function() {
			vScroll('add_videos_wrapper');
		}, 0);
	});
};

Template.add_videos.helpers({
	videos: function() {
		return Videos.find({_local: true, checked: true});
	}
});

Template.add_videos.events({
	'click #add_videos_back': function() {
		$('.cube').cube().prevSideHorizontal();
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
		return catId ? Categories.findOne(catId).name : 'Select a Category';
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
		Session.set('selected_search_category_id', this._id);
		Session.set('mouse_over_category_dropdown', false);
		
		$('.search_category_option').slideUpCollection(300, 'easeInBack', 50, function() {
			if(Session.equals('mouse_over_category_dropdown', false)) $('#search_category_options').hide();
		});
	},
	'click #search_next_button': function() {
		$('.cube').cube().nextSideHorizontal($('#add_videos_side'));
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
		console.log(this, this.index);
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
	'click .search_result': function() {
		YoutubeSearcher.related(this.youtube_id);
	},
	'mouseenter .search_result': function(e) {
		var $result = $(e.currentTarget);
		
		$result.addClass('selected_result');
		
		
		//display video info box
		Session.set('current_search_video_id', this._id);
		
		var resultOffsetLeft = $result.offset().left,
			percentAcrossPage = resultOffsetLeft / SearchSizes.pageWidth(),
			containerOffsetLeft = $('#search_video_info').parent().offset().left,
			left;
			
	
		if(percentAcrossPage < .35) left = resultOffsetLeft + SearchSizes.columnAndMarginWidth();
		else left = resultOffsetLeft - (SearchSizes.columnAndMarginWidth() * 2);

		$('#search_video_info').css({
			left: left - containerOffsetLeft - 1, 
			top: $result.offset().top - SearchSizes.header - 1, 
			width: SearchSizes.videoInfoBoxWidth() + 1,
			height: $result.height() + 4
		}).show();
	},
	'mouseleave .search_result': function(e) {
		$(e.currentTarget).removeClass('selected_result');
		
		$('#search_video_info').hide();
	},
	'click .check_video': function(e) {
		console.log(this);
		this.checked = this.checked ? null : true;
		this.store();
		e.stopPropagation();
	}
});