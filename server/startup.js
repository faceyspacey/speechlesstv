TwitterConfig = {
	consumerKey: 'x37EOcHmeQ1RQXtURq9Og',
    secret: 'lwkZG8sbn5dV3TMGrc99L8yvxHPE9SL2EqpT2UqRpo'
};

Meteor.startup(function () {
	if (Categories.find().count() === 0) {
	_.each(allCategories, function(value, index) {
			Categories.insert({name: value, category_id: index});
		});
	}
	
	
	if(Meteor.roles.find().count() === 0) {
		Roles.createRole('admin');
		Roles.createRole('user');
	}
	
	/**
	 Accounts.loginServiceConfiguration.remove({
	    service: "facebook"
	  });

	  Accounts.loginServiceConfiguration.insert({
	    service: "facebook",
	    appId: '697368233620325',
	    secret: 'c8c1c325c950d984b9293fd24b419a0c'
	  });
	**/
	
	Accounts.loginServiceConfiguration.remove({
	    service: "twitter"
	  });

	  Accounts.loginServiceConfiguration.insert({
	    service: "twitter",
	    consumerKey: TwitterConfig.consumerKey,
	    secret: TwitterConfig.secret
	  });
});



