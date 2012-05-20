/*jshint smarttabs:true */
/*global setTimeout clearTimeout Event */

window.Clock = (function() {
	"use strict";

	var Clock = function(tickAction, delay) {
		Event.patch.call(this);

		var _this = this;
		_this.delay = delay;
		_this.clockTick = function() {
			if (tickAction()) {
				_this.trigger('clock.tick');
				_this.timer = setTimeout(_this.clockTick, _this.delay);
			} else {
				_this.stop();
			}
		};
	};

	/**
	 * Takes a delay between clock ticks, and an action to do each tick
	 * when the action returns false the clock will turn itself off
	 */
	Clock.prototype.start = function() {
		this.stop();
		this.timer = setTimeout(this.clockTick, this.delay);
		this.trigger('clock.start');
	};

	/**
	 * Stop the timer so we don't keep running anything
	 */
	Clock.prototype.stop = function() {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
			this.trigger('clock.stop');
		}
	};

	return Clock;
})();
