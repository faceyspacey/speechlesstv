Meteor.methods({
	deleteLiveUser: function() {
		LiveUsers.remove({user_id: this.userId});
	}
});


Meteor.methods({
	followerCount: function() {
		return Follows.find({followed_user_id: this.userId, followed: true}).count();
	},
    followedCount: function () {
        return Follows.find({follower_user_id: this.userId, followed: true}).count();
    }
});

