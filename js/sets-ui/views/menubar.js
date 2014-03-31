/*global confirm */

define([
	'view',
	'v!./scoreboard',
	'hbs!../templates/menubar'
], function(View, Scoreboard, template) {
	"use strict";

	return View.extend({
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
