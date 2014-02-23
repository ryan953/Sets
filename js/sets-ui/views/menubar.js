/*global confirm */

define([
	'jquery',
	'underscore',
	'backbone',
	'./scoreboard'
], function($, _, Backbone, Scoreboard) {
	"use strict";

	return Backbone.View.extend({
		tagName: 'div',
		className: 'views-menubar',

		events: {
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

		resetGame: function() {
			if (this.game.board.has_interaction) {
				if (confirm('Are you sure you want to end this game?')) {
					this.game.start(this.game.settings.get('mode'));
				}
			} else {
				this.game.start(this.game.settings.get('mode'));
			}
		}
	});

});
