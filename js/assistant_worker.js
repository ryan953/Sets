"use strict";
function AssistantWorker() {}
(function() {
	var selectedCards = function(list) {
		return list.filter(function(card) { return card.isSelected; });
	},
	notSelectedCards = function(list) {
		return list.filter(function(card) { return !card.isSelected; });
	},
	unmatchedCards = function(list) {
		return list.filter(function(card) { return !card.hasSet; });
	};
	
	
	AssistantWorker.listNotPossibleCards = function(data) {
		var board = data.board,
			selected = selectedCards(board),
			set1 = board, set2 = board, set3 = board,
			card1 = null, card2 = null, card3 = null;
		
		if (board.length < 3) {
			return board;
		} else if (board.length == 3) {
			return (isASet(board) ? [] : board);
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
					if ( isASet([card1, card2, card3]) ) {
						card1.hasSet = card2.hasSet = card3.hasSet = true;
					}
				});
			});
		});
		
		return notSelectedCards(unmatchedCards(board));
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


function WorkerProcess() {
	this.klass = AssistantWorker;
}
(function() {
	if (self) {
		self.addEventListener('message', function(event) {
			var data = event.data;
			
			try {
				var func = this.klass[data.cmd],
					rtrn = {};
				if (data.event) {
					rtrn.event = data.event;
				} else if (data.rtrncmd) {
					rtrn.cmd = data.rtrncmd;
				}
				rtrn.data = func(data);
				self.postMessage( rtrn );
			} catch (err) {
				self.postMessage(['With the worker command', err]);
			}
		});
	}
	
	this.klass.reflect = function(data) {
		var msg = data.msg;
		return msg;
	};
})();
