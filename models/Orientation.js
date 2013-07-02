/*global window, _, Backbone */

window.Orientation = (function() {
	"use strict";

	var obj = _.extend({
		isPortrait: false,

		init: function() {
			if (window.matchMedia) {
				this.listenForMediaMatch();
			} else {
				this.listenForScreenSizeChange();
			}
		},

		setOrientation: function(isPortrait) {
			this.isPortrait = isPortrait;
			this.trigger('change', isPortrait);
		},

		listenForMediaMatch: function() {
			var mediaQueryListener = window.matchMedia("(orientation: portrait)");
			mediaQueryListener.addListener(_.bind(function(m) {
				this.setOrientation(m.matches);
			}, this));
			this.setOrientation(mediaQueryListener.matches);
		},

		listenForScreenSizeChange: function() {
			$(window).on('resize', _.throttle(_.bind(function() {
				this.setOrientation(window.innerHeight > window.innerWidth);
			}, this), 250));
			this.setOrientation(window.innerHeight > window.innerWidth);
		}
	}, Backbone.Events);

	obj.init();

	return obj;
})();
