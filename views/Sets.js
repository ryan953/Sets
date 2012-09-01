/*global document _ */
window.Views = window.Views || {};

window.Views.Sets = (function(Parent, BoardView, Chrome) {
	"use strict";

	return Parent.extend({
		tagName: 'div',
		className: 'sets-game',

		initialize: function() {
			this.game = this.options.game;
		},

		renderChildren: function() {
			var children = {};
			children.chrome = new Chrome({
				game: this.game
			}).render();

			children.boardView = new BoardView({
				board: this.game.board
			}).render();

			this.$el.append(_.pluck(children, 'el'));

			return children;
		}
	});

})(window.Views.Bases.ParentView, window.Views.Board, window.Views.Chrome);