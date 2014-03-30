/*global window */
/*jshint nonew:false */

define([
	'no-click-delay',
	'jquery',
	'underscore',
	'view',
	'game/views/board',
	'./chrome',
	'./end-game'
], function(NoClickDelay, $, _, Parent, BoardView, Chrome, EndGame) {
	"use strict";

	return Parent.extend({
		tagName: 'div',
		className: 'sets-game',

		initialize: function(options) {
			this.options = options;
			var game = options.game;

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

			var chrome = new Chrome({
				game: game
			});
			chrome.render();
			chrome.appendTo(this.$el);

			this.boardView = new BoardView({
				className: 'board theme-wood',
				settings: game.settings,
				board: game.board
			}).render();

			children.boardView = {
				'el': $('<div></div>', {
					'class': 'sets-board-container',
					html: this.boardView.el
				})[0]
			};

			children.endGameView = new EndGame({
				model: game
			});

			this.$el.append(_.pluck(children, 'el'));

			return children;
		}
	});

});
