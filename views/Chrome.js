/*global document, $, _, Backbone */
window.Views = window.Views || {};

window.Views.Chrome = (function(Parent, Router, Menubar) {
	"use strict";

	return Parent.extend({
		tagName: 'div',
		className: 'views-chrome',

		initialize: function() {
			this.game = this.options.game;
		},

		renderChildren: function() {
			var children = {};
			children.menubar = new Menubar({
				game: this.game
			}).render();

			this.$el.append(_.pluck(children, 'el'));

			return children;
		}
	});

})(window.Views.Bases.ParentView, window.Router, window.Views.Menubar);
