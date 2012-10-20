/*global document $ _ Backbone */
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

			this.template = _.template($('#tmpl-sets-view').text());
		},

		render: function() {
			this.$el.html(this.template());

			return this;
		},

		gameStarted: function() {
			this.$('.popup').addClass('hide');
		},

		gameEnded: function(result) {
			result = (result == 'win' ? 'win' : 'lose');
			var selector = '#game-over-' + result;
			this.$(selector).removeClass('hide');
		},

		resetGame: function() {
			this.game.start(this.game.settings.get('mode'));
		}
	});

})(Backbone.View, window.Router, window.Views.Menubar);
