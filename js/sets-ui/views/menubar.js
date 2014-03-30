/*global confirm */

define([
	'thorax',
	'v!./scoreboard',
	'hbs!../templates/menubar'
], function(Thorax, Scoreboard, template) {
	"use strict";

	return Thorax.View.extend({
		tagName: 'div',
		className: 'views-menubar',

		template: template,

		events: {
			'click .game-reset': 'resetGame'
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
