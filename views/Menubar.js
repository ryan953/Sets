/*global $ _ Backbone document */
window.Views = window.Views || {};

window.Views.Menubar = (function(Parent, Scoreboard) {
	"use strict";

	return Parent.extend({
		tagName: 'div',
		className: 'views-menubar',

		events: {
			'click a[data-route]': 'route',
			'click .game-reset': 'resetGame'
		},

		initialize: function() {
			this.game = this.options.game;

			this.template = _.template($('#tmpl-menu').text());
		},

		render: function() {
			this.$el.html(this.template());

			this.$('.scoreboard-placeholder').append(
				new Scoreboard({
					game: this.game
				}).render().el
			);

			return this;
		},

		route: function(e) {
			var route = this.$(e.target).data('route');
			this.trigger('route:change', route);
		},

		resetGame: function() {
			this.game.start(this.game.settings.get('mode'));
		}
	});

})(Backbone.View, window.Views.Scoreboard);
