/*jshint smarttabs:true */
/*global _, Backbone, setTimeout, clearTimeout */

window.Clock = (function(Parent) {
	"use strict";

	return Parent.extend({
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
		 * Takes a delay between clock ticks, and an action to do each tick
		 * when the action returns false the clock will turn itself off
		 */
		start: function() {
			this.stop();
			this.timer = setTimeout(this.clockTick, this.delay);
			this.trigger('clock.start', this);
		},

		/**
		 * Stop the timer so we don't keep running anything
		 */
		stop: function() {
			if (this.timer) {
				clearTimeout(this.timer);
				this.timer = null;
				this.trigger('clock.stop', this);
			}
		}
	});
})(Backbone.Model);
