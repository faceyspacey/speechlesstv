var adminUsers = ['16404762', '100000688015995', '1194105817'];

Accounts.onCreateUser(function (options, user) {	
	user.profile = options.profile;
	user.profile.createdAt = user.createdAt;
	user.profile.email = user.services.facebook.email;
	user.profile.first_name = user.services.facebook.first_name;
	user.profile.last_name = user.services.facebook.last_name;
	user.profile.username = user.services.facebook.username;
	user.profile.link = user.services.facebook.link;
	user.profile.gender = user.services.facebook.gender;
	user.profile.facebook_id = user.services.facebook.id;

	if(_.contains(adminUsers, user.profile.facebook_id)) user.roles = ['admin', 'user'];
	else user.roles = ['user'];
	
	return user;
});


