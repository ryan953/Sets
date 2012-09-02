/*globals $ Backbone */

window.Router = (function(Parent, Sets, Views) {
	"use strict";

	return Parent.extend({
		routes: {
			'show/:lightbox': 'lightbox',    // #help
			'*': 'hideLightboxes'
		},

		lightboxes: {},

		initialize: function(options) {
			this.options = options;
			Backbone.history.start({root: "/sets"});

			this.game = new Sets();
			this.gameBoard = new Views.Sets({
				game: this.game
			}).render();

			options.$root.append(this.gameBoard.el);
		},

		hideLightboxes: function() {
			$('.lightbox').addClass('hide');
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
				var lightbox = new Views[clazz]({
					game: this.game
				}).render();

				$('body').append(lightbox.el);

				$('<a>')
					.addClass('right button lightbox-close')
					.text('Close')
					.prop('href', '#')
					.wrapInner('<span>')
					.appendTo( $('.lightbox') );
				lightbox.$el.wrapInner('<div>');

				this.lightboxes[clazz] = lightbox;
			}

			return this.lightboxes[clazz];
		}
	});
})(Backbone.Router, window.Sets, window.Views);
