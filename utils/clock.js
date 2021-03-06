/*jshint smarttabs:true */
/*global setTimeout, clearTimeout */

/*
 * An evented interface over what is essentially setInterval()
 * Callbacks can register for the clock.* events and do stuff like update
 * at a predictable rate
 */
define('utils/clock', [
	'underscore',
	'backbone'
], function(_, Backbone) {
	"use strict";

	var Clock = function(options) {
		this.delay = options.delay;
		this.clockTick = _.bind(function() {
			if (options.tickAction()) {
				this.trigger('clock.tick', this);
				this.timer = setTimeout(this.clockTick, this.delay);
			} else {
				this.stop();
			}
		}, this);
	};

	_.extend(Clock.prototype, Backbone.Events, {
		setTickSpeed: function(delay) {
			this.delay = delay;
		},

		/**
		 * Start a clock ticking at `this.delay` intervals
		 */
		start: function() {
			this.stop();
			this.timer = setTimeout(this.clockTick, this.delay);
			this.trigger('clock.start', this);
		},

		/**
		 * Stop the timer so we don't keep running any callbacks
		 */
		stop: function() {
			if (this.timer) {
				clearTimeout(this.timer);
				this.timer = null;
				this.trigger('clock.stop', this);
			}
		}
	});

	return Clock;
});
