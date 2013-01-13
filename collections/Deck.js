/*globals Backbone */
window.Collections = window.Collections || {};

window.Collections.Deck = (function(Card) {
	"use strict";

	var draw = {
		nextCard: function(position) {
			var card = this.at(position || 0);
			this.remove(card);
			return card;
		},

		randomCard: function() {
			return draw.nextCard.call(this, Math.floor(Math.random()*this.length));
		}
	};

	var strategies = {
		normal: {
			drawCard: draw.randomCard,
			buildCards: function() {
				var cards = [];
				Card.counts.forEach(function(num) {
					Card.shapes.forEach(function(shape) {
						Card.colors.forEach(function(color) {
							Card.fills.forEach(function(fill) {
								cards.push({
									num: num,
									shape: shape,
									color: color,
									fill: fill
								});
							});
						});
					});
				});
				return cards;
			}
		},
		easy: {
			drawCard: draw.randomCard,
			buildCards: function() {
				var cards = [];
				Card.counts.forEach(function(num) {
					Card.shapes.forEach(function(shape) {
						Card.colors.forEach(function(color) {
							cards.push({
								num: num,
								shape: shape,
								color: color
							});
						});
					});
				});
				return cards;
			}
		},
		test: {
			drawCard: draw.randomCard,
			buildCards: function() {
				var cards = [];
				Card.counts.forEach(function(num) {
					Card.shapes.forEach(function(shape) {
						cards.push({
							num: num,
							shape: shape
						});
					});
				});
				return cards;
			}
		},
		unpossible: {
			drawCard: draw.randomCard,
			buildCards: function() {
				var cards = strategies.test.buildCards();
				cards.pop();
				cards.push({
					num: Card.counts.slice(-1),
					shape: Card.shapes.slice(-1),
					color: Card.colors.slice(-1),
					fill: Card.fills.slice(-1)
				});
				return cards;
			}
		},
		oneSetExpandFail: {
			drawCard: draw.nextCard,
			buildCards: function() {
				var cards = strategies.normal.buildCards(),
					indexes = [
						6, 16, 26,
						0,  4, 12,
						43, 20, 22,
						40, 41, 44,
						30, 31, 32
					];
				return _.map(indexes, function(index) {
					return cards[index];
				});
			}
		},
		expandstillFails: {
			drawCard: draw.nextCard,
			buildCards: function() {
				var cards = strategies.normal.buildCards(),
					indexes = [
						0,  4, 12,
						43, 20, 22,
						40, 41, 44,
						30, 31, 33,
						6, 16, 28
					];
				return _.map(indexes, function(index) {
					return cards[index];
				});
			}
		}
	};

	var modes = {
		NORMAL: 'normal',
		EASY: 'easy',
		TEST: 'test',
		UNPOSSIBLE: 'unpossible',
		oneSetExpandFail: 'oneSetExpandFail',
		expandstillFails: 'expandstillFails'
	};

	return Backbone.Collection.extend({
		model: Card,

		startingLength: 0,

		hasCards: function() {
			return this.length > 0;
		},

		drawCard: function() {
			if (!_.contains(_.values(modes), this._mode)) {
				console.error('Mode not found:', mode);
				return null;
			}
			return strategies[this._mode].drawCard.call(this);
		},

		reset: function(items) {
			this.startingLength = (items ? items.length : 0);
			Backbone.Collection.prototype.reset.call(this, items);
		},

		rebuild: function(mode) {
			if (!_.contains(_.values(modes), mode)) {
				console.error('Mode not found:', mode);
				return null;
			}
			this._mode = mode;
			this.buildCards();
		},

		buildCards: function() {
			var cards = strategies[this._mode].buildCards.call(this);
			if (cards) {
				this.reset(cards);
			}
		}

	}, modes);

})(window.Models.Card);
