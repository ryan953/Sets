"use strict";

function Assistant(delay) {
	this.event = new Event();
	this.delay = delay;
	this.timer = null;
	this.not_possible_cards = null;
}
(function() {
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
	 * Stop the timer so we don't return any cards
	 */
	Assistant.prototype.stopSearch = function() {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
	};
	
	/**
	 * Get the worker crunching the numbers
	 */
	Assistant.prototype.startSearchForUnmatched = function(board) {
		var self = this;
		
		console.log('updating board', board);

		this.not_possible_cards = Assistant.listNotPossibleCards(board);

		console.log('found list to disable', this.not_possible_cards.length);
		this._startClock(function() {
			console.log('will reveal, have:', self.not_possible_cards);
			self._revealNotPossibleCard();
			return self.not_possible_cards.length > 0;
		});
	};

	Assistant.prototype.unmatchedCards = function() {
		return this.not_possible_cards;
	};

	/**
	 * Takes a delay between clock ticks, and an action to do each tick
	 * when the action returns false the clock will turn itself off
	 */
	Assistant.prototype._startClock = function(tickAction) {
		this.stopSearch();
		var self = this,
			clockTick = function() {
			if (tickAction()) {
				self.timer = setTimeout(clockTick, self.delay);
			}
		};
		self.timer = setTimeout(clockTick, self.delay);
	};

	/**
	 * Pick a card that can't be made into a match based on the board we have.
	 */
	Assistant.prototype._revealNotPossibleCard = function() {
		if (!(this.not_possible_cards instanceof Array)) {
			return true;
		}
		if (this.not_possible_cards.length) {
			this.trigger('picked-not-possible', this.not_possible_cards.shift());
		}
	};
})();

(function() {
	var selectedCards = function(list) {
		return list.filter(function(card) { return card.isSelected; });
	},
	notSelectedCards = function(list) {
		return list.filter(function(card) { return !card.isSelected; });
	},
	unmatchedCards = function(list) {
		return list.filter(function(card) { return !card.hasSet; });
	},
	shuffle = function(array) {
	    var tmp, current, top = array.length;

	    if(top) while(--top) {
	        current = Math.floor(Math.random() * (top + 1));
	        tmp = array[current];
	        array[current] = array[top];
	        array[top] = tmp;
	    }

	    return array;
	};

	Assistant.listNotPossibleCards = function(board) {
		// console.log('before check', board);
		
		var known_unmatched = unmatchedCards(board),
			selected = selectedCards(board),
			board = board.map(function(card) {
				card.hasSet = false;
				return card;
			}),
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
		return shuffle(notSelectedCards(unmatchedCards(board)));
	};
})();