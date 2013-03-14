Meteor.publish('allVideos', function() {
	return Videos.find();
});


//this code must be on the server
Accounts.onCreateUser(function (options, user) {
	console.log('onCreateUser CALLBACK', options, user);
	
	user.profile = options.profile;
	user.profile.createdAt = user.createdAt;
	user.profile.email = user.services.facebook.email;
	user.profile.first_name = user.services.facebook.first_name;
	user.profile.last_name = user.services.facebook.last_name;
	user.profile.username = user.services.facebook.username;
	user.profile.link = user.services.facebook.link;
	user.profile.gender = user.services.facebook.gender;
	user.profile.facebook_id = user.services.facebook.id;
	return user;
});

Accounts.validateNewUser(function (user) {
	console.log('validateNewUser', user);
	
	
	return true;
	
 	//example code
  if (user.username && user.username.length >= 3)
    return true;
  throw new Meteor.Error(403, "Username must have at least 3 characters");
});