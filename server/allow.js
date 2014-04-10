Videos.allow({
	insert: function (userId, doc) {
		doc.created_at = moment().toDate();
		doc.updated_at = moment().toDate();
		return true;
	},
	update: function (userId, doc, fields, modifier) {
		doc.updated_at = moment().toDate();
		return (doc.user_id == userId || Roles.userIsInRole(userId, ['admin']));
	},
	remove: function (userId, doc) {
		return (doc.user_id == userId || Roles.userIsInRole(userId, ['admin']));
	},
	fetch: ['user_id']
});


Categories.allow({
	insert: function (userId, doc) {
		if(Roles.userIsInRole(userId, ['admin'])) return true;
	},
	update: function (userId, doc, fields, modifier) {
		if(Roles.userIsInRole(userId, ['admin'])) return true;
	},
	remove: function (userId, doc) {
		if(Roles.userIsInRole(userId, ['admin'])) return true;
	}
});




Meteor.users.allow({
    insert: function(userId, doc) {
        return true;
    },
    update: function(userId, doc, fields, modifier) {
        return (doc._id == userId || Roles.userIsInRole(userId, ['admin']));
    },
    remove: function() {
        return (doc._id == userId || Roles.userIsInRole(userId, ['admin']));
    },
	fetch: ['_id']
});


Watches.allow({
	insert: function (userId, doc) {
		doc.created_at = moment().toDate();
		doc.updated_at = moment().toDate();
		return true;
	},
	update: function (userId, doc, fields, modifier) {
		doc.updated_at = moment().toDate();
		return (doc.user_id == userId || Roles.userIsInRole(userId, ['admin']));
	},
	remove: function (userId, doc) {
		return (doc.user_id == userId || Roles.userIsInRole(userId, ['admin']));
	},
	fetch: ['user_id']
});

Favorites.allow({
	insert: function (userId, doc) {
		doc.created_at = moment().toDate();
		doc.updated_at = moment().toDate();
		return true;
	},
	update: function (userId, doc, fields, modifier) {
		doc.updated_at = moment().toDate();
		return (doc.user_id == userId || Roles.userIsInRole(userId, ['admin']));
	},
	remove: function (userId, doc) {
		return (doc.user_id == userId || Roles.userIsInRole(userId, ['admin']));
	},
	fetch: ['user_id']
});

Comments.allow({
	insert: function (userId, doc) {
		doc.created_at = moment().toDate();
		doc.updated_at = moment().toDate();
		return true;
	},
	update: function (userId, doc, fields, modifier) {
		doc.updated_at = moment().toDate();
		return (doc.user_id == userId || Roles.userIsInRole(userId, ['admin']));
	},
	remove: function (userId, doc) {
		return (doc.user_id == userId || Roles.userIsInRole(userId, ['admin']));
	},
	fetch: ['user_id']
});


Suggestions.allow({
	insert: function (userId, doc) {
		doc.created_at = moment().toDate();
		doc.updated_at = moment().toDate();
		return true;
	},
	update: function (userId, doc, fields, modifier) {
		doc.updated_at = moment().toDate();
		return (doc.user_id == userId || Roles.userIsInRole(userId, ['admin']));
	},
	remove: function (userId, doc) {
		return (doc.user_id == userId || Roles.userIsInRole(userId, ['admin']));
	},
	fetch: ['user_id']
});



LiveVideos.allow({
	insert: function (userId, doc) {
		doc.created_at = moment().toDate();
		doc.updated_at = moment().toDate();
		return true;
	},
	update: function (userId, doc, fields, modifier) {
		doc.updated_at = moment().toDate();
		return (doc.user_id == userId || Roles.userIsInRole(userId, ['admin']));
	},
	remove: function (userId, doc) {
		return (doc.user_id == userId || Roles.userIsInRole(userId, ['admin']));
	},
	fetch: ['user_id']
});



LiveUsers.allow({
	insert: function (userId, doc) {
		doc.created_at = moment().toDate();
		doc.updated_at = moment().toDate();
		return true;
	},
	update: function (userId, doc, fields, modifier) {
		doc.updated_at = moment().toDate();
		return (doc.user_id == userId || Roles.userIsInRole(userId, ['admin']));
	},
	remove: function (userId, doc) {
		return (doc.user_id == userId || Roles.userIsInRole(userId, ['admin']));
	},
	fetch: ['user_id']
});



YoutubeVideos.allow({
	insert: function (userId, doc) {
		doc.created_at = moment().toDate();
		doc.updated_at = moment().toDate();
		return true;
	},
	update: function (userId, doc, fields, modifier) {
		doc.updated_at = moment().toDate();
		return (doc.user_id == userId || Roles.userIsInRole(userId, ['admin']));
	},
	remove: function (userId, doc) {
		return (doc.user_id == userId || Roles.userIsInRole(userId, ['admin']));
	},
	fetch: ['user_id']
});

Follows.allow({
	insert: function (userId, doc) {
		doc.created_at = moment().toDate();
		doc.updated_at = moment().toDate();
		return true;
	},
	update: function (userId, doc, fields, modifier) {
		doc.updated_at = moment().toDate();
		return (doc.follower_user_id == userId || Roles.userIsInRole(userId, ['admin']));
	},
	remove: function (userId, doc) {
		return (doc.follower_user_id == userId || Roles.userIsInRole(userId, ['admin']));
	},
	fetch: ['follower_user_id']
});
