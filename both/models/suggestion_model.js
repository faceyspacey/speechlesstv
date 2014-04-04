/** SuggestionModel attributes:
 *
 * _id: "X5NnRaXiE5iu5xCnc"
 * sender_user_id: "7suR9CJzAsiMN6ry2"
 * recipient_user_id: ""7suR9CJzAsiMN6ry2
 * youtube_id: "4mInhfiDyTA"
 *
**/

Suggestions = new Meteor.Collection('suggestions', {
	transform: function(doc) {
		return new SuggestionModel(doc);
	}
});


SuggestionModel = function(doc){
	this.collectionName = 'Suggestions';
    this.defaultValues = {};

	_.extend(this, AbstractVideoModel);
	_.extend(this, Model);
	this.extend(doc);
	
    return this;
};

SuggestionModel.prototype = {
	sender: function() {
		return Meteor.users.findOne(this.sender_user_id);
	},
	recipient: function() {
		return Meteor.users.findOne(this.recipient_user_id);
	},
	date: function() {
		return 'Suggested on: '+moment(this.created_at).format("dddd MMMM do @ h:mma");
	},
	note: function() {
		return 'Suggested to ' + this.recipient().name + ' by ' + this.sender().name;
	}
};
