Template.header.events({
	'click #facebook_connect': function() {
		Meteor.loginWithFacebook(['email', 'publish_actions', 'user_about_me'], function(error) {
			if(!error) Router.go('channel', {name: Meteor.user().profile.username});
			else alert('Something went wrong with logging in to FacebooK!');
		});
	},
	'click #upload_video_button': function() {
		if(!Meteor.user()) {
			Meteor.loginWithFacebook(['email', 'publish_actions', 'user_about_me'], function(error) {
				if(!error) Router.go('add_video');
				else alert('Something went wrong with logging in to FacebooK!');
			});
		}
		else Router.go('add');
	},
	'click #back_buton': function() {
		history.back();
	},
	'click #my_account': function() {
		Router.go('channel', {name: Meteor.user().profile.username});
	}
});


Template.header.rendered = function() {
	if(isFullScreen()) $('#header_container').hide();
}