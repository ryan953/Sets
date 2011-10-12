function AssistantWorker() {}
(function() {
	var timer = null;
	
	if (self) {
		self.addEventListener('message', function(event) {
			var data = event.data;
			
			try {
				self.postMessage( AssistantWorker[data.cmd](data) );
			} catch (err) {
				self.postMessage(['With the worker command', err]);
			}
		});
	}
	

	AssistantWorker.reflect = function(data) {
		var msg = data.msg;
		return msg;
	};
	AssistantWorker.stopClock = function() {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
	};
	
	/**
	 * takes a delay between clock ticks, and an action to do each tick
	 * when the action returns false the clock will turn itself off
	 */
	AssistantWorker.startClock = function(delay, tickAction) {
		AssistantWorker.stopClock();
		var clockTick = function() {
			if ( tickAction() ) {
				timer = setTimeout(clockTick, delay);
			}
		};
		clockTick();
	};
	
	AssistantWorker.startLooking = function(data) {
		var delay = data.delay,
			board = data.boardList || [],
			selected = data.selected || [],
			spliceCardFromList = function(card) {
				var idx = board.indexOf(card);
				if (idx >= 0) { board.splice(index, 1); }
			};
		
		selected.forEach(spliceCardFromList);
		
		AssistantWorker.startClock(delay, function() {
			var card = findCard(board, selected);
			if (card) {
				self.postMessage({
					cmd: 'picked-not-possible',
					card: card
				});
				spliceCardFromList(card); // don't test this card again
			}
		});
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
	
	AssistantWorker.pickNotSelectedCard = function(list) {
		var available = availableCards(list);
		if (available.length) {
			var rand = Math.floor(Math.random() * available.length);
			return available[rand];
		} else {
			return null;
		}
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
	
	AssistantWorker.listNotPossibleCards = function(board) {
		var list = board,
			selected = selectedCards(list),
			card1 = null,
			card2 = null,
			card3 = null;
		
		if (list.length < 3) {
			return list;
		} else if (list.length == 3) {
			return (isASet(list) ? [] : list);
		}
		
		list.forEach(function(card1) {
			if (card1.isSelected || card1.hasSet) { return; }
			list.forEach(function(card2) {
				if (card2 == card1 || card2.isSelected || card2.hasSet) { return; }
				list.forEach(function(card3) {
					if (card1 == card3 || card2 == card3 || card3.isSelected || card3.hasSet) { return; }
					if ( isASet([card1, card2, card3]) ) {
						card1.hasSet = card2.hasSet = card3.hasSet = true;
					}
				});
			});
		});
		
		return unmatchedCards(list);
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








function hasOwnProperty(key) {
	if(this[key]) {
		var proto = this.prototype;
		if(proto) {
			return ((key in this.prototype) && (this[key] === this.prototype[key]));
		}
		return true;
	} else {
		return false;
	}
}
if(!Object.prototype.hasOwnProperty) { Object.prototype.hasOwnProperty = hasOwnProperty; }

function create(o) {
	if (arguments.length > 1) {
		throw new Error('Object.create implementation only accepts the first parameter.');
	}
	function F() {}
	F.prototype = o;
	return new F();
}
if(!Object.create) { Object.create = create; }

function isArray( obj ) {
	return Object.prototype.toString.call(obj) === '[object Array]';
}
if(!Array.isArray) { Array.isArray = isArray; }

function clone( obj ) {

	if ( Array.isArray( obj ) ) {
		return [].slice.call( obj, 0 );
	}

	// Create a new object whose prototype is a new, empty object,
	// Using the second propertiesObject argument to copy the source properties
	return Object.create({}, (function(src) {

		var props = Object.getOwnPropertyNames( src ),
			dest = {};

		props.forEach(function( name ) {

			var descriptor = Object.getOwnPropertyDescriptor( src, name ),
				tmp;

			// Recurse on properties whose value is an object or array
			if ( typeof src[ name ] === "object" ) {

				descriptor.value = clone( src[ name ] );
			}

			dest[ name ] = descriptor;

		});

		return dest;

	})( obj ));
}
