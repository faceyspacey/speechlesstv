var adminUsers = ['faceyspacey'];

Accounts.onCreateUser(function (options, user) {
	user.name = options.profile.name;
	user.twitter = user.services.twitter.screenName;
	user.pic = user.services.twitter.profile_image_url;
	user.pic_https = user.services.twitter.profile_image_url_https;
	
	if(_.contains(adminUsers, user.twitter)) user.roles = ['admin', 'user'];
	else user.roles = ['user'];
	
	return user;
});


