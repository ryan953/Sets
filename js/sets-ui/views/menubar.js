/*global confirm */

define([
	'jquery',
	'underscore',
	'backbone',
	'./scoreboard',
	'hbs!../templates/menubar'
], function($, _, Backbone, Scoreboard, template) {
	"use strict";

	return Backbone.View.extend({
		tagName: 'div',
		className: 'views-menubar',

		template: template,

		events: {
			'click .game-reset': 'resetGame'
		},

		initialize: function(options) {
			this.game = options.game;

			// this.template = _.template($('#tmpl-menu').text());
		},

		render: function() {
			this.$el.html(this.template());

			var scoreboard = new Scoreboard({
				model: this.game
			});
			scoreboard.render();
			this.$('.scoreboard-placeholder').append(scoreboard.el);

			return this;
		},

		resetGame: function() {
			if (this.game.board.hasInteraction) {
				if (confirm('Are you sure you want to end this game?')) {
					this.game.start(this.game.settings.get('mode'));
				}
			} else {
				this.game.start(this.game.settings.get('mode'));
			}
		}
	});

});
