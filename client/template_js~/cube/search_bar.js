Session.set('filter', '#popular_side');

Template.search_bar_side.helpers({
	popularChecked: function() {
 		return Session.equals('search_side', '#popular_side') ? 'checked' : '';
	},
	fromFriendsChecked: function() {
		return Session.equals('search_side', '#from_friends_side') ? 'checked' : '';
	},
	categories: function() {
		return YoutubeCategories;
		//return Categories.find({name: {$not: 'all'}});
	},
	categoryName: function() {
		if(Session.equals('mouse_over_category_dropdown', true)) return 'Select a Category';
		
		var catId = Session.get('selected_search_category_id');
		return catId ? Categories.findOne({category_id: catId}).name : 'Select a Category';
	}
});

Template.autocompletion.helpers({
	predictiveResults: function() {
		$('.autocompletion_row').slideDownCollection(300, 'easeOutBack', 25);
		return Session.get('predictive_results');
		
	}
});

Template.autocompletion.events({
	'mousedown .autocompletion_row': function() {
		console.log('query', this);
		YoutubeSearcher.query(this);
	}
});



var predictiveTimer;
Template.search_bar_side.events({
	'click .buddy_list_button': function() {
		$('.cube').getCube().toggleBuddyList();
	},
	'keyup #search_bar input': function(e) {
		var value = $('#search_bar input').val();
		
		if(value.length > 0) $('#search_bar .enter_button').show();
		else $('#search_bar .enter_button').hide();
		
		clearTimeout(predictiveTimer);
		
		if(e.keyCode == 27) { //escape key
			$('#search_bar input').blur();
		}
		else if(e.keyCode == 13) { //enter key		
			YoutubeSearcher.query(value);
			$('#search_bar input').blur();
		}
		else if(value.length == 0) {
			$('.autocompletion_row').fadeOut('fast').slideUpCollection(150, 'easeOutBack', 25, function() {
				Session.set('predictive_results', []);
			});
		}
		else {
			predictiveTimer = setTimeout(function() {
				YoutubeSearcher.predictiveResults(value);
			}, 300);
		}
	},
	'focus #search_bar input': function(e) {
		$('#search_query').animate({paddingTop: 20});
		var params = {rotateY: 'keep', rotateX: '+=2.5', translateZlast: true};
		$('.cube').getCube().currentSide.hardwareAnimate(params, 300, 'easeOutBack');
	},
	'blur #search_bar input': function(e) {
		$('#search_query').animate({paddingTop: 10});
		
		$('.autocompletion_row').fadeOut('fast').slideUpCollection(150, 'easeOutBack', 25, function() {
			Session.set('predictive_results', []);
		});
		
		$('#search_bar .enter_button').hide();
		
		var params = {rotateY: 'keep', rotateX: '-=2.5', translateZlast: true};
		$('.cube').getCube().currentSide.hardwareAnimate(params, 300, 'easeOutBack');
	},

	'click #popular': function() {
		if(!Session.equals('search_side', '#popular_side')) Cube.popularSide();
		
	},
	'click #from_friends': function() {
		if(!Session.equals('search_side', '#from_friends_side')) Cube.fromFriendsSide();
	},
	
	'mouseenter #search_category_dropdown': function(e) {
		Session.set('mouse_over_category_dropdown', true);
		$('#search_category_options').show();
		$('.search_category_option').slideDownCollection(150, 'easeOutBack', 25, null, .9);
	},
	'mouseleave #search_category_dropdown': function(e) {
		Session.set('mouse_over_category_dropdown', false);
		$('.search_category_option').slideUpCollection(150, 'easeInBack', 25, function() {
			if(Session.equals('mouse_over_category_dropdown', false)) $('#search_category_options').hide();
		});
	},
	'click .search_category_option': function() {
		Session.set('selected_search_category_id', this.category_id);
		Session.set('mouse_over_category_dropdown', false);
		
		YoutubeSearcher.popular(this);
		
		$('.search_category_option').slideUpCollection(150, 'easeInBack', 25, function() {
			if(Session.equals('mouse_over_category_dropdown', false)) $('#search_category_options').hide();
		});
	},
	'mouseenter .search_category_option': function(e) {
		$(e.currentTarget).css('opacity', '1');
	},
	'mouseleave .search_category_option': function(e) {
		$(e.currentTarget).css('opacity', '.9');
	},
	'click #history_button': function() {	
		Session.set('search_side', '#history_side');
		
		Cube.historySide();
	}
});

Session.set('mouse_over_category_dropdown', false);