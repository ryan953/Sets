/*global Date */

window.Utils = window.Utils || {};

/*
 * A pausable counter to keep track of how long something takes.
 * Does not consume cpu when counting, duration is the diff between start() and
 * stop() times. Can be paused and continued, and can have current total
 * reported a while the clock is still running.
 */
window.Utils.StopWatch = (function(_) {
	"use strict";

	var states = {
		COUNTING: 'counting',
		PAUSED: 'paused'
	};

	var _now = function() {
		return +(new Date());
	};

	var _getStartTimeDelta = function(startTime) {
		return _now() - startTime;
	};

	var StopWatch = function() {
		this._state = states.PAUSED;
		this._times = [];
		this._startTime = 0;
	};

	_.extend(StopWatch, states);

	_.extend(StopWatch.prototype, {
		_state: null,
		_times: null,
		_startTime: null,

		start: function() {
			if (this._state === states.COUNTING) {
				return;
			}
			this._state = states.COUNTING;
			this._startTime = _now();
		},

		pause: function() {
			if (this._state === states.PAUSED) {
				return;
			}
			this._state = states.PAUSED;
			this._times.push(_getStartTimeDelta(this._startTime));
		},

		reset: function() {
			this._times = [];
			this._startTime = 0;
			if (this._state == states.COUNTING) {
				this._startTime = _now();
			}
		},

		state: function() {
			return this._state;
		},

		milliseconds: function() {
			var delta = 0;
			if (this._state === states.COUNTING) {
				delta = _getStartTimeDelta(this._startTime);
			}
			return _.reduce(this._times, function(memo, num) {
				return memo + num;
			}, delta);
		},

		seconds: function() {
			return this.milliseconds() / 1000;
		}
	});

	return StopWatch;
})(window._);
