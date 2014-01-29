window.Models.HelpGame = (function(Backbone, Settings, Storage, Deck, Board) {
	"use strict";

	var mode = 'teaching',
		maxPage = 5;

	var instance;

	var HelpGame = function() {
		this.teachingSettings = new Settings({id: 'teaching'},
			{localStorage: new Storage('settings-teaching')}
		);
		this.deck = new Deck();
		this.board = new Board(null, {
			deck: this.deck,
			settings: this.teachingSettings
		});

		var baseSize = this.deck.getBoardSize(mode);
		this.board.rebuild(
			baseSize.rows,
			baseSize.cols
		);

		this.board.on('selected:valid-set', function() {
			_.delay(_.bind(function() {
				this.page = Math.min(this.page + 1, maxPage);
			}, this), 1000);
		}, this);

		this.reset();
	};

	_.extend(HelpGame.prototype, Backbone.Events, {
		page: 1,

		toJSON: function() {
			return {
				page: this.page
			};
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
			this.page = 1;
		}
	});

	return {
		factory: function() {
			if (!instance) {
				instance = new HelpGame();
			}
			return instance;
		}
	};
})(window.Backbone, window.Models.Settings, window.Backbone.LocalStorage, window.Collections.Deck, window.Collections.Board);
