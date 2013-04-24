/*global confirm, $ _ Backbone document */
window.Views = window.Views || {};

window.Views.HelpLightbox = (function(Parent, Card, CardView) {
	"use strict";

	return Parent.extend({
		events: {},

		initialize: function() {
			this.template = _.template($('#tmpl-howToPlay').text());
		},

		render: function() {
			this.$el.html(this.template());

			var teachingSettings = new Models.Settings({id: 'teaching'},
				{localStorage: new Backbone.LocalStorage('settings-teaching')}
			);
			var teachingDeck = new Deck();
			var board = new Board({
				deck: teachingDeck,
				settings: teachingSettings
			});
			var boardView = new BoardView({
				settings: teachingSettings,
				board: board
			}).render();

			deck.rebuild(mode);
			board.rebuild(
				baseSize.rows,
				baseSize.cols
			);
			board.drawCards(deck);

			this.$('.board-placeholder').html(boardView.$el);

			this.afterRender();
			return this;
		}
	});

})(window.Views.Bases.LightboxView, window.Models.Card, window.Views.Card);
