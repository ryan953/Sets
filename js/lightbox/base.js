define('lightbox/base', [
	'jquery',
	'thorax'
], function($, Thorax) {
	"use strict";

	return Thorax.View.extend({
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

});
