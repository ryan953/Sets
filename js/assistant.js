/*jshint smarttabs:true */
/*global Error Event Clock Sets */

Sets.Assistant = (function(Sets) {
	"use strict";

	var Assistant = function (delay) {
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
		this.not_possible_cards = Assistant.shuffle(Assistant.listNotPossibleCards(board));

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

	var selectedCards = function(list) {
		return list.filter(function(card) { return card.isSelected; });
	},
	notSelectedCards = function(list) {
		return list.filter(function(card) { return !card.isSelected; });
	},
	unmatchedCards = function(list) {
		return list.filter(function(card) { return !card.hasSet; });
	};

	Assistant.listNotPossibleCards = function(board) {
		board.forEach(function(card) {
			card.hasSet = false;
		});
		var known_unmatched = unmatchedCards(board),
			selected = selectedCards(board),
			set1 = board, set2 = board, set3 = board;

		if (board.length < 3) {
			return board;
		} else if (board.length == 3) {
			return (Sets.isASet(board) ? [] : board);
		}

		if (selected.length == 1) {
			set1 = [selected[0]];
		} else if(selected.length == 2) {
			set1 = [selected[0]];
			set2 = [selected[1]];
		}

		set1.forEach(function(card1) {
			set2.forEach(function(card2) {
				if (card2 == card1) { return; }
				set3.forEach(function(card3) {
					if (card1 == card3 || card2 == card3) { return; }
					if ( Sets.isASet([card1, card2, card3]) ) {
						card1.hasSet = card2.hasSet = card3.hasSet = true;
					}
				});
			});
		});
		return notSelectedCards(unmatchedCards(board));
	};

	return Assistant;
})(window.Sets);
