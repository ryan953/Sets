define([
	'view',
	'hbs!../templates/scoreboard',
	'utils/helpers/animate',
	'utils/helpers/format-duration'
], function(View, template) {
	"use strict";

	return View.extend({
		tagName: 'p',
		className: 'center scoreboard-display',

		template: template,

		events: {
			'click a': function() {
				this.model.settings.setNextScoreboardDisplay();
			},
			model: {
				'game:start': 'render',
				'change:foundSets': 'render'
			}
		},

		delay: {
			fastSpeed: 50,
			slowSpeed: 500,
			after: (60 * 1000)
		},

		timeDisplay: null,

		initialize: function() {
			this.listenTo(this.model.settings, 'change:scoreboard-display', this.render);
			this.listenTo(this.model.foundSets, 'change', this.render);
		},

		context: function() {
			var found = this.model.foundSets.getCount(),
				deckSize = this.model.getStartingDeckSize(),
				displayType = this.model.settings.get('scoreboard-display'),
				milliseconds = this.model.stopWatch.milliseconds();
			
			return {
				inProgress: this.model.get('in-progress'),
				type: {
					score: displayType === 'score',
					remaining: displayType === 'remaining',
					percent: displayType === 'percent',
					time: displayType === 'time',
				},
				found: found,
				deckSize: deckSize,
				remaining: deckSize - found,
				percent: Math.round(Math.max(found / deckSize * 100, 0)) || 0,

				milliseconds: milliseconds,
				showMilli: milliseconds < this.delay.after // more precise when ticking faster
			};
		}
	});

});
