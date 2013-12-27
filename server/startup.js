Meteor.startup(function () {
	if (Categories.find().count() === 0) {
    	var categories = ['all', 'comedy', 'music', 'documentary', 'tech', 'education', 'news', 'skate', 'hot', 'gym'];

		_.each(categories, function(value, index) {
			Categories.insert({name: value, category_id: index});
		});
	}
	
	if(Meteor.roles.find().count() === 0) {
		Roles.createRole('admin');
		Roles.createRole('user');
	}
});