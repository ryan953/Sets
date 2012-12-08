/*globals _, Backbone */

window.Sets = (function(Parent, Deck, Board) {
	"use strict";

	return Parent.extend({
		defaults: {
			mode: null,
			baseSize: {rows: 0, cols: 0},
			foundSets: []
		},

		baseSizes: {
			'unpossible': {rows: 2, cols: 3},
			'test': {rows: 2, cols: 3},
			'easy': {rows: 3, cols: 3},
			'normal': {rows: 4, cols: 3}
		},

		toJSON: function() {
			var attrs = _.clone(this.attributes);
			attrs.deck = this.deck.toJSON();
			attrs.board = this.board.toJSON();
			return attrs;
		},

		initialize: function(options) {
			this.settings = options.settings;
			this.stats = options.stats;

			this.deck = new Deck();
			this.board = new Board(null, {
				settings: this.settings,
				deck: this.deck
			});

			this.on('game:start', this.initGame, this);
			this.on('game:end', this.endExisting, this);

			this.board.on('selected:valid-set', this.recordFoundSet, this);
			this.board.on('selected:valid-set', this.cardsRemoved, this);
			this.board.on('none_possible', this.nonePossible, this);

			this.stats.bindTo(this);
		},

		cardsRemoved: function() {
			if (this.isGameComplete()) {
				this.trigger('game:end', 'win');
			}
		},

		start: function(mode) {
			if (this.get('start-time')) {
				this.trigger('game:end', 'abandoned');
			}
			this.trigger('game:start', mode);
		},

		nonePossible: function() {
			this.trigger('game:end', 'lose');
		},

		endExisting: function() {
			if (this.get('start-time')) {
				this.trigger('game-ended', this.get('start-time'), new Date());
				this.set({'start-time': null});
			}
		},

		getBaseSize: function(mode) {
			if (this.baseSizes[mode]) {
				return this.baseSizes[mode];
			}
			throw new Error('cannot find board size for mode: ' + mode);
		},

		initGame: function(mode) {
			this.endExisting();

			this.setFoundSets([]);

			var baseSize = this.getBaseSize(mode);

			this.deck.rebuild(mode);
			this.board.rebuild(
				baseSize.rows,
				baseSize.cols
			);
			this.set({
				mode: mode,
				baseSize: baseSize
			});

			this.board.drawCards(this.deck);

			this.set('start-time', new Date());
		},

		getTimeDiff: function() {
			return new Date() - this.get('start-time');
		},

		recordFoundSet: function(slots) {
			var found = this.get('foundSets');
			found.push(_.map(slots, function(slot) {
				return slot.get('card');
			}));
			this.setFoundSets(found);
		},

		setFoundSets: function(found) {
			this.set({foundSets: found});
			this.trigger('change:foundSets'); // TODO: pass normal params for a change events
			this.trigger('change');           // TODO: pass normal params for a change events
		},

		getFoundCardCount: function() {
			return this.get('foundSets').length * 3 || 0;
		},

		getStartingDeckSize: function() {
			return this.deck.startingLength;
		},

		isGameComplete: function() {
			if (this.getFoundCardCount() === this.getStartingDeckSize()) {
				return true;
			}
			return false;
		}

	});
}(window.Backbone.Model, window.Collections.Deck, window.Collections.Board));
