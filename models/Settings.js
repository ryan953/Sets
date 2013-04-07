/*global _, Backbone */
window.Models = window.Models || {};

window.Models.Settings = (function(Parent, Storage) {
	"use strict";

	var scoreboardDisplays = {
		SCORE: 'score',
		REMAINING: 'remaining',
		PERCENT: 'percent',
		TIME: 'time'
	};

	return Parent.extend({
		localStorage: new Storage("settings"),

		defaults: {
			'scoreboard-display': 'score',
			'mode': 'easy',
			'help': 'on',
			'invalid-slot-delay': 3,
			'end-game-on-non-possible': 'on',
			'debug-not-possible': 'off'
		},

		initialize: function() {
			this.on('change', this.save, this);
			this.fetch();
		},

		setNextScoreboardDisplay: function() {
			this.set('scoreboard-display', this._nextScoreboardDisplay());
		},

		_nextScoreboardDisplay: function() {
			var displays = _.values(scoreboardDisplays),
				pos = _.indexOf(displays, this.get('scoreboard-display')) + 1;
			if (pos >= displays.length) {
				pos = 0;
			}
			return displays[pos];
		}
	});

})(Backbone.Model, Backbone.LocalStorage);
