define([
	'backbone',
	'./clock',
	'model'
], function(Backbone, Clock, Model) {
	"use strict";

	var loadUrl = Backbone.History.prototype.loadUrl;
	var clock = null;

	/*
	 * When the route is changing we want to stop
	 * the clock so that we can focus on loading the next
	 * route and not purging data that we might need
	 */
	return {
		initialize: function() {
			if (clock) {
				return;
			}

			clock = new Clock({
				delay: 100,
				tickAction: function() {
					Model.purgeCache();
					return true;
				}
			});

			Backbone.History.prototype.loadUrl = function(fragment) {
				clock.stop();
				var rtrn = loadUrl.call(this, fragment);
				clock.start();
				return rtrn;
			};
		},

		destroy: function() {
			clock.stop();
			clock = null;

			Backbone.History.prototype.loadUrl = loadUrl;
		}
	};


	
	
});

