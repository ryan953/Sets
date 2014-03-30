define([
	'handlebars',
	'thorax',
	'hbs!../templates/end-game'
], function(Handlebars, Thorax, template) {
	"use strict";

	return Thorax.View.extend({
		tagName: 'div',
		className: 'views-endgame',
		template: template,

		gameResult: null,

		'message': function (result) {
			return new Handlebars.SafeString({
				win: 'You won!',
				lose: 'No more sets are possible.'
			}[result] || '');
		},

		events: {
			'click .game-reset': function() {
				this.gameResult = null;
				this.model.start(this.model.settings.get('mode'));
				this.render();
			},
			model: {
				'game:start': function() {
					this.gameResult = null;
					this.render();
				},
				'game:end': function(result) {
					this.gameResult = result;
					this.render();
				}
			},
		}
	});

});