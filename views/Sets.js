/*global Backbone document */
window.Views = window.Views || {};

window.Views.Sets = (function(Parent, Board, Chrome) {
	"use strict";

	return Parent.extend({
		tagName: 'div',
		className: 'sets-game',

		initialize: function() {
			this.game = this.options.game;
		},

		render: function() {
			this.removeChild();

			this.chrome = new Chrome({
				game: this.game
			}).render();
			this.$el.append(this.chrome.el);

			this.boardView = new Board({
				board: this.game.board
			}).render();
			this.$el.append(this.boardView.el);

			return this;
		},

		removeChild: function() {
			if (this.chromeView) {
				this.chromeView.remove();
				delete this.chromeView;
			}
			if (this.boardView) {
				this.boardView.remove();
				delete this.boardView;
			}
			this.$el.empty();
		}
	});

})(Backbone.View, window.Views.Board, window.Views.Chrome);
