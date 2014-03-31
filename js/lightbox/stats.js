/*global confirm */

define('lightbox/stats', [
	'jquery',
	'underscore',
	'./base',
	'utils/duration-display',
	'hbs!./templates/stats'
], function($, _, Parent, TimeDisplay, template) {
	"use strict";

	return Parent.extend({
		template: template,
		
		events: {
			'click #stats-reset': function(/* e */) {
				var message = [
					"Are you sure you want all the current stats to be reset?",
					"",
					"This operation cannot be undone."
				].join("\n");
				if (confirm(message)) {
					this.stats.reset();
				}
			}
		},

		initialize: function() {
			this.stats = this.game.stats;

			this.listenTo(this.stats, 'change', this.render);
		},

		context: function() {
			var json = this.stats.toJSON();

			if (json.games_percent === parseInt(json.games_percent, 10)) {
				json.games_percent = json.games_percent.toFixed(0);
			} else {
				json.games_percent = json.games_percent.toFixed(2);
			}

			json.time_total = TimeDisplay.formatTimeDiff(json.time_total);
			json.time_average_all = TimeDisplay.formatTimeDiff(json.time_average_all);
			json.time_average_win = TimeDisplay.formatTimeDiff(json.time_average_win);
			json.time_shortest_win = TimeDisplay.formatTimeDiff(json.time_shortest_win);
			json.time_longest_win = TimeDisplay.formatTimeDiff(json.time_longest_win);
			return json;
		}
	});

});
