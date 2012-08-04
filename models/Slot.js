/*globals Backbone */
window.Models = window.Models || {};

window.Models.Slot = (function(Card) {
	"use strict";

	return Backbone.Model.extend({
		defaults: {
			'card': null,

			'is_selected': false,
			'possible': null,
			'invalid': null
		},

		isInvalid: function(state) {
			this.set({
				is_selected: false,
				is_invalid: state
			});
			if (state) {
				_.delay(_.bind(this.isInvalid, this), 1000, false);
			}
		},

		revealCard: function(card) {
			this.set({card: card});
		},

		isEmpty: function() {
			return _.isEmpty(this.get('card'));
		},

		toggleSelect: function() {
			this.set({
				is_selected: !this.get('is_selected')
			});
		}
	});

}(window.Models.Card));
