/*globals Backbone */
window.Collections = window.Collections || {};

window.Collections.Deck = (function(Card) {
	"use strict";

	return Backbone.Collection.extend({
		model: Card,

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

		rebuild: function(mode) {
			mode = mode || 'easy';
			var cards = [];
			Card.counts.forEach(function(num) {
				Card.shapes.forEach(function(shape) {
					Card.colors.forEach(function(color) {
						if (mode == 'easy') {
							cards.push({
								num: num,
								shape: shape,
								color: color
							});
						} else {
							Card.fills.forEach(function(shade) {
								cards.push({
									num: num,
									shape: shape,
									color: color,
									shade: shade
								});
							});
						}
					});
				});
			});
			this.reset(cards);
		}
	});

})(window.Models.Card);
