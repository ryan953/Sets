/*global Backbone document */
window.Views = window.Views || {};

window.Views.Chrome = (function(Parent) {
	"use strict";

	return Parent.extend({
		tagName: 'div',
		className: '',

		events: {
			'click .game-reset': 'resetGame'
		},

		initialize: function() {
			this.game = this.options.game;

			this.template = _.template($('#tmpl-menu').text());
		},

		render: function() {
			this.$el.html(this.template());

			// Lightbox stuff -> jquery plugin?
			$('<a>')
				.addClass('right button lightbox-close')
				.text('Close')
				.prop('href', '#')
				.wrapInner('<span>')
				.appendTo( $('.lightbox') );
			$('.lightbox').wrapInner('<div>');

			return this;
		},

		resetGame: function() {
			this.game.start('easy');
		}
	});

})(Backbone.View);
