/*globals Backbone */
window.Collections = window.Collections || {};

window.Collections.Board = (function(Slot) {
	"use strict";

	return Backbone.Collection.extend({
		model: Slot,

		boardSize: {rows: 0, cols: 0},

		toJSON: function() {
			var attrs = Backbone.Collection.prototype.toJSON.call(this);
			attrs.boardSize = _.clone(this.boardSize);
			return attrs;
		},

		getCardJson: function(slots) {
			return _.map(slots, function(slot) {
				var card = slot.get('card');
				if (card) {
					return card.toJSON();
				}
			});
		},

		initialize: function(models, options) {
			this.deck = options.deck;

			this.on('change:is_selected', function(model, value) {
				if (value) {
					var selected = this.selected(),
						cardJson = this.getCardJson(selected);
					if (this.constructor.isASet(cardJson)) {
						_.defer(_.bind(this.trigger, this,
							'selected:valid-set', selected));
					} else if (selected.length === 3) {
						_.defer(_.bind(this.trigger, this,
							'selected:invalid-set', selected));
					} else {
						this.resetNotPossibleSlots();
					}
				} else {
					this.resetNotPossibleSlots();
				}
			});

			this.on('selected:valid-set', function(slots) {
				_.each(slots, function(slot) {
					slot.setMatched(true);
				});
				this.resetNotPossibleSlots();
			});

			this.on('selected:invalid-set', function(slots) {
				_.each(slots, function(slot) {
					slot.setInvalid(true);
				});
			});

			this.on('card:add', function() {
				if (this.emptySlots().length === 0 || !this.deck.hasCards()) {
					this.trigger('filled:slots', this);
				}
			});

			this.on('card:removed', function(slot) {
				slot.placeCard(this.deck.drawRandomCard());
			});

			this.on('filled:slots', function(board) {
				this.resetNotPossibleSlots();
			});

			this.on('reset:not_possible', function(board) {
				var is_possible = board.pluck('is_possible');
				var selected = board.where({is_selected:true});

				console.group(_.map(selected, function(slot) {
					return slot.toJSON();
				}));
				console.log(is_possible.slice(0, 3));
				console.log(is_possible.slice(3, 6));
				console.log(is_possible.slice(6));
				console.groupEnd();
			});

			this.on('reset:not_possible', function(board) {
				var notPossible = _.shuffle(this.notPossible());
				_.each(notPossible, function(slot, index) {
					slot.delayReveal((index + 1) * 3);
				});
			});
		},

		selected: function() {
			return this.where({is_selected: true});
		},

		notPossible: function() {
			return this.where({is_possible: false});
		},

		emptySlots: function() {
			return this.filter(function(slot) {
				return slot.isEmpty();
			});
		},

		drawCards: function(deck) {
			this.each(function(slot) {
				if (slot.isEmpty() && deck.hasCards()) {
					slot.placeCard(deck.drawRandomCard());
				}
			});
		},

		rebuild: function(rows, cols) {
			var slots = [];
			for (var i = 0; i < rows * cols; i++) {
				slots.push(new Slot());
			}
			this.reset(slots);
		},

		resetPossibilities: function() {
			this.each(function(slot) {
				slot.resetPossibility();
			});
		},

		resetNotPossibleSlots: function() {
			var isASet = _.bind(this.constructor.isASet, this.constructor),
				getCardJson = _.bind(this.getCardJson, this),
				selected = this.selected(),
				board1 = this.models,
				board2 = this.models,
				board3 = this.models;

			// Escape hatch for short lists
			if (this.length < 3) {
				this.each(function(slot) {
					slot.setIsPossible(false);
				});
				return;
			} else if (this.length === 3) {
				var cardJson = getCardJson(this.models);
				if (!isASet(cardJson)) {
					this.each(function(slot) {
						slot.setIsPossible(false);
					});
				}
				return;
			}

			// Prep for having some already selected
			if (selected.length === 1) {
				board1 = [selected[0]];
			} else if(selected.length === 2) {
				board1 = [selected[0]];
				board2 = [selected[1]];
			}

			_.each(board1, function(slot1) {
				_.each(board2, function(slot2) {
					if (slot1 === slot2) { return; }
					_.each(board3, function(slot3) {
						if (slot1 === slot3 || slot2 === slot3) { return; }
						var slots = [slot1, slot2, slot3],
							json_cards = getCardJson(slots);
						if (isASet(json_cards)) {
							_.each(slots, function(slot) {
								slot.hasSet = true;
							});
						}
					});
				});
			});

			this.each(function(slot) {
				slot.setIsPossible(!!slot.hasSet);
				delete slot.hasSet;
			});

			this.trigger('reset:not_possible', this);
			return;
		}
	}, {
		_propCounter: function(field) {
			return function(prev, curr) {
				if (!prev || !curr) { return; }
				prev[curr[field]] = (curr[field] in prev ? prev[curr[field]] + 1 : 1);
				return prev;
			};
		},
		isASet: function(cards) {
			if (cards.length !== 3 ) { return false; }

			var totals = {
				counts: _.reduce(cards, this._propCounter('num'), {}),
				shapes: _.reduce(cards, this._propCounter('shape'), {}),
				fills: _.reduce(cards, this._propCounter('fill'), {}),
				colors: _.reduce(cards, this._propCounter('color'), {})
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
		}
	});

})(window.Models.Slot);
