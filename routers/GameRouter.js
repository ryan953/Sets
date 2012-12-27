/*globals $ Backbone */

window.GameRouter = (function(Parent, Sets, Stats, Views) {
	"use strict";

	return Parent.extend({
		routes: {
			'show/:lightbox': 'lightbox',    // #help
			'': 'hideLightboxes'
		},

		_lastLightbox: null,

		initialize: function(options) {
			this.stats = new Stats({id: 1});

			this.game = new Sets({
				settings: options.settings,
				stats: this.stats
			});
			this.gameBoard = new Views.Sets({
				game: this.game
			}).render();
			options.$root.append(this.gameBoard.el);

			Backbone.history.start({root: window.location.pathname});
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
			}).render();

			if (this._lastLightbox) {
				$('body').append(this._lastLightbox.el);
				this._lastLightbox.$el.removeClass('hide');
			}
		}
	});
})(Backbone.Router, window.Sets, window.Models.Stats, window.Views);
