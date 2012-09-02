/*globals Backbone */
window.Collections = window.Collections || {};

window.Collections.Deck = (function(Card) {
	"use strict";

	var modes = {
		NORMAL: 'normal',
		EASY: 'easy'
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
			if (_.indexOf(_.values(modes), mode) === -1) {
				this.reset();
				return;
			}
			var cards = [];
			Card.counts.forEach(function(num) {
				Card.shapes.forEach(function(shape) {
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
				});
			});
			this.reset(cards);
		}
	}, modes);

})(window.Models.Card);
