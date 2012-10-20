/*global document _ */
window.Views = window.Views || {};

window.Views.Sets = (function(Parent, BoardView, Chrome, EndGame) {
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

			children.endGameView = new EndGame({
				game: this.game
			}).render();

			this.$el.append(_.pluck(children, 'el'));

			return children;
		}
	});

})(window.Views.Bases.ParentView, window.Views.Board, window.Views.Chrome, window.Views.EndGame);