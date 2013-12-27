Meteor.publish('allCategories', function() {
	return Categories.find();
});


Meteor.publish('allVideos', function(limit, channel, category) {
	if(channel) return Videos.find({channel: channel}, {sort: {time: -1}, limit: limit});
	
	if(category) {
		var category_id = Categories.findOne({name: category}).category_id;
		return Videos.find({category_id: category_id}, {sort: {time: -1}, limit: limit});
	}
	
	return Videos.find({}, {sort: {time: -1}, limit: limit});
});

Meteor.publish(null, function (){ 
  return Meteor.roles.find({})
})