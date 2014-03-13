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