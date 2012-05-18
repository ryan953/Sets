/*jshint browser:true */

Sets.SetsUI = (function() {
	"use strict";

	var SetsUI = function(parentElement) {
		this.container = parentElement;
	};

	SetsUI.makeBoard = function(rows, cols) {
		var row, table = document.createElement('table');
		for(row = 0; row < rows; row++) {
			table.appendChild(SetsUI._makeRow(cols));
		}
		return table;
	};
	SetsUI._makeRow = function(cols) {
		var col, tr = document.createElement('tr');
		for(col = 0; col < cols; col++) {
			tr.appendChild(document.createElement('td'));
		}
		return tr;
	};
	SetsUI.renderCard = function(card) {
		if (card) {
			var elem = SetsUI._createCardElement();
			card.draw(elem.firstChild.getContext('2d'));
			return elem;
		} else {
			return document.createElement('span');
		}
	};
	SetsUI.coordsToIndex = function(row, col) {
		return (row * 3) + col;
	};
	SetsUI._createCardElement = function() {
		var div = document.createElement('div'),
			canvas = document.createElement('canvas');
		canvas.width = canvas.height = 150;
		div.appendChild(canvas);
		return div;
	};

	SetsUI.prototype._clearContainerElement = function() {
		var p = this.container;
		while (p.lastChild) { p.removeChild(p.lastChild); }
		return this;
	};

	SetsUI.prototype.renderGame = function(game) {
		this._clearContainerElement();
		var rows = game.board.length,
			cols = game.board[0].length,
			ui_board = SetsUI.makeBoard(rows, cols),
			cells = ui_board.getElementsByTagName('td'),
			row, col, index, card;

		for(row = 0; row < rows; row++) {
			for(col = 0; col < cols; col++) {
				index = SetsUI.coordsToIndex(row, col);
				card = game.board[row][col];
				cells[index].appendChild( SetsUI.renderCard(card) );
				cells[index].className = (card ? card.getClassAttr() : '');
			}
		}
		var old_board = this.container.firstChild;
		if (old_board) {
			this.container.removeChild(old_board);
		}
		this.container.appendChild(ui_board);
	};

	SetsUI.prototype.updateSelected = function(board) {
		var row, col, card, index, cells = Array.prototype.slice.call( this.container.getElementsByTagName('td') );
		if (cells.length === 0) { return; }
		for(row = 0; row < board.length; row++) {
			for(col = 0; col < board[row].length; col++) {
				index = SetsUI.coordsToIndex(row, col);
				card = board[row][col];
				cells[index].className = (card ? card.getClassAttr() : '');
			}
		}
	};

	SetsUI.prototype.showWrongSelection = function(game, cards) {
		if (cards) {
			var self = this,
				card = cards.splice(-1, 1),
				cells = self.container.getElementsByTagName('td'),
				index = SetsUI.coordsToIndex(card[0].row, card[0].col);
				//cells[index].className = 'error';
				cells[index].invalidPick = true;
			setTimeout(function() {
				cells[index].invalidPick = false;
				self.updateSelected(game.board);
			}, 1000);
		}
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

	return SetsUI;
})();
