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

	_.extend(this, Model);
	this.extend(doc);
	
    return this;
};

SuggestionModel.prototype = {

};
