define([
	'underscore',
	'backbone',
	'../collections/deck',
	'../collections/board',
	'utils/stop-watch',
	'../models/matcher',
	'../models/found-sets'
], function(_, Backbone, Deck, Board, StopWatch, Matcher, FoundSets) {
	"use strict";

	return Backbone.Model.extend({
		defaults: {
			mode: null,
			baseSize: {rows: 0, cols: 0},
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
				deck: this.deck
			});
			this.matcher = new Matcher(null, {
				settings: this.settings
			});
			this.matcher.bindToBoard(this.board);
			this.matcher.on('none_possible', this.nonePossible, this);

			this.foundSets = new FoundSets();
			this.foundSets.bindToBoard(this.board);

			this.stopWatch = new StopWatch();

			this.on('game:start', this.initGame, this);
			this.on('game:end', this.endExisting, this);

			this.board.on('selected:valid-set', this.cardsRemoved, this);
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

			this.foundSets.reset();

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

		getStartingDeckSize: function() {
			return this.deck.startingLength;
		},

		isGameInProgress: function() {
			return this.get('in-progress');
		},

		isGameComplete: function() {
			if (this.foundSets.getCount() === this.getStartingDeckSize()) {
				return true;
			}
			return false;
		}

	});
});
