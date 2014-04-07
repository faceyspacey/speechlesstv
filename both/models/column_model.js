/** ColumnModel attributes:
 *
 * _id "		X5NnRaXiE5iu5xCnc"
 * index		Int
 * label		string
 * color		string (#559afe)
 **/

Columns = new Meteor.Collection('columns', {
	transform: function(doc) {
		return new ColumnModel(doc);
	}
});

ColumnModel = function(doc) {
	this.collectionName = 'Columns';
    this.defaultValues = {};

	_.extend(this, Model);
	this.extend(doc);
	
    return this;
};

ColumnModel.prototype = {
	afterDelete: function() {
		Videos.find({column_index: this.index}).forEach(function(video) {
			video.delete();
		});
	}
};

ColumnModel.nextIndex = function(side) {
	var columns = Columns.find({side: side}, {sort: {created_at: -1}, limit: 1}).fetch();
	
	if(columns.length === 0) return 0;
	else return columns[0].index + 1;
};



ColumnModel.deleteAll = function() {
	Columns.find().forEach(function(column) { 
		column.delete(true); 
	});
};
