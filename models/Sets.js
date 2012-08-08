/*globals _, Backbone */

window.Sets = (function(Deck, Board) {
	"use strict";

	return Backbone.Model.extend({
		defaults: {
			mode: null,
			baseSize: {rows: 0, cols: 0}
		},

		toJSON: function() {
			var attrs = _.clone(this.attributes);
			attrs.deck = this.deck.toJSON();
			attrs.board = this.board.toJSON();
			return attrs;
		},

		initialize: function() {
			this.deck = new Deck();
			this.board = new Board(null, {deck: this.deck});

			this.on('game:start', function(mode) {
				var baseSize = this.getBaseSize(mode);

				this.deck.rebuild(mode);
				this.board.rebuild(
					baseSize.rows,
					baseSize.cols
				);
				this.set({
					mode: mode,
					baseSize: baseSize
				});

				this.board.drawCards(this.deck);
			});
		},

		start: function(mode) {
			this.trigger('game:start', mode);
		},

		getBaseSize: function(mode) {
			if (mode == Deck.EASY) {
				return {rows: 3, cols: 3};
			} else if (mode == 'normal') {
				return {rows: 4, cols: 3};
			}
			return {rows: 0, cols: 0};
		}

	});
}(window.Collections.Deck, window.Collections.Board));
