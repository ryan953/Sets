/*globals _, Backbone */

window.Sets = (function(Deck, Board) {
	"use strict";

	var propCounter = function(field) {
			return function(prev, curr) {
				prev[curr[field]] = (curr[field] in prev ? prev[curr[field]] + 1 : 1);
				return prev;
			};
		},
		selectedCards = function(list) {
			return list.filter(function(card) { return card.isSelected; });
		},
		notSelectedCards = function(list) {
			return list.filter(function(card) { return !card.isSelected; });
		},
		unmatchedCards = function(list) {
			return list.filter(function(card) { return !card.hasSet; });
		};

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

	}, {
		isASet: function(cards) {
			if (cards.length !== 3 ) { return false; }

			var totals = {
				counts: _.reduce(cards, propCounter('count'), {}),
				shapes: _.reduce(cards, propCounter('shape'), {}),
				fills: _.reduce(cards, propCounter('fill'), {}),
				colors: _.reduce(cards, propCounter('color'), {})
			};

			this.lastErrors = [];

			for(var field in totals) {
				if (totals.hasOwnProperty(field)) {
					for(var val in totals[field]) {
						if (totals[field].hasOwnProperty(val)) {
							if (totals[field][val] != 1 && totals[field][val] != 3) {
								this.lastErrors.push({
									field:field,
									val:val,
									count:totals[field][val]
								});
							}
						}
					}
				}
			}
			return this.lastErrors.length === 0;
		},
		listNotPossibleCards: function(board) {
			_.each(board, function(card) {
				card.hasSet = false;
			});
			var known_unmatched = unmatchedCards(board),
				selected = selectedCards(board),
				set1 = board, set2 = board, set3 = board;

			if (board.length < 3) {
				return board;
			} else if (board.length == 3) {
				return (this.isASet(board) ? [] : board);
			}

			if (selected.length == 1) {
				set1 = [selected[0]];
			} else if(selected.length == 2) {
				set1 = [selected[0]];
				set2 = [selected[1]];
			}

			_.each(set1, function(card1) {
				_.each(set2, function(card2) {
					if (card2 == card1) { return; }
					_.each(set3, function(card3) {
						if (card1 == card3 || card2 == card3) { return; }
						if ( this.isASet([card1, card2, card3]) ) {
							card1.hasSet = card2.hasSet = card3.hasSet = true;
						}
					});
				});
			});
			return notSelectedCards(unmatchedCards(board));
		}

	});
}(window.Collections.Deck, window.Collections.Board));
