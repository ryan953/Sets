/*globals _, Backbone */

window.Sets = (function(Deck, Board) {
	"use strict";

	return Backbone.Model.extend({
		defaults: {
			mode: null,
			baseSize: {rows: 0, cols: 0},
			foundSets: []
		},

		toJSON: function() {
			var attrs = _.clone(this.attributes);
			attrs.deck = this.deck.toJSON();
			attrs.board = this.board.toJSON();
			return attrs;
		},

		initialize: function(options) {
			this.settings = options.settings;

			this.deck = new Deck();
			this.board = new Board(null, {
				settings: this.settings,
				deck: this.deck
			});

			this.on('game:start', this.initGame, this);

			this.board.on('selected:valid-set', this.recordFoundSet, this);

			this.board.on('none_possible', function() {
				//console.log('none are possible :(');
			});
		},

		start: function(mode) {
			this.trigger('game:start', mode);
		},

		getBaseSize: function(mode) {
			if (mode == Deck.EASY) {
				return {rows: 3, cols: 3};
			} else if (mode == Deck.NORMAL) {
				return {rows: 4, cols: 3};
			}
			return {rows: 0, cols: 0};
		},

		initGame: function(mode) {
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
		}

	});
}(window.Collections.Deck, window.Collections.Board));
