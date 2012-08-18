/*global $ _ Backbone document */
window.Views = window.Views || {};

window.Views.Chrome = (function(Parent, Scoreboard) {
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

			this.$('.scoreboard-placeholder').append(
				new Scoreboard({
					settings: this.game.settings
				}).render().el
			);

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

})(Backbone.View, window.Views.Scoreboard);
