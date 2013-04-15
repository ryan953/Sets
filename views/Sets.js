/*global document, _, NoClickDelay */
/*jshint nonew:false */
window.Views = window.Views || {};

window.Views.Sets = (function(Parent, BoardView, Chrome, EndGame) {
	"use strict";

	return Parent.extend({
		tagName: 'div',
		className: 'sets-game',

		initialize: function() {
			var game = this.options.game;

			$(window).blur(
				_.bind(game.pause, game)
			).focus(
				_.bind(game.resume, game)
			);

			new NoClickDelay(this.el);
		},

		renderChildren: function() {
			var game = this.options.game,
				children = {};
			children.chrome = new Chrome({
				game: game
			}).render();

			children.boardView = new BoardView({
				settings: game.settings,
				board: game.board
			}).render();

			children.endGameView = new EndGame({
				game: game
			}).render();

			this.$el.append(_.pluck(children, 'el'));

			return children;
		}
	});

})(window.Views.Bases.ParentView, window.Views.Board, window.Views.Chrome, window.Views.EndGame);
