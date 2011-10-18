"use strict";
function AssistantWorker() {}
(function() {
	if (self) {
		self.addEventListener('message', function(event) {
			var data = event.data;
			
			try {
				var func = AssistantWorker[data.cmd];
				var rtrn = func(data);
				if (data.event) {
					rtrn = {'event': data.event, 'data': rtrn};
				}
				self.postMessage( rtrn );
			} catch (err) {
				self.postMessage(['With the worker command', err]);
			}
		});
	}
	
	AssistantWorker.reflect = function(data) {
		var msg = data.msg;
		return msg;
	};
	
	
	
	var availableCards = function(list) {
		return list.filter(function(card) { return !card.isSelected && !card.notPossible; });
	},
	selectedCards = function(list) {
		return list.filter(function(card) { return card.isSelected; });
	},
	unmatchedCards = function(list) {
		return list.filter(function(card) { return !card.hasSet; });
	};
	
	/**
	 * If we have some cards selected, pick a random card and if it doesn't make a set return it.
	 *
	 * If that random card does make a set a) mark it as used b) get another card
	 * When all cards are used return null;
	 */
	AssistantWorker.findNotPossibleCard = function(list) {
		var possibleCards = AssistantWorker.listNotPossibleCards(list),
			index = Math.floor(Math.random()*possibleCards.length);
			return possibleCards[index];
	};
	
	AssistantWorker.listNotPossibleCards = function(data) {
		var board = data.board,
			selected = selectedCards(board),
			card1 = null,
			card2 = null,
			card3 = null;
		
		if (board.length < 3) {
			return board;
		} else if (board.length == 3) {
			return (isASet(board) ? [] : board);
		}
		
		board.forEach(function(card1) {
			if (card1.hasSet) { return; }
			board.forEach(function(card2) {
				if (card2 == card1 || card2.hasSet) { return; }
				board.forEach(function(card3) {
					if (card1 == card3 || card2 == card3 || card3.hasSet) { return; }
					if ( isASet([card1, card2, card3]) ) {
						card1.hasSet = card2.hasSet = card3.hasSet = true;
					}
				});
			});
		});
		
		return unmatchedCards(board);
	};
	
	// Copied from Card.isASet()
	var lastErrors = [];
	var isASet = function(cards) {
		if (cards.length != 3 ) { return false; }
		
		var propCounter = function(field) {
			return function(prev, curr) {
				(curr[field] in prev ? prev[curr[field]] += 1 : prev[curr[field]] = 1);
				return prev;
			};
		},
		totals = {
			counts: [].reduce.call(cards, propCounter('count'), {}),
			shapes: [].reduce.call(cards, propCounter('shape'), {}),
			fills: [].reduce.call(cards, propCounter('fill'), {}),
			colors: [].reduce.call(cards, propCounter('color'), {})
		},
		field, val;

		lastErrors = [];

		for(field in totals) {
			if (totals.hasOwnProperty(field)) {
				for(val in totals[field]) {
					if (totals[field].hasOwnProperty(val)) {
						if (totals[field][val] != 1 && totals[field][val] != 3) {
							lastErrors.push({
								field:field,
								val:val,
								count:totals[field][val]
							});
						}
					}
				}
			}
		}
		return lastErrors.length === 0;
	};
})();
