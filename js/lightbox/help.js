define('lightbox/help', [
	'jquery',
	'underscore',
	'./base',
	'game/models/help-game',
	'game/views/board',
	'hbs!./templates/how-to-play'
], function($, _, Parent, helpModel, BoardView, template) {
	"use strict";

	return Parent.extend({
		template: template,
		
		events: {
			'click #help-reset': 'resetHelp'
		},

		initialize: function() {
			// this.template = _.template($('#tmpl-howToPlay').text());

			this.model = helpModel.factory();

			this.listenTo(this.model, 'change:page', this.renderPage);

			this.boardView = new BoardView({
				settings: this.model.teachingSettings,
				board: this.model.board
			});
		},

		render: function() {
			var data = this.model.toJSON();
			var context = data;
			context.page1 = (data.page == 1);
			context.page2 = (data.page == 2);
			context.page3 = (data.page == 3);
			context.page4 = (data.page == 4);
			context.page5 = (data.page == 5);
			context.showBoard = (data.page != 5);
			this.$el.html(this.template(context));

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
