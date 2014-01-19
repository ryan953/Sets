/*global $, Backbone */

window.GameRouter = (function(Parent, Sets, Views) {
	"use strict";

	return Parent.extend({
		routes: {
			'show/:lightbox': 'lightbox',    // #help
			'': 'hideLightboxes'
		},

		_lastLightbox: null,

		initialize: function(options) {
			this.game = new Sets({
				settings: options.settings,
				stats: options.stats
			});
			this.gameBoard = new Views.Sets({
				game: this.game
			}).render();
			$(options.rootSelector).append(this.gameBoard.el);

			if (!Backbone.History.started) {
				Backbone.history.start({root: window.location.pathname});
			}
		},

		hideLightboxes: function() {
			if (this._lastLightbox) {
				this._lastLightbox.remove();
				this._lastLightbox = null;
			}
		},

		lightbox: function(clazz) {
			if (!Views[clazz]) {
				return null;
			}

			this.hideLightboxes();

			this._lastLightbox = new Views[clazz]({
				game: this.game
			});

			$('body').append(this._lastLightbox.el);
			this._lastLightbox.render();
		}
	});
})(Backbone.Router, window.Sets, window.Views);
