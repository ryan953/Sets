/*global _, Backbone */
window.Models = window.Models || {};

window.Models.Stats = (function(Parent) {
	"use strict";

	return Parent.extend({
		defaults: {
			games_start: 0,
			games_win: 0,
			games_lose: 0,
			games_incomplete: 0,
			games_percent: 0,

			time_total: 0,
			time_average_all: 0,
			time_average_win: 0,

			time_shortest_win: 0,
			time_longest_win: 0,

			streak_current_count: 0,
			streak_current_type: '',
			streak_win: 0,
			streak_lose: 0,

			cards_zero: 0,
			cards_three: 0,
			cards_six: 0,
			cards_nine: 0,
			cards_more: 0
		},

		initialize: function(attrs, options) {
			this.localStorage = options.localStorage;
			this.on('change', function() {
				_.delay(_.bind(this.save, this));
			});
			this.fetch();
		},

		reset: function() {
			this.set(this.defaults);
		},

		setPlusOne: function(field) {
			this.set(field, this.get(field) + 1);
		},
		setLessOne: function(field) {
			this.set(field, this.get(field) - 1);
		},

		bindTo: function(game) {
			game.on('game:start', function() {
				this.setPlusOne('games_start');
			}, this);
			game.on('game:end', function(outcome) {
				if (!game.board.has_interaction) {
					this.setLessOne('games_start');
					return;
				}

				this.countOutcome(outcome);
				this.updatePercent();
			}, this);
		},

		countOutcome: function(outcome) {
			if (outcome == 'win') {
				this.setPlusOne('games_win');
			} else if (outcome == 'lose' ) {
				this.setPlusOne('games_lose');
			} else {
				this.setPlusOne('games_incomplete');
			}
		},

		updatePercent: function() {
			var percent = (this.get('games_win') / this.get('games_start')) || 0;
			this.set({
				games_percent: percent * 100
			});
		}
	});

})(Backbone.Model);
