define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	"use strict";

	var allowedTypes = {
		counts: [1, 2, 3],
		shapes: ['Diamond', 'Squiggle', 'Oval'], //['Triangle', 'Circle', 'Square'],
		fills: ['solid', 'empty', 'striped'],
		colors: ['red', 'green', 'blue']
	};

	var comparator = function(left, right) {
		if (left.color != right.color) {
			return (left.color > right.color ? -1 : 1);
		}
		if (left.shape != right.shape) {
			return (left.shape > right.shape ? -1 : 1);
		}
		if (left.num != right.num) {
			return (left.num > right.num ? -1 : 1);
		}
		if (left.fill != right.fill) {
			return (left.fill > right.fill ? -1 : 1);
		}
		return 0;
	};

	var staticValues = _.extend({}, allowedTypes, {comparator:comparator});

	return Backbone.Model.extend({
		defaults: {
			num: allowedTypes.counts[0],
			shape: allowedTypes.shapes[0],
			color: allowedTypes.colors[0],
			fill: allowedTypes.fills[0]
		}
	}, staticValues);

});
