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

