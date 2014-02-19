define('views/help-lightbox', [
	'jquery',
	'underscore',
	'views/bases/lightbox-view',
	'models/help-game',
	'views/board'
], function($, _, Parent, helpModel, BoardView) {
	"use strict";

	return Parent.extend({
		events: {
			'click #help-reset': 'resetHelp'
		},

		initialize: function() {
			this.template = _.template($('#tmpl-howToPlay').text());

			this.model = helpModel.factory();

			this.listenTo(this.model, 'change:page', this.renderPage);

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
		},

		renderPage: function(model, page) {
			this.$('.page').hide().eq(page-1).show();
		},

		resetHelp: function(/* e */) {
			this.model.reset();
		}
	});

});
