Template.search_columns_popular.helpers({
	columns: function() {
		return Columns.find({_local: true, side: 'popular'}, {sort: {created_at: 1}});
	}
});

Template.search_columns_popular_from_friends.helpers({
	columns: function() {
		return Columns.find({_local: true, side: 'from_friends'}, {sort: {created_at: 1}});
	}
});




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
	
	setTimeout(function() {
		$column.find('.column_label').animate({bottom: -4}, 300, 'easeOutExpo');
	}, 700);
};

Template.search_column.helpers({
	isVideos: function() {
		var side = Session.equals('search_side', '#popular_side') ? 'popular' : 'from_friends';
		return Videos.find({_local: true, side: side, column_index: this.index}).count();
	},
	videos: function() {
		var side = Session.equals('search_side', '#popular_side') ? 'popular' : 'from_friends';
		return Videos.find({_local: true, side: side, column_index: this.index});
	}
});

Template.search_column.events({
	'mouseenter .search_result_column': function(e) {
		$(e.currentTarget).addClass('selected_column');
		$(e.currentTarget).find('.column_label').animate({bottom: -28}, 300, 'easeOutExpo');
	},
	'mouseleave .search_result_column': function(e) {
		$(e.currentTarget).removeClass('selected_column');
		$(e.currentTarget).find('.column_label').animate({bottom: -4}, 300, 'easeOutExpo');
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