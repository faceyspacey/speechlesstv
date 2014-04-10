//usage: {{> dynamicTemplate name="templateName" data=dataContext}}
Template.dynamicTemplate.chooseTemplate = function(name) {
  return Template[name];
};

Template.follow_button.helpers({
	followText: function() {
		if(!Meteor.user()) return 'follow';
		var userId = Session.get('current_buddy_row_user_id');
		return Meteor.user().isFollowed(userId) ? 'unfollow' : 'follow';
	}
});