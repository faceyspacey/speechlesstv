Meteor.subscribe('users');
Meteor.subscribe('watches', Meteor.userId());
Meteor.subscribe('favorites', Meteor.userId());
Meteor.subscribe('suggestions', Meteor.userId());
Meteor.subscribe('follows', Meteor.userId());