/*jshint smarttabs:true */
/*global Event:false Error:false Sets:false smarttabs:true */
function Assistant(delay) {
	"use strict";
	if (!delay) {
		throw new Error('Missing required param: delay');
	}
	this.event = new Event();
	this.delay = delay;
	this.timer = null;
	this.not_possible_cards = [];
}
(function() {
	"use strict";
	Assistant.prototype.bind = function(name, handler) {
		this.event.addListener(this, name, handler);
		return this;
	};
	Assistant.prototype.trigger = function(name, data) {
		this.event.fireEvent({}, this, name, data);
		return this;
	};
	Assistant.prototype.unbind = function(name, handler) {
		this.event.removeListener(this, name, handler);
		return this;
	};

	/**
	 * Takes a delay between clock ticks, and an action to do each tick
	 * when the action returns false the clock will turn itself off
	 */
	Assistant.prototype._startClock = function(tickAction) {
		this.stopClock();
		var self = this,
			clockTick = function() {
			if (tickAction()) {
				self.timer = setTimeout(clockTick, self.delay);
			} else {
				self.trigger('timer.stop');
			}
		};
		this.timer = setTimeout(clockTick, this.delay);
		this.trigger('timer.start');
	};

	/**
	 * Stop the timer so we don't return any cards
	 */
	Assistant.prototype.stopClock = function() {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
			this.trigger('timer.stop');
		}
	};

	/**
	 * Get the worker crunching the numbers
	 */
	Assistant.prototype.startSearchForUnmatched = function(board) {
		var self = this;
		this.stopClock();
		this.not_possible_cards = Assistant.shuffle(Assistant.listNotPossibleCards(board));

		if (this.not_possible_cards.length === board.length) {
			this.trigger('no-cards-possible');
		} else {
			this._startClock(function() {
				self._revealNotPossibleCard();
				return self.not_possible_cards.length > 0;
			});
		}
	};

	Assistant.prototype.unmatchedCards = function() {
		return this.not_possible_cards || [];
	};

	/**
	 * Pick a card that can't be made into a match based on the board we have.
	 */
	Assistant.prototype._revealNotPossibleCard = function() {
		if (this.not_possible_cards.length) {
			this.trigger('picked-not-possible', this.not_possible_cards.shift());
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
})();

(function() {
	"use strict";
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
		// console.log('searching with selected', selected);

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
})();
