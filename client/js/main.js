Meteor.startup(function(){
	setTimeout(function() {
		Session.set('current_video', Videos.findOne({category_id: 1}, {sort: {length: -1}}));
	}, 500);
});

Accounts.ui.config({
  requestPermissions: {
    facebook: ['user_likes'],
    github: ['user', 'repo']
  },
  requestOfflineToken: {
    google: true
  },
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});

