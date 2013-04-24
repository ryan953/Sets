/*global _, Backbone */

window.Matcher = (function(Parent, Board) {
	"use strict";

	return Parent.extend({
		initialize: function(models, options) {
			this.settings = options.settings;
		},

		resetNotPossibleSlots: function(board) {
			if (this.settings.get('help') != 'on') {
				return;
			}

			var isASet = _.bind(Board.isASet, Board),
				getCardJson = _.bind(board.getCardJson, board),
				selected = board.selected(),
				board1 = board.models,
				board2 = board.models,
				board3 = board.models,
				jsonCards = getCardJson(board.models);

			// Escape hatch for short lists
			if (jsonCards.length < 3) {
				board.each(function(slot) {
					slot.set({is_possible: false});
				});
				return;
			} else if (jsonCards.length === 3) {
				if (!isASet(jsonCards)) {
					board.each(function(slot) {
						slot.set({is_possible: false});
					});
				}
				return;
			}

			// Prep for having some already selected
			if (selected.length === 1) {
				board1 = [selected[0]];
			} else if(selected.length === 2) {
				board1 = [selected[0]];
				board2 = [selected[1]];
			}

			_.each(board1, function(slot1) {
				_.each(board2, function(slot2) {
					if (slot1 === slot2) { return; }
					_.each(board3, function(slot3) {
						if (slot1 === slot3 || slot2 === slot3) { return; }
						var slots = [slot1, slot2, slot3],
							jsonCards = getCardJson(slots);
						if (isASet(jsonCards)) {
							_.each(slots, function(slot) {
								slot.hasSet = true;
							});
						}
					});
				});
			});

			board.each(function(slot) {
				slot.set({
					is_possible: (!!slot.hasSet)
				});
				delete slot.hasSet;
			});

			this.trigger('reset:not_possible', this);
			return;
		}
	});
})(window.Backbone.Model, window.Collections.Board);
