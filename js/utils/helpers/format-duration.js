define(['handlebars', '../duration-display'], function(Handlebars, TimeDisplay) {
	"use strict";

	Handlebars.registerHelper('format-duration', function(time, options) {
		return new Handlebars.SafeString(
			TimeDisplay.formatTimeDiff(time, options.hash.showMilliseconds)
		);
	});
});
