/*global $, _, Backbone, document */
window.Views = window.Views || {};
window.Views.Bases = window.Views.Bases || {};

window.Views.Bases.LightboxView = (function(Parent) {
	"use strict";

	return Parent.extend({
		tagName: 'div',
		className: 'lightbox hide',

		addCloseButton: function() {
			$('<a>')
				.addClass('right button lightbox-close')
				.text('Close')
				.prop('href', '#')
				.wrapInner('<span>')
				.appendTo( this.$el.children('div') );
		},

		afterRender: function() {
			this.addCloseButton();
			this.$el.removeClass('hide');
		}
	});

})(Backbone.View);
