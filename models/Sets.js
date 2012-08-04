/*globals _, Backbone */

window.Sets = (function(Deck, Board) {
	"use strict";

	return Backbone.Model.extend({
		initialize: function() {
			this.on('game:start', function(mode) {
				this.set({mode: mode});

				this.board.drawCards(this.deck);
			});

			this.on('change:mode', function(model, mode) {
				var baseSize = {rows: 4, cols: 3};
				if (mode == 'easy') {
					baseSize = {rows: 3, cols: 3};
				}
				this.baseSize = baseSize;
				this.set(baseSize);

				this.deck = Deck.factory(mode);
				this.board = Board.factory(baseSize.rows, baseSize.cols);
			});
		},

		start: function(mode) {
			this.trigger('game:start', mode);
		}

	});
}(window.Collections.Deck, window.Collections.Board));
