Function.prototype.duplicate = function() {
    var that = this;
    var temp = function temporary() { return that.apply(this, arguments); };
    for( key in this ) {
        temp[key] = this[key];
    }
    return temp;
};

afterCreatedCallback = function() {
	for(name in Template) {
		(function() {
			var tmpl = Template[name],
				tmplName = name;
			
			if(tmpl.created != undefined) var oldCreated = tmpl.created.duplicate(); //clone original created function

			tmpl.created = function() {
				if(oldCreated) oldCreated(); //call original created function
				
				console.log('created', tmplName);
				
				//call afterCreated if it exists after page is flushed
				if(_.isFunction(tmpl.afterCreated)) {
					var self = this;
					Deps.afterFlush(function() {
						Meteor.setTimeout(function() {
							tmpl.afterCreated.call(self);
						}, 0);
					});
				}
			};
		})();
	}
};

applyAfterCreatedCallback = _.once(afterCreatedCallback);
Meteor.startup(function() {
	applyAfterCreatedCallback();
});