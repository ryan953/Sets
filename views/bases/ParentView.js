/*global _ Backbone document */
window.Views = window.Views || {};
window.Views.Bases = window.Views.Bases || {};

window.Views.Bases.ParentView = (function(Parent) {
	"use strict";

	return Parent.extend({
		child_views: [],

		render: function() {
			this.removeChildren();

			this.child_views = this.renderChildren();

			return this;
		},

		remove: function() {
			Parent.prototype.remove.call(this);
			this.removeChildren();
		},

		removeChildren: function() {
			_.each(this.child_views, function(view) {
				view.remove();
			});
			this.child_views = [];
		}
	});

})(Backbone.View);
