/*global _, Backbone */
/*jshint newcap:false */

window.Models.HelpGame = (function(Parent, Settings, Storage, Deck, Board) {
	"use strict";

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
			this.teachingDeck = new Deck();
			this.board = new Board(null, {
				deck: this.teachingDeck,
				settings: this.teachingSettings
			});

			var mode = 'teaching';

			this.teachingDeck.rebuild(mode);
			var baseSize = this.teachingDeck.getBoardSize(mode);
			this.board.rebuild(
				baseSize.rows,
				baseSize.cols
			);
			this.board.drawCards(this.teachingDeck);

			this.board.on('selected:valid-set', function() {
				this.set({
					'page': Math.min(this.get('page') + 1, 5)
				});
			}, this);
		}
	}, statics);

	return clazz;
})(window.Backbone.Model, window.Models.Settings, window.Backbone.LocalStorage, window.Collections.Deck, window.Collections.Board);
