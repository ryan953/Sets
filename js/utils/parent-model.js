define([
	'underscore',
	'backbone',
	'utils/clock'
], function(_, Backbone, Clock) {
	"use strict";

	var store = {},
		counts = {},
		ModelConstructor = Backbone.Model;

	var Model;

	// Move this into a router
	// When the route is changing we probably want to stop
	// the clock so that we can focus on loading the next
	// route and not purging data that we might need
	new Clock({
		delay: 100,
		tickAction: function() {
			Model.purgeStore();
			console.log('tick');
			return true;
		}
	}).start();

	return Model = Backbone.Model.extend({
		constructor: function(attributes, options) {
			var storeid = (this.name || '') + attributes[this.idAttribute],
				inst = store[storeid];

			if (!inst) {
				store[storeid] = inst = new ModelConstructor(attributes, options);
				inst.release = function() {
					counts[storeid]--;
				};
			}

			counts[storeid] = (counts[storeid] || 0) + 1;

			return inst;
		}
	}, {
		purgeStore: function() {
			_.each(counts, function(count, storeid) {
				if (count === 0 && store[storeid]) {
					delete store[storeid];
					console.log('deleted', storeid);
				}
			});
		}
	});
});
