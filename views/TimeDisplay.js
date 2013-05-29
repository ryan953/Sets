/*global Backbone, moment */
window.Views = window.Views || {};

window.Views.TimeDisplay = (function(Parent) {
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

	var statics = {
		formatTimeDiff: function(milliSeconds, showMilliseconds) {
			var dur = moment.duration(milliSeconds),
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
	};

	return Parent.extend({
		render: function(duration, showMilliseconds) {
			this.$el.html(
				statics.formatTimeDiff(duration, showMilliseconds)
			);
		}
	}, statics);

})(Backbone.View);
