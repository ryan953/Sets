/*global window */

define([
	'jquery',
	'backbone',
	'game/models/sets',
	'v!../views/sets',
	'v!lightbox/help',
	'v!lightbox/settings',
	'v!lightbox/stats'
], function($, Backbone, Sets, SetsView, HelpLightbox, SettingsLightbox, StatsLightbox) {
	"use strict";

	var lightboxViews = {
		'HelpLightbox': HelpLightbox,
		'SettingsLightbox': SettingsLightbox,
		'StatsLightbox': StatsLightbox
	};

	return Backbone.Router.extend({
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
			this.gameBoard = new SetsView({
				game: this.game,
			});
			this.gameBoard.appendTo(options.rootSelector);
		},

		startHistory: function() {
			if (!Backbone.History.started) {
				Backbone.history.start({root: window.location.pathname});
			}
			return this;
		},

		hideLightboxes: function() {
			if (this._lastLightbox) {
				this._lastLightbox.remove();
				this._lastLightbox = null;
			}
		},

		lightbox: function(clazz) {
			if (!lightboxViews[clazz]) {
				return null;
			}

			this.hideLightboxes();

			this._lastLightbox = new lightboxViews[clazz]({
				game: this.game
			});

			this._lastLightbox.appendTo('body');
			this._lastLightbox.render();
			this._lastLightbox.afterRender();
		}
	});
});
