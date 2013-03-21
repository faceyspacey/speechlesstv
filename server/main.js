Meteor.publish('allVideos', function() {
	return Videos.find();
});

Meteor.publish('allCategories', function() {
	return Categories.find();
});

Meteor.publish('allBeingWatched', function() {
	return BeingWatched.find();
});

Meteor.publish('allUsers', function() {
	return Meteor.users.find();
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





//make it so only admins can do most database-editing actions
Videos.allow({
	insert: function (userId, doc) {
		if(Meteor.absoluteUrl() == 'http://localhost:3000/') return true;
	  	return _.contains(admins, userId);
	},
	update: function (userId, doc, fields, modifier) {
		if(Meteor.absoluteUrl() == 'http://localhost:3000/') return true;
	  	return _.contains(admins, userId);
	},
	remove: function (userId, doc) {
		if(Meteor.absoluteUrl() == 'http://localhost:3000/') return true;
		return _.contains(admins, userId);
	}
});

Categories.allow({
	insert: function (userId, doc) {
		if(Meteor.absoluteUrl() == 'http://localhost:3000/') return true;
	  	return _.contains(admins, userId);
	},
	update: function (userId, doc, fields, modifier) {
		if(Meteor.absoluteUrl() == 'http://localhost:3000/') return true;
	  	return _.contains(admins, userId);
	},
	remove: function (userId, doc) {
		if(Meteor.absoluteUrl() == 'http://localhost:3000/') return true;
		return _.contains(admins, userId);
	}
});

BeingWatched.allow({
	insert: function (userId, doc) {
	  	return true; //anyone can insert a new BeingWatched video
	},
	update: function (userId, doc, fields, modifier) {
		if(Meteor.absoluteUrl() == 'http://localhost:3000/') return true;
	  	return _.contains(admins, userId);
	},
	remove: function (userId, doc) {
		if(Meteor.absoluteUrl() == 'http://localhost:3000/') return true;
		return _.contains(admins, userId);
	}
});

