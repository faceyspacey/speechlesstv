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

YoutubeCategories = [
	{name: 'Entertainment', id: 24, color: '#FF4549'},
	{name: 'Music', id: 10, color: '#FE45AE'},
	{name: 'Sports', id: 17, color: '#BA4FFE'},
	{name: 'Travel/Events', id: 19, color: '#6E5DFE'},
	{name: 'Bloggers', id: 22, color: '#098E9A'},
	{name: 'Comedy', id: 23, color: '#44FEB3'},
	{name: 'News/Politics', id: 25, color: '#81FF45'},
	{name: 'How To', id: 26, color: '#E1FF45'},
	{name: 'Technology', id: 28, color: '#FFBA45'},
	{name: 'Movies', id: 30, color: '#FFA045'},
	{name: 'Education', id: 27, color: '#FF7745'}
];

YoutubeCategorySearchCounts = {};
_.each(YoutubeCategories, function(cat) {
	YoutubeCategorySearchCounts[cat.id] = 0;
});