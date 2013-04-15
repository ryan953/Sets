/*global document, $, _, Backbone */
window.Views = window.Views || {};

window.Views.EndGame = (function(Parent, Router, Menubar) {
	"use strict";

	return Parent.extend({
		tagName: 'div',
		className: 'views-endgame',

		events: {
			'click .game-reset': 'resetGame'
		},

		initialize: function() {
			this.game = this.options.game;
			this.game.on('game:start', this.gameStarted, this);
			this.game.on('game:end', this.gameEnded, this);

			this.template = _.template($('#tmpl-game-over').text());
		},

		render: function() {
			return this;
		},

		gameStarted: function() {
			this.$el.empty();
		},

		gameEnded: function(result) {
			var message = (result == 'win' ? 'You won!' : 'No more sets are possible.');
			this.$el.html(this.template({
				result: message
			}));
		},

		resetGame: function() {
			this.game.start(this.game.settings.get('mode'));
		}
	});

})(Backbone.View, window.Router, window.Views.Menubar);
