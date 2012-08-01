/*global Backbone document */
window.Views = window.Views || {};

window.Views.Chrome = (function(Parent, Slot) {
	"use strict";

	return Parent.extend({
		tagName: 'div',
		className: '',

		events: {},

		render: function() {

			return this;
		}
	});

})(Backbone.View, window.Models.Slot);
