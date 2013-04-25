/*global _, Backbone */
window.Models = window.Models || {};

window.Models.Slot = (function(Parent) {
	"use strict";

	var MICRO_TO_SECOND_FACTOR = 1000;
	var FOUND_ZOOM_ANIMATION_TIME = 1 * MICRO_TO_SECOND_FACTOR;
	var INVALID_WIGGLE_ANIMATION_TIME = 0.25 * MICRO_TO_SECOND_FACTOR;

	return Parent.extend({
		defaults: {
			card: null,

			// Add style when value is True
			is_selected: false, // Blue border: from user
			is_invalid_trio: false, // Red border: on third selection
			is_valid_trio: false, // Green border: on third selection

			// Add style when value is False
			is_possible: true, // null when unknown
			is_possible_revealed: false
		},

		initialize: function(attrs, options) {
			this.on('change:is_possible', this.resetRevealedStatus, this);
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
				_.delay(_.bind(this.setInvalid, this), INVALID_WIGGLE_ANIMATION_TIME, false);
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
				_.delay(_.bind(this.setMatched, this), FOUND_ZOOM_ANIMATION_TIME, false);
			} else {
				this.set({card: null});
				this.collection.trigger('card:removed', this);
			}
		},

		toggleSelect: function() {
			this.set({
				is_selected: !this.get('is_selected')
			});
		},

		resetRevealedStatus: function(model, value) {
			if (value) {
				// set is_possible to true, must not be faded
				model._clearRevealTimer();
				model.set({is_possible_revealed: false});
			} else {
				// slot is not possible to make a set with
				// leave it faded if it is, or solid if not
			}
		},

		delayReveal: function(seconds) {
			this._clearRevealTimer();
			this._revealTimer = _.delay(function(model) {
				model.set({is_possible_revealed: true});
			}, seconds, this);
		},

		_clearRevealTimer: function() {
			if (this._revealTimer) {
				clearTimeout(this._revealTimer);
				delete this._revealTimer;
			}
		}
	});

})(Backbone.Model);
