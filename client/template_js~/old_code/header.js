Template.header.events({
	'click #facebook_connect': function() {
		Meteor.loginWithTwitter(function(error) {
			if(!error) Router.go('channel', {name: Meteor.user().profile.username});
			else alert('Something went wrong with logging in to Twitter!');
		});
	},
	'click #upload_video_button': function() {
		if(!Meteor.user()) {
			Meteor.loginWithTwitter(function(error) {
				console.log('ERROR', error);
				if(!error) Router.go('add_video');
				else alert('Something went wrong with logging in to Twitter!');
			});
		}
		else Router.go('add');
	},
	'click #back_buton': function() {
		history.back();
	},
	'click #my_account': function() {
		Router.go('settings');
		//Router.go('channel', {name: Meteor.user().profile.username});
	}
});


Template.header.rendered = function() {
	if(isFullScreen()) $('#header_container').hide();
}