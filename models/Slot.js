/*globals _ Backbone */
window.Models = window.Models || {};

window.Models.Slot = (function(Card) {
	"use strict";

	return Backbone.Model.extend({
		defaults: {
			card: null,

			// Add style when True
			is_selected: false, // Blue border: from user
			is_invalid_trio: false, // Red border: on third selection
			is_valid_trio: false, // Green border: on third selection

			// Add style when False
			is_possible: true, // null when unknown
			is_possible_revealed: false
		},

		initialize: function() {
			this.on('change:is_possible', function(model, value) {
				if (value) {
					// setting is_possible to true, must not be faded
					this.set({is_possible_revealed: false});
				} else {
					// slot is not possible to make a set with
					// leave it faded if it is, or solid if not
				}
			});
		},

		toJSON: function() {
			var attrs = _.clone(this.attributes);
			attrs.card = attrs.card.toJSON();
			return attrs;
		},

		placeCard: function(card) {
			this.set({card: card});
			this.collection.trigger('card:add', this);
		},

		isEmpty: function() {
			return _.isEmpty(this.get('card'));
		},

		setInvalid: function(state) {
			if (state) {
				this.set({
					is_selected: false,
					is_invalid_trio: true
				});
				_.delay(_.bind(this.setInvalid, this), 250, false);
			} else {
				// If something is part of an invalid selection,
				// allow setting is_selected=false before this is called via a timeout
				this.set({is_invalid_trio: false});
			}
		},

		setMatched: function(state) {
			this.set({
				is_selected: false,
				is_valid_trio: state
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
		},

		setIsPossible: function(state) {
			this.set({ is_possible: state }, {silent: true});
			this.trigger('change:is_possible', this);
			this.trigger('change', this);
		},

		delayReveal: function() {
			// do fancier stuff
			this.set({is_possible_revealed: true});
		},

		resetPossibility: function() {
			this.set({
				is_possible: true
			}, {silent: true});
		}
	});

}(window.Models.Card));
