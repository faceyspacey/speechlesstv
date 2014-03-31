Model = {
	errors: {},
	collection: function(name){
		switch(name || this.collectionName) {
            	case 'Users':            return Meteor.users;
				case 'Columns':       	 return Columns;
            	case 'Videos':       	 return Videos;
				case 'Categories':       return Categories;
				case 'Favorites':      	 return Favorites;
            	case 'Suggestions':      return Suggestions;
				case 'Follows':          return Follows;
				case 'Watches':          return Watches;
        }
    },
	db: function() {
		if(this._local) return this.collection()._collection;
		else return this.collection();
	},
	persist: function() {
		this.db().remove(this._id);
		delete this._local;
		delete this._id;
		this.save();
	},
	store: function() {
		this._local = true;
		this.save();
	},
	save: function() {
		var attributes = this.getMongoAttributes();
		return this._upsert(attributes);	
    },
	_upsert: function(attributes) {
		if(this._id) return this.update(attributes);
		else return this.insert(attributes);
	},
	insert: function(attributes) {
		attributes = this.prepareDefaults(attributes);
		this._id = this.db().insert(attributes);
		this.refresh();
		
		return this._id;
	},
	update: function(attributes) {
		this.db().update(this._id, {$set: attributes});
		this.refresh();
		
		return this._id;
	},
    refresh: function(){
        this.extend(this.collection().findOne(this._id));
    },
	prepareDefaults: function(attributes){
		var object = {};
		_.extend(object, this.defaultValues, attributes); 
		return object;
    },
	getMongoAttributes: function(includeId) {
		var mongoValues = {};
		for(var prop in this) {
			if(this.isMongoAttribute(prop)) mongoValues[prop] = this[prop];
		}
		
		if(includeId) mongoValues._id = this[_id];
		
		return mongoValues;
	},
	isMongoAttribute: function(prop) {
		if(_.isFunction(this[prop])) return false;
		if(prop == '_id' || prop == 'errors' || prop == 'defaultValues' || prop == 'collectionName') return false;
		return true;
	},
	time: function(field) {
		return moment(this[field]).format("MM/DD - h:mma");
	},
	extend: function(doc) {
		doc = doc != undefined && _.isObject(doc) ? doc : {};
		
		_.extend(this, doc);
	},
	
	
	/** new features **/
	delete: function(noAfterDelete) {
		console.log('deleting', this.collectionName);
		
		this.db().remove(this._id);
		if(this.afterDelete && !noAfterDelete) this.afterDelete();
	}
};