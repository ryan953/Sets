/*global $, _, Backbone, Clock */
window.Views = window.Views || {};

window.Views.Scoreboard = (function(Parent, TimeDisplay, Clock) {
	"use strict";

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

		timeDisplay: null,

		initialize: function() {
			this.game = this.options.game;

			this.listenTo(this.game, 'game:start', this.render);
			this.listenTo(this.game, 'change:foundSets', this.render);
			this.listenTo(this.game, 'change:paused', this.pauseClock);
			this.listenTo(this.game.settings, 'change:scoreboard-display', this.render);
			this.listenTo(this.game.foundSets, 'change', this.render);

			this.template = _.template($('#tmpl-scoreboard').text());

			this.clock = new Clock({
				tickAction: _.bind(this.clockTick, this),
				delay: this.delay.fastSpeed
			});
		},

		render: function() {
			var found = this.game.foundSets.getCount(),
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
				this.timeDisplay = new TimeDisplay({
					el: this.$('.time')
				});
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

		clockTick: function() {
			var milliseconds = this.game.stopWatch.milliseconds(),
				showMilli = milliseconds < this.delay.after;  // more precise when ticking faster
			this.timeDisplay.render(milliseconds, showMilli);
			return true;
		},

		updateClockTick: function(clock) {
			if (this.game.stopWatch.milliseconds() > this.delay.after) {
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
		}
	});

})(Backbone.View, window.Views.TimeDisplay, window.Utils.Clock);
