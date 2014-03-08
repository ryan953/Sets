define([
	'jquery',
	'underscore',
	'backbone',
	'hbs!../templates/end-game'
], function($, _, Backbone, template) {
	"use strict";

	return Backbone.View.extend({
		tagName: 'div',
		className: 'views-endgame',

		template: template,

		events: {
			'click .game-reset': 'resetGame'
		},

		initialize: function(options) {
			this.game = options.game;
			this.listenTo(this.game, 'game:start', options.gameStarted);
			this.listenTo(this.game, 'game:end', options.gameEnded);

			// this.template = _.template($('#tmpl-game-over').text());
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
