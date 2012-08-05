/*globals _, Backbone */

window.Sets = (function(Deck, Board) {
	"use strict";

	return Backbone.Model.extend({
		initialize: function() {
			this.on('game:start', function(mode) {
				var baseSize = this.getBaseSize(mode);

				this.deck = Deck.factory(mode);
				this.board = Board.factory(
					this.deck,
					baseSize.rows,
					baseSize.cols
				);

				this.set({
					mode: mode,
					rows: baseSize.rows,
					cols: baseSize.cols
				});

				this.board.drawCards(this.deck);
			});
		},

		start: function(mode) {
			this.trigger('game:start', mode);
		},

		getBaseSize: function(mode) {
			if (mode == 'easy') {
				return {rows: 3, cols: 3};
			}
			return {rows: 4, cols: 3};
		}

	});
}(window.Collections.Deck, window.Collections.Board));
