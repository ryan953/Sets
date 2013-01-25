/*globals Backbone */
window.Collections = window.Collections || {};

window.Collections.Board = (function(Slot) {
	"use strict";

	return Backbone.Collection.extend({
		model: Slot,

		_boardSize: {rows: 0, cols: 0},

		boardSize: function() {
			return this._boardSize.rows * this._boardSize.cols;
		},

		toJSON: function() {
			var attrs = Backbone.Collection.prototype.toJSON.call(this);
			attrs.boardSize = _.clone(this._boardSize);
			return attrs;
		},

		getCardJson: function(slots) {
			return _.filter(_.map(slots, function(slot) {
				var card = slot.get('card');
				if (card) {
					return card.toJSON();
				}
			}), _.identity);
		},

		initialize: function(models, options) {
			this.deck = options.deck;
			this.settings = options.settings;

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
				var emptySlots = this.emptySlots();
				if (emptySlots.length != 3) {
					return;
				}
				if (this.length > this.boardSize()) {
					_.each(emptySlots, function(slot) {
						this.remove(slot);
					}, this);
				} else {
					_.each(emptySlots, function(slot) {
						slot.placeCard(this.deck.drawCard());
					}, this);
				}
			});

			this.on('filled:slots', function(board) {
				this.resetNotPossibleSlots();
			});

			this.on('reset:not_possible', function(board) {
				var notPossible = this.where({
					is_possible: false
				});

				if (notPossible.length == this.length &&
				this.selected().length === 0) {
					this.trigger('none_possible');
				} else {
					this.revealNotPossible();
				}
			});
		},

		selected: function() {
			return this.where({is_selected: true});
		},

		emptySlots: function() {
			return this.filter(function(slot) {
				return slot.isEmpty();
			});
		},

		drawCards: function() {
			this.each(function(slot) {
				if (slot.isEmpty() && this.deck.hasCards()) {
					slot.placeCard(this.deck.drawCard());
				}
			}, this);
		},

		rebuild: function(rows, cols) {
			var slots = [];
			_.times(rows * cols, function() {
				slots.push(new Slot(null, {
					settings: this.settings
				}));
			}, this);
			this._boardSize = {
				rows: rows,
				cols: cols
			};
			this.reset(slots);
		},

		canExpand: function() {
			return (this.deck.length >= 3);
		},

		expand: function() {
			if (!this.canExpand()) {
				return;
			}
			this.add(_.map(_.range(3), function() {
				return new Slot(null, {
					settings: this.settings
				});
			}, this));
		},

		revealNotPossible: function() {
			var notPossible = _.shuffle(this.where({
				is_possible: false,
				is_possible_revealed: false
			}));
			_.each(notPossible, function(slot, index) {
				slot.delayReveal(slot.delayFromPosition(index));
			});
		},

		resetNotPossibleSlots: function() {
			var isASet = _.bind(this.constructor.isASet, this.constructor),
				getCardJson = _.bind(this.getCardJson, this),
				selected = this.selected(),
				board1 = this.models,
				board2 = this.models,
				board3 = this.models,
				jsonCards = getCardJson(this.models);

			// Escape hatch for short lists
			if (jsonCards.length < 3) {
				this.each(function(slot) {
					slot.set({is_possible: false});
				});
				return;
			} else if (jsonCards.length === 3) {
				if (!isASet(jsonCards)) {
					this.each(function(slot) {
						slot.set({is_possible: false});
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
							jsonCards = getCardJson(slots);
						if (isASet(jsonCards)) {
							_.each(slots, function(slot) {
								slot.hasSet = true;
							});
						}
					});
				});
			});

			this.each(function(slot) {
				slot.set({
					is_possible: (!!slot.hasSet),
					is_possible_revealed: false
				});
				delete slot.hasSet;
			});

			this.trigger('reset:not_possible', this);
			return;
		}
	}, {
		_propCounter: function(field) {
			return function(prev, curr) {
				prev[curr[field]] = (curr[field] in prev ? prev[curr[field]] + 1 : 1);
				return prev;
			};
		},
		isASet: function(cards) {
			if (cards.length !== 3 ) {
				return false;
			}

			var totals = {
				counts: _.reduce(cards, this._propCounter('num'), {}),
				shapes: _.reduce(cards, this._propCounter('shape'), {}),
				fills: _.reduce(cards, this._propCounter('fill'), {}),
				colors: _.reduce(cards, this._propCounter('color'), {})
			};

			for(var field in totals) {
				if (totals.hasOwnProperty(field)) {
					for(var val in totals[field]) {
						if (totals[field].hasOwnProperty(val)) {
							if (totals[field][val] != 1 && totals[field][val] != 3) {
								return false;
							}
						}
					}
				}
			}
			return true;
		}
	});

})(window.Models.Slot);
