/*global Event:false */

Sets.Game = (function(Sets, Deck, Assistant) {
	"use strict";

	var Game = function() {
		Event.patch.call(this);

		var _getScore = function(game) {
			return {
				found: (game.foundSets.length * 3),
				deck:game.deck.size
			};
		};
		this._init('easy')
			.bind('start', function() {
				this.trigger('score.change', _getScore(this));
			})
			.bind('found-set', function() {
				this.trigger('score.change', _getScore(this));
				if (this.hasFoundAllCards()) {
					this.trigger('game.end', {'win': true});
				} else if (!this.hasUndealtCards()) {
					var cards_on_board = this.listCardsOnBoard();
					var not_possible_cards = Assistant.listNotPossibleCards(cards_on_board);
					if (not_possible_cards.length == cards_on_board.length) {
						this.trigger('game.end', {'win': false});
					}
				}
			});
	};

	Game.modes = { // TODO: hello world
		'easy': {rows:3, cols:3},
		'regular': {rows:4, cols:3}
	};

	Game.prototype._init = function(mode) {
		this.mode = mode || 'easy';
		this.deck = new Deck(this.mode);
		this.board = [];
		this.selected = [];
		this.foundSets = [];
		return this;
	};
	Game.prototype._addCardToBoard = function(card, row, col) {
		this.board[row] = this.board[row] || [];
		this.board[row][col] = card;
		try {
			card.row = row;
			card.col = col;
		} catch (err) { }
		return this;
	};
	Game.prototype._loadBoard = function() {
		var row, col, card;
		for(row = 0; row < Game.modes[this.mode].rows; row++) {
			for(col = 0; col < Game.modes[this.mode].cols; col++) {
				this._addCardToBoard(this.deck.pickRandomCard(), row, col);
			}
		}
		return this;
	};
	Game.prototype.addCards = function() {
		// debugger;
		// var row = this.board.length, col;
		// for(col = 0; col < this.board[0].length; col++) {
		//    this._addCardToBoard(this.deck.pickRandomCard(), row, col);
		// }
	};
	Game.prototype.listCardsOnBoard = function() {
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
	Game.prototype.hasUndealtCards = function() {
		return (this.deck.length > 0);
	};
	Game.prototype.hasFoundAllCards = function() {
		return (this.deck.size == this.foundSets.length * 3);
	};
	Game.prototype.start = function(mode) {
		return this
			._init(mode)
			._loadBoard()
			.trigger('game.start');
	};
	Game.prototype.getCard = function(row, col) {
		return this.board[row][col];
	};
	Game.prototype.selectCard = function(card) {
		var cards,
			idx = this.selected.indexOf(card);
			
		if (!card) { return; }

		if (idx < 0) {
			card.select();
			this.selected.push(card);
			this.trigger('game.select-card', this.selected.slice());
		} else {
			card.deselect();
			this.selected.splice(idx, 1);
			this.trigger('game.deselect-card', this.selected.slice());
			if (this.selected.length === 0) {
				this.trigger('game.selection-cleared', this.selected.slice());
			}
		}

		if (Sets.isASet(this.selected) === true) {
			cards = this.selected.slice();
			this.foundSets.push(cards);
			this.replaceSet(this.selected)
				._clearSelection()
				.trigger('game.found-set', cards);
		} else if (this.selected.length >= 3) {
			cards = this.selected.slice();
			this._clearSelection()
				.trigger('game.selection-cleared', cards);
		}
		return this;
	};
	Game.prototype._clearSelection = function() {
		this.selected.forEach(function(card) { card.deselect(); });
		this.selected = [];
		return this;
	};
	Game.prototype.replaceSet = function(cards) {
		var card_i, row, col;
		for(row = 0; row < this.board.length; row++) {
			for(col = 0; col < this.board[row].length; col++) {
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

	return Game;
})(window.Sets, window.Sets.Deck, window.Sets.Assistant);
