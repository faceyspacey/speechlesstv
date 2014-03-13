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
			ColumnModel.deleteAll();
						
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