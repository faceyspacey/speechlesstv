Template.category_dropdown.helpers({
	category: function() {
		if(Session.get('current_video')) {
			var categoryId = Session.get('current_video').category_id;
			return Categories.findOne({category_id: categoryId}).name;
		}	
	},
	selectedCategory: function(categoryId) {
		if(!Session.get('current_video') || !Session.get('current_video').category_id) return;
		return this.category_id == Session.get('current_video').category_id ? 'selected="selected"' : '';
	}
});

Template.category_dropdown.events({
	'change select': function(e) {
		if($(e.currentTarget).val() > 0) {
			Videos.update(Session.get('current_video')._id, {
				$set: {category_id: parseInt($(e.currentTarget).val())}
			});
		}
	}
});



Template.description_box.events({
	'blur textarea, mouseleave textarea': function(e) {
		if($(e.currentTarget).val() != Session.get('current_video').description) {
			Videos.update(Session.get('current_video')._id, {
				$set: {description: $(e.currentTarget).val()}
			});
		}
	}
});



Template.submit_video.helpers({
	bulletCheckmarkCategory: function() {
		console.log('CURRENT VID', Session.get('current_video'));
		return !!Videos.findOne(Session.get('current_video')._id).category_id ? '&#10003' : '&#149;';
	},
	bulletCheckmarkDescription: function() {
		return !!Videos.findOne(Session.get('current_video')._id).description ? '&#10003' : '&#149;';
	}
});

Template.submit_video.events({
	'mouseenter #submit_video_button': function() {
		
		//adjust overflow so hidden by the time the bullets box should slide out of view
		setTimeout(function() {
			$('#submit_video_box').css('overflow', 'hidden');
		}, 250);
		
		$('#update_video_bullets').animate({
			top: '+=205'
		}, 350, 'easeInBack');
	},
	'mouseleave #submit_video_button': function() {
		//reverse of above 
		setTimeout(function() {
			$('#submit_video_box').css('overflow', 'visible');
		}, 100);
		
		$('#update_video_bullets').animate({
			top: '-=205'
		}, 350, 'easeOutBack');
	},
	'click #submit_video_button': function() {
		if(!Videos.findOne(Session.get('current_video')._id).category_id) alert('You know what to do ;)');
		else if(!Videos.findOne(Session.get('current_video')._id).description) alert('Almost there..');
		else {
			var vid = Session.get('current_video')._id;
			Videos.update(vid, {$set: {
				title: $('#title_texarea').val(),
				category_id: parseInt($('#category_dropdown').val()),
				description:$('#description_textarea').val(),
				time: Date.now(),
				complete: true
			}}, function(error) {
				Deps.afterFlush(function() {
					scrollToTop();
					Session.set('just_added_video', true);
					Router.go('video', {video_id: vid});
				});
			});
		}
	}
});



Template.submit_video_rendered_first.rendered = function() {
	//reverse of above 
	setTimeout(function() {
		setTimeout(function() {
			$('#submit_video_box').css('overflow', 'visible');
		}, 100);

		$('#update_video_bullets').animate({
			top: '-=205'
		}, 350, 'easeOutBack');
	}, 250);
}