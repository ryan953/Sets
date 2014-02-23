define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone) {
	"use strict";

	return Backbone.View.extend({
		tagName: 'div',
		className: 'views-endgame',

		events: {
			'click .game-reset': 'resetGame'
		},

		initialize: function() {
			this.game = this.options.game;
			this.listenTo(this.game, 'game:start', this.gameStarted);
			this.listenTo(this.game, 'game:end', this.gameEnded);

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

});
