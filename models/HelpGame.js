/*global _, Backbone */
/*jshint newcap:false */

window.Models.HelpGame = (function(Parent, Settings, Storage, Deck, Board) {
	"use strict";

	var mode = 'teaching';

	var instance;

	var statics = {
		factory: function() {
			if (!instance) {
				instance = new clazz();
			}
			return instance;
		}
	};

	var clazz = Parent.extend({
		defaults: {
			page: 1
		},

		initialize: function() {
			this.teachingSettings = new Settings({id: 'teaching'},
				{localStorage: new Storage('settings-teaching')}
			);
			this.deck = new Deck();
			window.teachingDeck = this.deck;
			this.board = new Board(null, {
				deck: this.deck,
				settings: this.teachingSettings
			});
			window.teachingBoard = this.board;

			var baseSize = this.deck.getBoardSize(mode);
			this.board.rebuild(
				baseSize.rows,
				baseSize.cols
			);

			this.board.on('selected:valid-set', function() {
				this.set({
					'page': Math.min(this.get('page') + 1, 5)
				});
			}, this);

			this.reset();
		},

		reset: function() {
			this.deck.rebuild(mode);
			if (this.board.emptySlots().length) {
				this.board.drawCards();
			} else {
				this.board.each(function(slot) {
					slot.set({
						card: null,
						is_selected: false
					});
					slot.collection.trigger('card:removed', slot);
				});
			}
			this.set({page: 1});
		}
	}, statics);

	return clazz;
})(window.Backbone.Model, window.Models.Settings, window.Backbone.LocalStorage, window.Collections.Deck, window.Collections.Board);
