/*global Backbone Card */

window.Collections = window.Collections || {};
window.Collections.Deck = (function(Collection, Card) {
	"use strict";
	var Deck = Collection.Deck = Backbone.Collection.extend({
		model: Card
	});

	Deck.factory = function(mode) {
		mode = mode || 'easy';
		var deck = new Deck();
		var props = {};
		Card.counts.forEach(function(num) {
			props.num = num;
			Card.shapes.forEach(function(symbol) {
				props.symbol = symbol;
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
	};
})(window.Models.Card);