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
		}
	}, {
		factory: function(mode) {
			mode = mode || 'easy';
			var deck = new this(),
				props = {};
			Card.counts.forEach(function(num) {
				props.num = num;
				Card.shapes.forEach(function(shape) {
					props.shape = shape;
					Card.colors.forEach(function(color) {
						props.color = color;
						if (mode == 'easy') {
							deck.add(props);
						} else {
							Card.fills.forEach(function(shade) {
								deck.add(props);
							});
						}
					});
				});
			});
			return deck;
		}
	});

})(window.Models.Card);
