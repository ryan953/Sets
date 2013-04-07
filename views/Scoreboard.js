/*global $, _, Backbone, Clock, moment */
window.Views = window.Views || {};

window.Views.Scoreboard = (function(Parent, Clock) {
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

	return Parent.extend({
		tagName: 'p',
		className: 'center scoreboard-display',

		events: {
			'click a': 'nextScoreboard'
		},

		delay: {
			fastSpeed: 50,
			slowSpeed: 500,
			after: (60 * 1000)
		},

		initialize: function() {
			this.game = this.options.game;

			this.game.on('game:start', this.render, this);
			this.game.on('change:foundSets', this.render, this);
			this.game.on('change:paused', this.pauseClock, this);
			this.game.settings.on('change:scoreboard-display', this.render, this);

			this.template = _.template($('#tmpl-scoreboard').text());

			this.clock = this.makeClock();
		},

		render: function() {
			var found = this.game.getFoundCardCount(),
				deckSize = this.game.getStartingDeckSize(),
				displayType = this.game.settings.get('scoreboard-display');

			this.$el.html(this.template({
				type: displayType,
				percent: Math.round(Math.max(found / deckSize * 100, 0)) || 0,
				remaining: deckSize - found,
				found: found,
				deckSize: deckSize
			}));

			if (displayType === 'time' && !this.game.isGameComplete()) {
				this.clockFace = this.$('.time');
				this.clock.on('click.start clock.tick', this.updateClockTick, this);
				this.clock.start();
				this.clockTick();
			} else {
				this.clock.stop();
				this.clock.off(null, this.updateClockTick);
			}

			return this;
		},

		nextScoreboard: function() {
			this.game.settings.setNextScoreboardDisplay();
		},

		makeClock: function() {
			var clock = new Clock({}, {
				tickAction: _.bind(this.clockTick, this),
				delay: this.delay.fastSpeed
			});
			clock.on('clock.start clock.tick', this.updateClockTick, this);
			return clock;
		},

		clockTick: function() {
			this.clockFace.html(
				this.formatTimeDiff(
					this.game.getTimeDiff()
				)
			);
			return true;
		},

		updateClockTick: function(clock) {
			if (this.game.getTimeDiff() > this.delay.after) {
				clock.setTickSpeed(this.delay.slowSpeed);
			} else {
				clock.setTickSpeed(this.delay.fastSpeed);
			}
		},

		pauseClock: function(game, isPaused) {
			if (isPaused) {
				this.clock.stop();
			} else if (this.game.settings.get('scoreboard-display') === 'time') {
				this.clock.start();
			}
		},

		formatTimeDiff: function(diff) {
			var dur = moment.duration(diff),
				hours = dur.hours(),
				mins = padLeft(dur.minutes(), '0'),
				sec = padLeft(dur.seconds(), '00'),
				milli = padRight(dur.milliseconds(), '000'),
				time = mins + ":" + sec;
			if (diff < this.delay.after) { // more precise when ticking faster
				return time + '.' + milli;
			}
			return (hours ? hours + ':' : '') + time;
		}
	});

})(Backbone.View, window.Clock);
