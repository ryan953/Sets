/*global _, Backbone */

window.Sets = (function(Parent, Deck, Board, StopWatch, Matcher) {
	"use strict";

	return Parent.extend({
		defaults: {
			mode: null,
			baseSize: {rows: 0, cols: 0},
			foundSets: [],
			'in-progress': false,
			paused: false
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
			this.matcher = new Matcher(null, {
				settings: this.settings
			});
			this.matcher.bindToBoard(this.board);

			this.stopWatch = new StopWatch();

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
			if (this.isGameInProgress()) {
				this.trigger('game:end', 'abandoned');
			}
			this.trigger('game:start', mode);
		},

		nonePossible: function() {
			if (this.board.canExpand() && this.settings.get('end-game-on-non-possible') == 'off') {
				this.board.expand();
				this.board.drawCards();
			} else {
				this.trigger('game:end', 'lose');
			}
		},

		endExisting: function() {
			if (this.isGameInProgress()) {
				this.trigger('game-ended');
				this.set({
					'in-progress': false,
					'start-time': null
				});
			}
		},

		initGame: function(mode) {
			this.endExisting();

			this.setFoundSets([]);

			var baseSize = this.deck.getBoardSize(mode);

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

			this.stopWatch.reset();
			this.set({'in-progress': true});
			this.resume();
		},

		pause: function() {
			if (!this.isGameInProgress()) {
				return;
			}
			this.stopWatch.pause();
			this.set({paused: true});
		},

		resume: function() {
			if (!this.isGameInProgress()) {
				return;
			}
			this.stopWatch.start();
			this.set({paused: false});
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

		isGameInProgress: function() {
			return this.get('in-progress');
		},

		isGameComplete: function() {
			if (this.getFoundCardCount() === this.getStartingDeckSize()) {
				return true;
			}
			return false;
		}

	});
})(window.Backbone.Model, window.Collections.Deck, window.Collections.Board, window.StopWatch, window.Matcher);
