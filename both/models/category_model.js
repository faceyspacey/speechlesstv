Categories = new Meteor.Collection('categories', {
	transform: function(doc) {
		return new CategoryModel(doc);
	}
});

/** CategoryModel attributes:
 *
 * _id: "X5NnRaXiE5iu5xCnc"
 * name: 'chickflick'
 *
**/


CategoryModel = function(doc){
	this.collectionName = 'Categories';
    this.defaultValues = {};

	_.extend(this, Model);
	this.extend(doc);
	
    return this;
};

CategoryModel.prototype = {

};

CategoryModel.allcategories = allCategories = ['all', 'chickflick', 'comedy', 'bromance', 'thriller', 'epic', 'short', 'classics'];