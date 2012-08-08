/*globals Backbone */
window.Models = window.Models || {};

window.Models.Slot = (function(Card) {
	"use strict";

	return Backbone.Model.extend({
		defaults: {
			'card': null,

			'is_selected': false,
			'is_possible': true,
			'is_invalid': false,
			'is_valid': false,
			'is_matched': false
		},

		revealCard: function(card) {
			this.set({card: card});
		},

		isEmpty: function() {
			return _.isEmpty(this.get('card'));
		},

		setInvalid: function(state) {

			if (state) {
				this.set({
					is_selected: false,
					is_invalid: true
				});
				_.delay(_.bind(this.setInvalid, this), 250, false);
			} else {
				// If something is part of an invalid selection, allow setting is_selected before this is called via a timeout
				this.set({is_invalid: false});
			}
		},

		setMatched: function(state) {
			this.set({
				is_selected: false,
				is_matched: state
			});
			if (state) {
				_.delay(_.bind(this.setMatched, this), 1000, false);
			} else {
				this.collection.trigger('card:removed', this);
			}
		},

		toggleSelect: function() {
			this.set({
				is_selected: !this.get('is_selected')
			});
		}
	});

}(window.Models.Card));
