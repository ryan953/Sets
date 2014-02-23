/*global confirm */

define('lightbox/stats', [
	'jquery',
	'underscore',
	'./base',
	'utils/time-display'
], function($, _, Parent, TimeDisplay) {
	"use strict";

	return Parent.extend({
		events: {
			'click #stats-reset': 'resetStats'
		},

		initialize: function() {
			this.game = this.options.game;
			this.stats = this.game.stats;

			this.listenTo(this.stats, 'change', this.render);

			this.template = _.template($('#tmpl-statslightbox').text());
		},

		render: function() {
			this.$el.html(this.template(this.getData()));

			this.afterRender();
			return this;
		},

		getData: function() {
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
		},

		resetStats: function(/* e */) {
			var messages = [
				"Are you sure you want all the current stats to be reset?",
				"",
				"This operation cannot be undone."
			];
			if (confirm(messages.join("\n"))) {
				this.stats.reset();
			}
		}
	});

});
