/*jshint smarttabs:true */
/*global Error Event Clock Sets */

Sets.Assistant = (function(Sets) {
	"use strict";

	var Assistant = function(delay) {
		if (!delay) {
			throw new Error('Missing required param: delay');
		}
		var _this = this;

		Event.patch.call(this);
		this.not_possible_cards = [];
		this.clock = new Clock(function() {
			return _this._revealNotPossibleCard();
		}, delay);
		this.clock.bind('clock.stop', function() {
			_this.trigger('assistant.picked-last-card');
		});
	};

	Assistant.prototype.startSearchForUnmatched = function(board) {
		var self = this;
		if (this.board === board || board.length === 0) {
			return false;
		}

		this.clock.stop();
		this.board = board;

		this.not_possible_cards = Array.shuffle.call(Sets.listNotPossibleCards(board));

		if (this.not_possible_cards.length === board.length) {
			this.trigger('assistant.no-cards-possible');
		} else {
			this.clock.start();
		}
		return true;
	};

	/**
	 * Pick a card that can't be made into a match based on the board we have.
	 */
	Assistant.prototype._revealNotPossibleCard = function() {
		if (this.not_possible_cards.length > 0) {
			this.trigger('assistant.picked-not-possible', this.not_possible_cards.shift());
		}
		return this.not_possible_cards.length > 0;
	};

	return Assistant;
})(window.Sets);
