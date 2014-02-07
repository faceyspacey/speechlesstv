/** SEARCH **/

Template.search.created = function() {
	console.log('search created');

	Deps.afterFlush(function() {
		Resizeable.resizeAllElements();
	});
};


/** SEARCH_FIELD **/

Template.search_field.events({
	'keyup #search_field input': function(e) {
		console.log('keyup');
		
		if(e.keyCode == 13) {
			var value = $('#search_field input').val();			
			YoutubeSearcher.query(value);
		}
	}
});


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
			pageWidth = $(window).width(),
			resultOffsetRight = pageWidth - resultOffsetLeft,
			percentAcrossPage = resultOffsetLeft / pageWidth,
			$column = $('.search_result_column').first(),
			columnWidth = $column.outerWidth(),
			marginRight = parseInt($column.css('margin-right')),
			columnAndMargin = columnWidth + marginRight,
			left;
			
		
		if(percentAcrossPage < .5) left = resultOffsetLeft + columnWidth + marginRight - 6;
		else left = resultOffsetLeft - (columnAndMargin * 2) - 6;
		
		console.log('left', left);
		
		$('#search_video_info').css({left: left, width: columnWidth * 2 + marginRight - 3, height: $column.height() + 3}).fadeIn('fast');
	},
	'mouseleave .search_result': function(e) {
		$(e.currentTarget).removeClass('selected_result');
		
		$('#search_video_info').fadeOut('fast');
	},
	'click .check_video': function(e) {
		console.log(this);
		this.checked = this.checked ? false : true;
		this.store();
		e.stopPropagation();
	}
});
