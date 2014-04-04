/** CommentModel attributes:
 *
 * _id				 "X5NnRaXiE5iu5xCnc"
 * user_id 			"7suR9CJzAsiMN6ry2"
 * youtube_id 		"4mInhfiDyTA"
 * title 			string
 * message			String
 * ms				Int (milliseconds)
**/

Comments = new Meteor.Collection('comments', {
	transform: function(doc) {
		return new CommentModel(doc);
	}
});


CommentModel = function(doc){
	this.collectionName = 'Comments';
    this.defaultValues = {};

	_.extend(this, AbstractVideoModel);
	_.extend(this, Model);
	this.extend(doc);
	
    return this;
};

CommentModel.prototype = {
	date: function() {
		return 'Commented: '+moment(this.created_at).format("dddd MMMM do @ h:mma")
	},
	note: function() {
		return 'YOUR LAST COMMENT: "'+message+'"';
	}
};