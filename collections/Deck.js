/*globals Backbone */
window.Collections = window.Collections || {};

window.Collections.Deck = (function(Card) {
	"use strict";

	var modes = {
		NORMAL: 'normal',
		EASY: 'easy',
		TEST: 'test',
		UNPOSSIBLE: 'unpossible'
	};

	return Backbone.Collection.extend({
		model: Card,

		startingLength: 0,

		hasCards: function() {
			return this.length > 0;
		},

		drawCard: function(position) {
			var card = this.at(position || 0);
			this.remove(card);
			return card;
		},

		drawRandomCard: function() {
			return this.drawCard(
				Math.floor(Math.random()*this.length)
			);
		},

		reset: function(items) {
			this.startingLength = 0;
			if (items) {
				this.startingLength = items.length;
			}
			Backbone.Collection.prototype.reset.call(this, items);
		},

		rebuild: function(mode) {
			var cards = this.buildCards(mode);
			console.log('rebuild', cards);
			if (cards) {
				this.reset(cards);
			}
		},

		buildCards: function(mode) {
			if (!_.contains(_.values(modes), mode)) {
				return null;
			}

			var cards = [];
			Card.counts.forEach(function(num) {
				Card.shapes.forEach(function(shape) {
					if (mode == modes.TEST || mode == modes.UNPOSSIBLE) {
						cards.push({
							num: num,
							shape: shape
						});
					} else {
						Card.colors.forEach(function(color) {
							if (mode == modes.EASY) {
								cards.push({
									num: num,
									shape: shape,
									color: color
								});
							} else if (modes.NORMAL) {
								Card.fills.forEach(function(fill) {
									cards.push({
										num: num,
										shape: shape,
										color: color,
										fill: fill
									});
								});
							}
						});
					}
				});
			});

			if (mode == modes.UNPOSSIBLE) {
				cards.pop();
				cards.push({
					num: Card.counts.slice(-1),
					shape: Card.shapes.slice(-1),
					color: Card.colors.slice(-1),
					fill: Card.fills.slice(-1)
				});
			}
			return cards;
		}

	}, modes);

})(window.Models.Card);
