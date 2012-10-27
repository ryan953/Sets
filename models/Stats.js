/*globals _ Backbone */
window.Models = window.Models || {};

window.Models.Stats = (function(Storage) {
	"use strict";

	return Backbone.Model.extend({
		localStorage: new Storage("stats"),

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

		initialize: function() {
			this.on('change', this.save, this);

			this.fetch();
		},

		reset: function() {
			this.set(this.defaults);
		}
	});

}(Backbone.LocalStorage));
