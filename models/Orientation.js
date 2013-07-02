/*global window, _, Backbone */

window.Orientation = (function() {
	"use strict";

	var emitter = _.extend({
		isPortrait: false,

		setOrientation: function(isPortrait) {
			this.isPortrait = isPortrait;
			this.trigger('change', isPortrait);
		}
	}, Backbone.Events);

	(function() {
		var listenForMediaMatch = function() {
			var mediaQueryListener = window.matchMedia("(orientation: portrait)");
			mediaQueryListener.addListener(function(m) {
				emitter.setOrientation(m.matches);
			});
			emitter.setOrientation(mediaQueryListener.matches);
		};

		var listenForScreenSizeChange = function() {
			$(window).on('resize', _.throttle(function() {
				emitter.setOrientation(window.innerHeight > window.innerWidth);
			}, 250));
			emitter.setOrientation(window.innerHeight > window.innerWidth);
		};

		if (window.matchMedia) {
			listenForMediaMatch();
		} else {
			listenForScreenSizeChange();
		}
	})();

	return emitter;
})();
