Meteor.startup(function () {
	if (Categories.find().count() === 0) {
    	//var categories = ['all', 'comedy', 'music', 'documentary', 'tech', 'education', 'news', 'skate', 'hot', 'gym'];

		var categories = ['all', 'Chickflick', 'Comedy', 'Bromance', 'Thriller', 'Epic', 'Short', 'Classics'];

		_.each(categories, function(value, index) {
			Categories.insert({name: value, category_id: index});
		});
	}
	
	
	if(Meteor.roles.find().count() === 0) {
		Roles.createRole('admin');
		Roles.createRole('user');
	}
	
	
	 Accounts.loginServiceConfiguration.remove({
	    service: "facebook"
	  });

	  Accounts.loginServiceConfiguration.insert({
	    service: "facebook",
	    appId: '697368233620325',
	    secret: 'c8c1c325c950d984b9293fd24b419a0c'
	  });
});



