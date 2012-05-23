/*jshint smarttabs:true */
/*global Error Event Clock Sets */

Sets.Assistant = (function(Sets) {
	"use strict";

	var Assistant = function(delay) {
		var _this = this;
		if (!delay) {
			throw new Error('Missing required param: delay');
		}

		Event.patch.call(this);
		this.not_possible_cards = [];
		this.clock = new Clock(function() {
			_this._revealNotPossibleCard();
			return _this.not_possible_cards.length > 0;
		}, delay);
	};

	/**
	 * Get the worker crunching the numbers
	 */
	Assistant.prototype.startSearchForUnmatched = function(board) {
		var self = this;
		if (this.board === board || board.length === 0) {
			return false;
		}

		this.clock.stop();
		this.board = board;
		this.not_possible_cards = Assistant.shuffle(Sets.listNotPossibleCards(board));

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
		if (this.not_possible_cards.length) {
			this.trigger('assistant.picked-not-possible', this.not_possible_cards.shift());
		}
	};

	Assistant.shuffle = function(array) {
		if (!array) { return array; }
		var tmp, current, top = array.length;

		if(top) while(--top) {
			current = Math.floor(Math.random() * (top + 1));
			tmp = array[current];
			array[current] = array[top];
			array[top] = tmp;
		}

		return array;
	};

	return Assistant;
})(window.Sets);
