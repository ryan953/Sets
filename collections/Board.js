/*globals Backbone */
window.Collections = window.Collections || {};

window.Collections.Board = (function(Slot) {
	"use strict";

	return Backbone.Collection.extend({
		model: Slot,

		drawCards: function(deck) {
			this.each(function(slot) {
				if (slot.isEmpty() && deck.hasCards()) {
					var card = deck.drawRandomCard();
					slot.revealCard(card);
				}
			});
		}
	}, {
		factory: function(rows, cols) {
			var board = new this();
			for (var row = 0; row < rows; row++) {
				for (var col = 0; col < cols; col++) {
					board.add(new Slot());
				}
			}
			return board;
		}
	});

})(window.Models.Slot);
