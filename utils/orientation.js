window.Utils = window.Utils || {};

/*
 * A shim class to provide consistent orientation change events
 * Tries to use mediaMatch events but falls back to window.resize events for
 * compatibility with old browsers
 */
window.Utils.Orientation = (function(_, Backbone) {
	"use strict";

	var currentIsPortrait = null,
		emitter = _.extend({
			isPortrait: function() {
				return currentIsPortrait;
			},
			isLandscape: function() {
				return !currentIsPortrait;
			}
		}, Backbone.Events),

		setOrientation = function(newIsPortrait) {
			currentIsPortrait = newIsPortrait;
			emitter.trigger('change', newIsPortrait);
		},

		listenForMediaMatch = function() {
			var mediaQueryListener = window.matchMedia("(orientation: portrait)");
			mediaQueryListener.addListener(function(m) {
				setOrientation(m.matches);
			});
			setOrientation(mediaQueryListener.matches);
		},

		listenForScreenSizeChange = function() {
			var checkWindowSize = function() {
				var isPortraitNow = window.innerHeight > window.innerWidth;
				if (currentIsPortrait !== isPortraitNow) {
					setOrientation(isPortraitNow);
				}
			};
			$(window).on('resize', _.throttle(function() {
				checkWindowSize();
			}, 250));
			checkWindowSize();
		};

	if (false && window.matchMedia) {
		listenForMediaMatch();
	} else {
		listenForScreenSizeChange();
	}

	return emitter;
})(window._, window.Backbone);
