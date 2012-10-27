/*global $ _ Backbone document */
window.Views = window.Views || {};
window.Views.Bases = window.Views.Bases || {};

window.Views.Bases.LightboxView = (function(Parent) {
	"use strict";

	return Parent.extend({
		addCloseButton: function() {
			$('<a>')
				.addClass('right button lightbox-close')
				.text('Close')
				.prop('href', '#')
				.wrapInner('<span>')
				.appendTo( this.$el.children('div') );
		}
	});

})(Backbone.View);
