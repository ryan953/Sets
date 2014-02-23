define([
	'underscore',
	'moment'
], function(_, moment) {
	"use strict";

	var pad = function(num, padLeft, padRight) {
			var str = "" + num;
			padLeft = padLeft || "";
			padRight = padRight || "";
			return [
				padLeft.substring(0, padLeft.length - str.length),
				str,
				padRight.substring(0, padRight.length - str.length)
			].join('');
		},
		padLeft = function(num, padding) {
			return pad(num, padding || "00");
		},
		padRight = function(num, padding) {
			return pad(num, '', padding || "00");
		};

	var TimeDisplay = function(options) {
		this.$el = options.$el;
	};

	_.extend(TimeDisplay, {
		formatTimeDiff: function(milliSeconds, showMilliseconds) {
			var dur = moment.duration(milliSeconds || 0),
				hours = dur.hours(),
				mins = padLeft(dur.minutes(), '0'),
				sec = padLeft(dur.seconds(), '00'),
				milli = padRight(dur.milliseconds(), '000'),
				time = mins + ":" + sec;
			if (showMilliseconds) {
				return time + '.' + milli;
			}
			return (hours ? hours + ':' : '') + time;
		}
	});

	_.extend(TimeDisplay.prototype, {
		render: function(duration, showMilliseconds) {
			this.$el.html(
				TimeDisplay.formatTimeDiff(duration, showMilliseconds)
			);
		}
	});

	return TimeDisplay;

});
