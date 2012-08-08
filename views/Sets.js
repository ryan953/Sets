/*global Backbone document */
window.Views = window.Views || {};

window.Views.Sets = (function(Parent, Board, Chrome) {
	"use strict";

	return Parent.extend({
		tagName: 'div',
		className: 'sets-game',

		events: {},

		initialize: function() {
			this.game = this.options.game;
		},

		render: function() {
			this.removeChild();

			this.boardView = new Board({
				board: this.game.board
			}).render();
			this.$el.html(this.boardView.el);

			// window.chrome = new Views.Chrome({
			// 	game: this.game
			// });

			return this;
		},

		removeChild: function() {
			if (this.boardView) {
				this.boardView.remove();
				delete this.boardView;
			}
		}
	});

})(Backbone.View, window.Views.Board, window.Views.Chrome);
