function Card(count, shape, fill, color) {
	this.isSelected = false;

	this.count = count;
	this.shape = shape;
	this.fill = fill;
	this.color = color;
}
(function() {
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

	Card.counts = [1, 2, 3];
	Card.shapes = ['Diamond', 'Squiggle', 'Oval'];
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
		}
	};

	Card.prototype.select = function() { this.isSelected = true; };
	Card.prototype.deselect = function() { this.isSelected = false; };
	Card.prototype.toggleSelect = function() { this.isSelected = !this.isSelected; };

	Card.prototype.isEmpty = function() { return !(this.count && this.shape && this.fill && this.color); };
})();

function Deck(mode) {
	this.mode = mode || 'regular';
	this.generateDeck(this.mode);
}
(function() {
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
	};
	Deck.prototype.pickRandomCard = function() {
		return this.pickCard(Math.floor(Math.random()*this.cards.length));
	};
	Deck.prototype.pickCard = function(idx) {
		return this.cards.splice(idx, 1)[0] || null;
	};
})();


function Sets() { //this is the game logic
	this.event = new Event();
	this._init('easy');

	this.bind('found-set', function() {
		if (this.deck.size == this.foundSets.length * 3) {
			this.trigger('end');
		}
	});
}
(function() {
	Sets.lastErrors = [];
	Sets.modes = {
		'easy': {rows:3, cols:3},
		'regular': {rows:4, cols:3}
	};
	Sets.isASet = function(cards) {
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
	Sets.prototype.bind = function(name, handler) {
		this.event.addListener(this, name, handler);
		return this;
	};
	Sets.prototype.trigger = function(name, data) {
		this.event.fireEvent({}, this, name, data);
		return this;
	};
	Sets.prototype.unbind = function(name, handler) {
		this.event.removeListener(this, name, handler);
		return this;
	};
	Sets.prototype._init = function(mode) {
		this.mode = mode || 'easy';
		this.deck = new Deck(this.mode);
		this.board = [];
		this.selected = [];
		this.foundSets = [];
		return this;
	};
	Sets.prototype._addCardToBoard = function(card, row, col) {
		this.board[row] = this.board[row] || [];
		this.board[row][col] = card;
		try {
			card.row = row;
			card.col = col;
		} catch (err) { }
		return this;
	};
	Sets.prototype._loadBoard = function() {
		var row, col, card;
		for(row = 0; row < Sets.modes[this.mode].rows; row++) {
			for(col = 0; col < 3; col++) {
				this._addCardToBoard(this.deck.pickRandomCard(), row, col);
			}
		}
		return this;
	};
	Sets.prototype.listCardsOnBoard = function() {
		var row, col, card, lst = [];
		for(row = 0; row < this.board.length; row++) {
			for(col = 0; col < this.board[row].length; col++) {
				card = this.board[row][col];
				if (card) {
					lst.push(card);
				}
			}
		}
		return lst;
	};
	Sets.prototype.start = function(mode) {
		return this
			._init(mode)
			._loadBoard()
			.trigger('start');
	};
	Sets.prototype.selectCard = function(row, col) {
		var cards,
			card = this.board[row][col],
			idx = this.selected.indexOf(card);

		if (!card) { return; }

		if (idx < 0) {
			card.select();
			this.selected.push(card);
		} else {
			card.deselect();
			this.selected.splice(idx, 1);
		}

		this.trigger('select-card', this.selected.slice());

		if (Sets.isASet(this.selected) === true) {
			cards = this.selected.slice();
			this.foundSets.push(cards);
			this.replaceSet(this.selected)
				._clearSelection()
				.trigger('found-set', cards);
		} else if (this.selected.length >= 3) {
			cards = this.selected.slice();
			this._clearSelection()
				.trigger('selection-cleared', cards);
		}
	};
	Sets.prototype._clearSelection = function() {
		this.selected.forEach(function(card) { card.deselect(); });
		this.selected = [];
		return this;
	};
	Sets.prototype.replaceSet = function(cards) {
		var card_i, row, col;
		for(row = 0; row < Sets.modes[this.mode].rows; row++) {
			for(col = 0; col < Sets.modes[this.mode].cols; col++) {
				for(card_i = 0; card_i < cards.length; card_i++) {
					if (this.board[row][col] == cards[card_i]) {
						this._addCardToBoard(this.deck.pickRandomCard(), row, col);
						delete cards[card_i];
						if (!cards.length) { return this; }
					}
				}
			}
		}
		return this;
	};
})();



function SetsUI(parentElement, game) {
	this.container = parentElement;
}
(function() {
	SetsUI.makeBoard = function(rows, cols) {
		var row, table = document.createElement('table');
		for(row = 0; row < rows; row++) {
			table.appendChild(SetsUI.makeRow(cols));
		}
		return table;
	};
	SetsUI.makeRow = function(cols) {
		var col, tr = document.createElement('tr');
		for(col = 0; col < cols; col++) {
			tr.appendChild(document.createElement('td'));
		}
		return tr;
	};
	SetsUI.renderCard = function(card) {
		if (card) {
			var elem = SetsUI.createCardElement(card.isSelected);
			card.draw(elem.firstChild.getContext('2d'));
			return elem;
		} else {
			return document.createElement('span');
		}
	};
	SetsUI.coordsToIndex = function(row, col) {
		return (row * 3) + col;
	};
	SetsUI.createCardElement = function(isSelected) {
		var div = document.createElement('div'),
			canvas = document.createElement('canvas');
		canvas.width = canvas.height = 150;
		div.appendChild(canvas);
		return div;
	};

	SetsUI.prototype.clearContainerElement = function() {
		var p = this.container;
		while (p.lastChild) { p.removeChild(p.lastChild); }
		return this;
	};

	SetsUI.prototype.renderGame = function(game) {
		this.clearContainerElement();
		var rows = game.board.length,
			cols = Sets.modes[game.mode].cols,
			ui_board = SetsUI.makeBoard(rows, cols),
			cells = ui_board.getElementsByTagName('td'),
			row, col, index, card;

		for(row = 0; row < rows; row++) {
			for(col = 0; col < cols; col++) {
				index = SetsUI.coordsToIndex(row, col);
				card = game.board[row][col];
				cells[index].appendChild( SetsUI.renderCard(card) );
				cells[index].className = (card && card.isSelected ? 'selected' : '');
			}
		}
		this.container.appendChild(ui_board);
	};

	SetsUI.prototype.updateSelected = function(game) {
		var row, col, card, index, cells = Array.prototype.slice.call( this.container.getElementsByTagName('td') );
		for(row = 0; row < game.board.length; row++) {
			for(col = 0; col < game.board[row].length; col++) {
				index = SetsUI.coordsToIndex(row, col);
				card = game.board[row][col];
				cells[index].className = (card && card.isSelected ? 'selected' : '');
			}
		}
	};

	SetsUI.prototype.showWrongSelection = function(game, cards) {
		var self = this,
			card = cards.splice(-1, 1),
			cells = self.container.getElementsByTagName('td'),
			index = SetsUI.coordsToIndex(card[0].row, card[0].col);
			cells[index].className = 'error';
		setTimeout(function() { self.updateSelected(game); }, 1000);
	};

	SetsUI.prototype.showFoundSet = function(game, cards) {
		var self = this,
			cells = self.container.getElementsByTagName('td'),
			index,
			found = [];

		cards.forEach(function(card) {
			index = SetsUI.coordsToIndex(card.row, card.col);
			cells[index].className = 'found';
		});

		setTimeout(function() { self.renderGame(game); }, 1000);
	};
})();

(function() {
	Card.prototype.draw = function(ctx) {
		function visuals(card) {
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
		}

		ctx.clearRect(0, 0, 150, 150);
		for(var i = 0; i < this.count; i++) {
			ctx.save();
			ctx.translate(25, ([50, 25, 0])[this.count-1] + (i*50));
			Card.paths[this.shape](ctx);
			visualSettings = visuals(this);
			ctx.lineWidth = visualSettings.lineWidth;
			ctx.fillStyle = visualSettings.fillStyle;
			ctx.strokeStyle = this.color;
			ctx.stroke();
			ctx.fill();
			ctx.restore();
		}
	};
})();
