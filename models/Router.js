/*globals $ Backbone */

window.Router = (function(Parent, Sets, Views) {
	"use strict";

	return Parent.extend({
		routes: {
			'show/:lightbox': 'lightbox',    // #help
			'': 'home'
		},

		lightboxes: {},

		initialize: function(options) {
			this.options = options;
			Backbone.history.start({root: "/sets", silent: true});

			this.game = new Sets();
			this.gameBoard = new Views.Sets({
				game: this.game
			}).render();

			options.$root.append(this.gameBoard.el);
		},

		home: function() {
			this.hideLightboxes();
		},

		lightbox: function(clazz) {
			this.hideLightboxes();

			var lightbox = this.getLightbox(clazz);
			if (lightbox) {
				lightbox.$el.removeClass('hide');
			}
		},

		getLightbox: function(clazz) {
			if (!Views[clazz]) {
				return null;
			}
			if (!this.lightboxes[clazz]) {
				this.lightboxes[clazz] = new Views[clazz]({
					game: this.game
				}).render();

				$('body').append(this.lightboxes[clazz].el);

				$('<a>')
					.addClass('right button lightbox-close')
					.text('Close')
					.prop('href', '#')
					.wrapInner('<span>')
					.appendTo( $('.lightbox') );
			}
			this.lightboxes[clazz].$el.wrapInner('<div>');

			return this.lightboxes[clazz];
		},

		hideLightboxes: function() {
			$('.lightbox').addClass('hide');
		}
	});
})(Backbone.Router, window.Sets, window.Views);
