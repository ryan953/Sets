/*globals Backbone */
window.Models = window.Models || {};

window.Models.Card = (function() {
	"use strict";

	var allowedTypes = {
		counts: [1, 2, 3],
		shapes: ['Diamond', 'Squiggle', 'Oval'], //['Triangle', 'Circle', 'Square'],
		fills: ['solid', 'empty', 'striped'],
		colors: ['red', 'green', 'blue'],

		is_selected: false
	};

	return Backbone.Model.extend({
		defaults: {
			'num': allowedTypes.counts[0],
			'shape': allowedTypes.shapes[0],
			'color': allowedTypes.colors[0],
			'fill': allowedTypes.fills[0],

			// card states
			'is_selected': false,
			'possible': null,
			'invalid': null
		},

		select: function() {
			this.set({
				is_selected: true
			});
		},
		deselect: function() {
			this.set({
				is_selected: false
			});
		},
		toggleSelect: function() {
			this.set({
				is_selected: this.get('is_selected')
			});
		}
	}, allowedTypes);

}());
