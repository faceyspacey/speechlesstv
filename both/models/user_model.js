/** UserModel attributes:
 *
 *  _id                      Str
 *
**/


UserModel = function(doc) { 
    this.collectionName = 'Users';
	this.defaultValues = {};
	
    _.extend(this, Model);
	this.extend(doc);

    return this;
};





UserModel.prototype = {
	getEmail: function() {
		return this.emails[0].address;
	},
	isAdmin: function() {
		return Roles.userIsInRole(this._id, ['admin']);
	}
};