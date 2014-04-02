Deps.autorun(function() {
    var videoIds = Videos.find({_local: true}).map(function(video) {
        return video._id;
    });

    Favorites.find({$in: videoIds}).observeChanges({
		added: function() {
			Videos.update({_id: id, _local: true}, {$set: {favorite: true}});
		},
		removed: function(id) {
			Videos.update({_id: id, _local: true}, {$set: {favorite: false}});
		}
	});
});



prospectObseverAdded = null
prospectObseverChanged = null;
notificationBuffer = [];
setupNotificationsObservation = function() {
	Deps.afterFlush(function() {
		if(prospectObseverAdded) prospectObseverAdded.stop();
		if(prospectObseverChanged) prospectObseverChanged.stop();

		if(!Meteor.user() || !Meteor.user().timezone) return false;
		var now = moment().zone(Meteor.user().timezone).toDate();
		prospectObseverAdded = Prospects.find({created_at: {$gt: now}}).observeChanges({
			added: function(id, fields) {
				console.log('prospect discovered', fields);
				if(fields.status === 0) notificationBuffer.push(id);//Prospects.findOne(id).displayNotification();
			}
		});

		prospectObseverChanged = Prospects.find().observeChanges({
			changed: function(id, fields) {
				console.log('prospect delivered', fields);
				if(fields.status) notificationBuffer.push(id); //Prospects.findOne(id).displayNotification();
			}
		});
	});
};
Deps.autorun(function() {
	setupNotificationsObservation();
});
