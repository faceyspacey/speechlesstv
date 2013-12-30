Meteor.publish('allCategories', function() {
	return Categories.find();
});


Meteor.publish('allVideos', function(limit, channel, category) {
	if(channel) return Videos.find({channel: channel, complete: true}, {sort: {time: -1}, limit: limit});
	
	if(category) {
		var category_id = Categories.findOne({name: category}).category_id;
		return Videos.find({category_id: category_id, complete: true}, {sort: {time: -1}, limit: limit});
	}
	
	return Videos.find({complete: true}, {sort: {time: -1}, limit: limit});
});

Meteor.publish('video', function(videoId) {
	return Videos.find({_id: videoId});
});


Meteor.publish(null, function (){ 
  return Meteor.roles.find({})
})