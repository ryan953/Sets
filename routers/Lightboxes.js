/*globals $ Backbone */

window.Router = (function(Parent, Sets, Views) {
	"use strict";

	return Parent.extend({
		routes: {
			'show/:lightbox': 'lightbox',    // #help
			'': 'hideLightboxes'
		},

		_cachedLightboxes: {},

		initialize: function(options) {
			this.options = options;

			this.game = new Sets({
				settings: options.settings
			});
			this.gameBoard = new Views.Sets({
				game: this.game
			}).render();
			options.$root.append(this.gameBoard.el);

			this.wrapLightbox($('.lightbox'));

			Backbone.history.start({root: "/sets"});
		},

		hideLightboxes: function() {
			$('.lightbox').addClass('hide');
		},

		lightbox: function(clazz) {
			this.hideLightboxes();

			var lightbox = this._cachedLightbox(clazz);
			if (lightbox) {
				lightbox.$el.removeClass('hide');
			}
		},

		_cachedLightbox: function(clazz) {
			if (!Views[clazz]) {
				return null;
			}
			if (!this._cachedLightboxes[clazz]) {
				var lightbox = new Views[clazz]({
					game: this.game
				}).render();

				$('body').append(lightbox.el);
				this.wrapLightbox(lightbox.$el);

				this._cachedLightboxes[clazz] = lightbox;
			}

			return this._cachedLightboxes[clazz];
		},

		wrapLightbox: function($el) {
			$('<a>')
				.addClass('right button lightbox-close')
				.text('Close')
				.prop('href', '#')
				.wrapInner('<span>')
				.appendTo( $el );
			$el.wrapInner('<div>');
		}
	});
})(Backbone.Router, window.Sets, window.Views);
