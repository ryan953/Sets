define('views/bases/parent-view', [
	'underscore',
	'backbone'
], function(_, Backbone) {
	"use strict";

	return Backbone.View.extend({
		child_views: [],

		render: function() {
			this.removeChildren();

			this.child_views = this.renderChildren();

			return this;
		},

		remove: function() {
			Backbone.View.prototype.remove.call(this);
			this.removeChildren();
		},

		removeChildren: function() {
			_.each(this.child_views, function(view) {
				view.remove();
			});
			this.child_views = [];
		}
	});

});
