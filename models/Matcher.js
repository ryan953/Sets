// (window.Backbone.Model, window.Collections.Board)

define('models/matcher', [
	'underscore',
	'backbone',
	'collections/board'
], function(_, Backbone, Board) {
	"use strict";

	var MICRO_TO_SECOND_FACTOR = 1000;

	return Backbone.Model.extend({
		initialize: function(models, options) {
			this.settings = options.settings;
		},

		bindToBoard: function(board) {
			this.stopListening();
			this.listenTo(board, 'selected:valid-set change:is_selected filled:slots', _.bind(function() {
				this.resetNotPossibleSlots(board);
				this.revealNotPossible(board);
			}, this));
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
		},

		revealNotPossible: function(board) {
			var notPossible = board.where({
				is_possible: false
			});

			if (notPossible.length == board.length &&
			board.selected().length === 0) {
				this.trigger('none_possible');
			} else {
				notPossible = _.shuffle(board.where({
					is_possible: false,
					is_possible_revealed: false
				}));
				_.each(notPossible, function(slot, index) {
					slot.delayReveal(this.delayFromPosition(index));
				}, this);
			}
		},

		delayFromPosition: function(index) {
			var delay = this.settings.get('invalid-slot-delay') || 3;
			return (index + 1) * delay * MICRO_TO_SECOND_FACTOR;
		}
	});
});
