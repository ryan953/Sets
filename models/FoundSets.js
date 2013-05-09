/*global _, Backbone */

window.Models.FoundSets = (function(Parent) {
	"use strict";

	return Parent.extend({
		foundSets: [],

		bindToBoard: function(board) {
			this.stopListening();
			this.listenTo(board, 'selected:valid-set', this.recordFoundSet);
		},

		recordFoundSet: function(slots) {
			this.foundSets.push(_.map(slots, function(slot) {
				return slot.get('card');
			}));
			this.trigger('change');
		},

		getCount: function() {
			return this.foundSets.length * 3 || 0;
		},

		reset: function() {
			this.foundSets = [];
			this.trigger('change reset');
		}

	});
})(window.Backbone.Model);
