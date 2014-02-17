define('views/chrome', [
	'underscore',
	'views/bases/parent-view',
	'routers/game-router',
	'views/menubar'
], function(_, Parent, Router, Menubar) {
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

});
