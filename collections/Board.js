/*global Backbone */
window.Collections = window.Collections || {};

window.Collections.Board = (function(Slot) {
	"use strict";

	return Backbone.Collection.extend({
		model: Slot,

		has_interaction: false,
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
				this.has_interaction = true;
				if (value) {
					var selected = this.selected(),
						cardJson = this.getCardJson(selected);
					if (this.constructor.isASet(cardJson)) {
						_.defer(_.bind(this.trigger, this,
							'selected:valid-set', selected));
					} else if (selected.length === 3) {
						_.defer(_.bind(this.trigger, this,
							'selected:invalid-set', selected));
					}
				}
			});

			this.on('selected:valid-set', function(slots) {
				_.each(slots, function(slot) {
					slot.setMatched(true);
				});
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

			this.on('reset:not_possible', this.revealNotPossible, this);
		},

		bindToMatcher: function(matcher) {
			var board = this;
			this.listenTo(matcher, 'reset:not_possible', this.revealNotPossible);
			this.on('selected:valid-set', function() {
				matcher.resetNotPossibleSlots(this);
			});
			this.on('change:is_selected', function(model, value) {
				matcher.resetNotPossibleSlots(this);
			});

			matcher.listenTo(this, 'filled:slots', matcher.resetNotPossibleSlots);
		},

		unbindFromMatcher: function(matcher) {
			this.stopListening(matcher);
			matcher.stopListening(this);
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
			this.has_interaction = false;
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

		revealNotPossible: function(board) {
			var notPossible = this.where({
				is_possible: false
			});

			if (notPossible.length == this.length &&
			this.selected().length === 0) {
				this.trigger('none_possible');
			} else {
				notPossible = _.shuffle(this.where({
					is_possible: false,
					is_possible_revealed: false
				}));
				_.each(notPossible, function(slot, index) {
					slot.delayReveal(slot.delayFromPosition(index));
				});
			}
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
