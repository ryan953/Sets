/*global _, Backbone */
window.Models = window.Models || {};

window.Models.Settings = (function(Parent) {
	"use strict";

	var scoreboardDisplays = {
		SCORE: 'score',
		REMAINING: 'remaining',
		PERCENT: 'percent',
		TIME: 'time'
	};

	return Parent.extend({
		defaults: {
			'scoreboard-display': 'score',
			'mode': 'easy',
			'help': 'on',
			'invalid-slot-delay': 3,
			'end-game-on-non-possible': 'on',
			'debug-not-possible': 'off'
		},

		initialize: function(attrs, options) {
			this.localStorage = options.localStorage;
			this.on('change', function() {
				_.delay(_.bind(this.save, this));
			});
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

})(Backbone.Model);
