/*globals Backbone */
window.Collections = window.Collections || {};

window.Collections.Board = (function(Slot) {
	"use strict";

	var propCounter = function(field) {
			return function(prev, curr) {
				prev[curr[field]] = (curr[field] in prev ? prev[curr[field]] + 1 : 1);
				return prev;
			};
		},
		selectedCards = function(list) {
			return _.filter(list, function(card) { return card.is_selected; });
		},
		notSelectedCards = function(list) {
			return _.filter(list, function(card) { return !card.is_selected; });
		},
		unmatchedCards = function(list) {
			return _.filter(list, function(card) { return !card.hasSet; });
		};

	return Backbone.Collection.extend({
		model: Slot,

		boardSize: {rows: 0, cols: 0},

		toJSON: function() {
			var attrs = Backbone.Collection.prototype.toJSON.call(this);
			attrs.boardSize = _.clone(this.boardSize);
			return attrs;
		},

		initialize: function(models, options) {
			this.deck = options.deck;

			this.on('change:is_selected', function(model, value) {
				if (value) {
					var selected = this.selected();
					if (selected.length === 3) {
						var cardJSON = _.map(selected, function(slot) {
							return slot.get('card').toJSON();
						});
						if (this.constructor.isASet(cardJSON)) {
							_.defer(_.bind(this.trigger, this,
								'selected:valid-set', selected));
						} else {
							_.defer(_.bind(this.trigger, this,
								'selected:invalid-set', selected));
						}
					}
				}
			});

			this.on('selected:valid-set', function(slots) {
				_.each(slots, function(slot) {
					slot.isMatched(true);
				});
			});

			this.on('selected:invalid-set', function(slots) {
				_.each(slots, function(slot) {
					slot.isInvalid(true);
				});
			});

			this.on('card:removed', function(slot) {
				slot.revealCard(this.deck.drawRandomCard());
			});
		},

		selected: function() {
			return this.filter(function(slot) {
				return slot.get('is_selected');
			});
		},

		drawCards: function(deck) {
			this.each(function(slot) {
				if (slot.isEmpty() && deck.hasCards()) {
					slot.revealCard(deck.drawRandomCard());
				}
			});
		},

		rebuild: function(rows, cols) {
			var slots = [];
			for (var i = 0; i < rows * cols; i++) {
				slots.push(new Slot());
			}
			this.reset(slots);
			this.boardSize = {
				rows: rows,
				cols: cols
			};
		}
	}, {
		isASet: function(cards) {
			if (cards.length !== 3 ) { return false; }

			var totals = {
				counts: _.reduce(cards, propCounter('num'), {}),
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

})(window.Models.Slot);
