Meteor.methods({
	deleteLiveUser: function() {
		LiveUsers.remove({user_id: this.userId});
	}
});