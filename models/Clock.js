/*jshint smarttabs:true */
/*global _, Backbone, setTimeout, clearTimeout */

/*
 * Callbacks can register for the clock.* events and do stuff,
 * this is a different interface over what is essentially setInterval()
 */
window.Clock = (function(Events) {
	"use strict";
	var Clock = function() {
		this.initialize.apply(this, [].slice.call(arguments));
	};
	_.extend(Clock.prototype, Events, {
		initialize: function(attributes, options) {
			this.delay = options.delay;
			this.clockTick = _.bind(function() {
				if (options.tickAction()) {
					this.trigger('clock.tick', this);
					this.timer = setTimeout(this.clockTick, this.delay);
				} else {
					this.stop();
				}
			}, this);
		},

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
})(Backbone.Events);
