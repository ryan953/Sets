/*global confirm, $ _ Backbone document */
window.Views = window.Views || {};

window.Views.HelpLightbox = (function(Parent, helpModel, BoardView) {
	"use strict";

	return Parent.extend({
		events: {},

		initialize: function() {
			this.template = _.template($('#tmpl-howToPlay').text());

			this.model = helpModel.factory();

			this.listenTo(this.model, 'change:page', this.render);

			this.boardView = new BoardView({
				settings: this.model.teachingSettings,
				board: this.model.board
			});
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));

			this.boardView.render();

			this.$('.board-placeholder').html(this.boardView.$el);

			this.afterRender();
			return this;
		}
	});

})(window.Views.Bases.LightboxView, window.Models.HelpGame, window.Views.Board);
