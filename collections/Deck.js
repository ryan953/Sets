/*global console */

define('collections/deck', [
	'underscore',
	'backbone',
	'models/card'
], function(_, Backbone, Card) {
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

	var buildDeckByIndex = function(indexes) {
		return function() {
			var cards = strategies.normal.buildCards();
			return _.map(indexes, function(index) {
				return cards[index];
			});
		};
	};

	var strategies = {
		normal: {
			baseSize: {rows: 4, cols: 3},
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
			baseSize: {rows: 3, cols: 3},
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
		sorted: {
			baseSize: {rows: 4, cols: 3},
			drawCard: draw.nextCard,
			buildCards: function() {
				return strategies.normal.buildCards();
			}
		},
		test: {
			baseSize: {rows: 2, cols: 3},
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
		teaching: {
			baseSize: {rows: 1, cols: 3},
			drawCard: draw.nextCard,
			buildCards: buildDeckByIndex([
				29, 29, 29,
				// red diamond stripe, 2
				// red diamond stripe, 2
				// red diamond stripe, 2

				0, 3, 6,
				// red diamond, solid 1
				// green diamond solid 1
				// blue diamond solid 1

				1, 13, 25,
				// red diamond empty 1
				// green squiggle empty 1
				// blue pill empty 1

				74, 4, 42
				// red pill stripe 3
				// green diamond empty 1
				// blue squiggle solid 2

			])
		},
		unpossible: {
			baseSize: {rows: 2, cols: 3},
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
			baseSize: {rows: 3, cols: 3},
			drawCard: draw.nextCard,
			buildCards: buildDeckByIndex([
				6, 16, 26,
				0,  4, 12,
				43, 20, 22,
				40, 41, 44,
				30, 31, 32
			])
		},
		expandStillFails: {
			baseSize: {rows: 3, cols: 3},
			drawCard: draw.nextCard,
			buildCards: buildDeckByIndex([
				0,  4, 12,
				43, 20, 22,
				40, 41, 44,
				30, 31, 33,
				6, 16, 28
			])
		}
	};

	var modes = {
		NORMAL: 'normal',
		EASY: 'easy',
		SORTED: 'sorted',
		TEST: 'test',
		TEACHING: 'teaching',
		UNPOSSIBLE: 'unpossible',
		oneSetExpandFail: 'oneSetExpandFail',
		expandstillFails: 'expandStillFails'
	};

	return Backbone.Collection.extend({
		model: Card,

		startingLength: 0,

		getBoardSize: function(mode) {
			if (!_.contains(_.values(modes), mode)) {
				console.error('Mode not found:', mode);
				return null;
			}
			return strategies[mode].baseSize;
		},

		hasCards: function() {
			return this.length > 0;
		},

		drawCard: function() {
			if (!_.contains(_.values(modes), this._mode)) {
				console.error('Mode not found:', this._mode);
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

});
