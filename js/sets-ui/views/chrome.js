define([
	'underscore',
	'view',
	'./menubar'
], function(_, Parent, Menubar) {
	"use strict";

	return Parent.extend({
		tagName: 'div',
		className: 'views-chrome',

		initialize: function(options) {
			this.game = options.game;
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

});
