define('lightbox/help', [
	'./base',
	'game/models/help-game',
	'v!game/views/board',
	'hbs!./templates/how-to-play'
], function(Parent, helpModel, BoardView, template) {
	"use strict";

	return Parent.extend({
		template: template,
		
		events: {
			'click #help-reset': function() {
				this.model.reset();
			},
			model: {
				'change:page': 'render'
			}
		},

		initialize: function() {
			this.model = helpModel.factory();

			this.boardView = new BoardView({
				settings: this.model.teachingSettings,
				board: this.model.board
			});
			this.boardView.$el.css({
				height: '182px'
			});
		},

		context: function() {
			var data = this.model.toJSON();
			return {
				boardView: this.boardView,
				page1: (data.page === 1),
				page2: (data.page === 2),
				page3: (data.page === 3),
				page4: (data.page === 4),
				page5: (data.page === 5),
				showBoard: (data.page !== 5)
			};
		}
	});

});
