define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	"use strict";

	return Backbone.Model.extend({
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

		setPlus: function(field, amount) {
			this.set(field, this.get(field) + amount);
		},

		setPlusOne: function(field) {
			this.setPlus(field, 1);
		},
		setLessOne: function(field) {
			this.setPlus(field, -1);
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

				var duration = game.stopWatch.milliseconds(),
					cardsRemaining = game.deck.length;

				this.countOutcome(outcome);
				this.updatePercent();

				this.setPlus('time_total', duration);
				this.updateWinningTimes(outcome, duration);
				this.countStreaks(outcome);
				this.countCardsRemaining(cardsRemaining);
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
			var percent = this.get('games_win') / this.get('games_start');
			this.set({
				games_percent: (percent * 100) || 0
			});
		},

		updateWinningTimes: function(outcome, duration) {
			var win_count = this.get('games_win'),
				game_count = this.get('games_start'),
				values = {
					time_average_all: ((this.get('time_average_all') + duration) / game_count) || 0
				};

			if (outcome == 'win') {
				values.time_average_win = (this.get('time_average_win') + duration) / win_count;
				values.time_shortest_win = Math.min(this.get('time_shortest_win') || duration, duration);
				values.time_longest_win = Math.max(this.get('time_longest_win'), duration);
			}
			this.set(values);
		},

		countStreaks: function(outcome) {
			var current_type = this.get('streak_current_type') || outcome,
				current_count = this.get('streak_current_count') || 0,
				values = {streak_current_type: outcome};

			if (current_type == outcome) {
				current_count += 1;
			} else {
				current_count = 0;
			}
			values.streak_current_count = current_count;

			if (outcome == 'win') {
				values.streak_win = Math.max(this.get('streak_win'), current_count);
			} else {
				values.streak_lose = Math.max(this.get('streak_lose'), current_count);
			}

			this.set(values);
		},

		countCardsRemaining: function(numCards) {
			if (numCards === 0) {
				this.setPlusOne('cards_zero');
			} else if (numCards <= 3) {
				this.setPlusOne('cards_three');
			} else if (numCards <= 6) {
				this.setPlusOne('cards_six');
			} else if (numCards <= 9) {
				this.setPlusOne('cards_nine');
			} else {
				this.setPlusOne('cards_more');
			}
		}

	});

});
