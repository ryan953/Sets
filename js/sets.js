/*global Event:false */

window.Sets = window.Sets || {};

(function(Sets) {
	"use strict";
	var propCounter = function(field) {
		return function(prev, curr) {
			prev[curr[field]] = (curr[field] in prev ? prev[curr[field]] + 1 : 1);
			return prev;
		};
	};
	Sets.lastErrors = [];
	Sets.isASet = function(cards) {
		if (cards.length !== 3 ) { return false; }

		var totals = {
			counts: [].reduce.call(cards, propCounter('count'), {}),
			shapes: [].reduce.call(cards, propCounter('shape'), {}),
			fills: [].reduce.call(cards, propCounter('fill'), {}),
			colors: [].reduce.call(cards, propCounter('color'), {})
		},
		field, val;

		Sets.lastErrors = [];

		for(field in totals) {
			if (totals.hasOwnProperty(field)) {
				for(val in totals[field]) {
					if (totals[field].hasOwnProperty(val)) {
						if (totals[field][val] != 1 && totals[field][val] != 3) {
							Sets.lastErrors.push({
								field:field,
								val:val,
								count:totals[field][val]
							});
						}
					}
				}
			}
		}
		return Sets.lastErrors.length === 0;
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

	Sets.listNotPossibleCards = function(board) {
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
})(window.Sets);

Sets.Card = (function() {
	"use strict";

	var Card = function(count, shape, fill, color) {
		this.isSelected = false;

		this.count = count;
		this.shape = shape;
		this.fill = fill;
		this.color = color;
	};

	function getPattern(color, lineWidth) {
		var stripes = document.createElement('canvas'),
			ctx;

		stripes.width = lineWidth * 2;
		stripes.height = lineWidth * 2;
		ctx = stripes.getContext('2d');
		ctx.save();
		ctx.strokeStyle = color;
		ctx.lineWidth = lineWidth/2;

		/** vertical lines */
		/*ctx.moveTo(lineWidth/2, 0);
		ctx.lineTo(lineWidth/2, lineWidth*2);*/

		/** diagonal **/
		ctx.moveTo(0, 0);
		ctx.lineTo(lineWidth*2, lineWidth*2);
		ctx.moveTo(0, lineWidth*2-1);
		ctx.lineTo(0, lineWidth*2+1);
		ctx.moveTo(lineWidth*2-1, 0);
		ctx.lineTo(lineWidth*2+1, 0);
		ctx.stroke();

		ctx.restore();
		return ctx.createPattern(stripes, 'repeat');
	}

	Card.factory = function(c) {
		return new Card(c.count, c.shape, c.fill, c.color);
	};

	Card.counts = [1, 2, 3];
	Card.shapes = ['Diamond', 'Squiggle', 'Oval']; //'Triangle', 'Circle', 'Square'
	Card.fills = ['solid', 'empty', 'striped'];
	Card.colors = ['red', 'green', 'blue'];
	Card.stripedFills = {
		red:getPattern('red', 4),
		green:getPattern('green', 4),
		blue:getPattern('blue', 4)
	};
	Card.paths = {
		Diamond: function(ctx) {
			ctx.beginPath();
			ctx.moveTo(50, 2); ctx.lineTo(0, 25); ctx.lineTo(50, 48); ctx.lineTo(100, 25);
			ctx.closePath();
		},
		Oval: function(ctx) {
			ctx.beginPath();
			ctx.arc(75, 25, 22, -Math.PI/2, Math.PI/2, false); ctx.arc(25, 25, 22, Math.PI/2, -Math.PI/2, false);
			ctx.closePath();
		},
		Squiggle: function(ctx) {
			ctx.beginPath();
			ctx.moveTo(70, 10); ctx.bezierCurveTo(0, -20, -20, 75, 30, 40); ctx.bezierCurveTo(100, 70, 120, -25, 70, 10);
			ctx.closePath();
		},
		Square: function(ctx) {
			ctx.beginPath();
			ctx.moveTo(2, 5); ctx.lineTo(98, 5); ctx.lineTo(98, 45); ctx.lineTo(2, 45);
			ctx.closePath();
		},
		Circle: function(ctx) {
			ctx.beginPath();
			ctx.arc(52, 25, 20, 0, Math.PI*2, false);
			ctx.closePath();
		},
		Triangle: function(ctx) {
			ctx.beginPath();
			ctx.moveTo(50, 5); ctx.lineTo(10, 45); ctx.lineTo(90, 45);
			ctx.closePath();
		}
	};

	Card.classNameMap = {
		'isSelected': 'selected',
		'notPossible': 'not-possible',
		'invalidPick': 'error'
	};
	
	Card.prototype.toString = function() {
		return [this.count, this.fill, this.color, this.shape].join(' ');
	};
	Card.prototype.valueOf = function() {
		return JSON.stringify(this);
	};

	Card.prototype.select = function() { this.isSelected = true; };
	Card.prototype.deselect = function() { this.isSelected = false; };
	Card.prototype.toggleSelect = function() { this.isSelected = !this.isSelected; };

	Card.prototype.getClassAttr = function() {
		var classes = [];
		for(var prop in Card.classNameMap) {
			if (this[prop]) {
				classes.push(Card.classNameMap[prop]);
			}
		}
		return classes.join(' ');
	};
	
	Card.prototype.isEmpty = function() { return !(this.count && this.shape && this.fill && this.color); };

	var visuals = function(card) {
		var fills = {
			solid: {
				lineWidth:0,
				fillStyle:card.color
			},
			empty: {
				lineWidth:4,
				fillStyle:'transparent'
			},
			striped: {
				lineWidth:1,
				fillStyle:Card.stripedFills[card.color]
			}
		};
		return fills[card.fill];
	};
		
	Card.prototype.draw = function(ctx) {
		ctx.clearRect(0, 0, 150, 150);
		for(var i = 0; i < this.count; i++) {
			ctx.save();
			ctx.translate(25, ([50, 25, 0])[this.count-1] + (i*50));
			Card.paths[this.shape](ctx);
			var visualSettings = visuals(this);
			ctx.lineWidth = visualSettings.lineWidth;
			ctx.fillStyle = visualSettings.fillStyle;
			ctx.strokeStyle = this.color;
			ctx.stroke();
			ctx.fill();
			ctx.restore();
		}
	};

	return Card;
})();

Sets.Deck = (function(Card) {
	"use strict";

	var Deck = function(mode) {
		this.mode = mode || 'regular';
		this.generateDeck(this.mode);
	};

	Deck.prototype.generateDeck = function(mode) {
		var self = this;
		self.cards = [];
		Card.counts.forEach(function(num) {
			Card.shapes.forEach(function(symbol) {
				Card.colors.forEach(function(color) {
					if (mode == 'easy') {
						self.cards.push( new Card( num, symbol, Card.fills[0], color) );
					} else {
						Card.fills.forEach(function(shade) {
							self.cards.push( new Card( num, symbol, shade, color) );
						});
					}
				});
			});
		});
		this.size = this.cards.length;
		this.length = this.cards.length;
	};
	Deck.prototype.pickRandomCard = function() {
		return this.pickCard(Math.floor(Math.random()*this.cards.length));
	};
	Deck.prototype.pickCard = function(idx) {
		this.length -= 1;
		return this.cards.splice(idx, 1)[0] || null;
	};

	return Deck;
})(window.Sets.Card);

