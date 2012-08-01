/*globals Backbone */
window.Models = window.Models || {};

window.Models.Slot = (function(Card) {
	"use strict";

	return Backbone.Model.extend({
		defaults: {
			'card': null
		},

		revealCard: function(card) {
			this.set({card: card});
		},

		isEmpty: function() {
			return _.isEmpty(this.get('card'));
		}
	});

}(window.Models.Card));
