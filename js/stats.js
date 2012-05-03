/*global Storage jintervals */

window.Stats = (function($, store) {
	"use strict";

	var Stats = {
		_storagekey: 'stats',
		_defaults: {
			'games-start': 0,
			'games-win': 0,
			'games-lose': 0,
			'time-total': 0,
			'time-average': 0,
			'time-average-win': 0,
			'time-shortest-win': 0,
			'time-longest-win': 0,
			'streak-current': 0,
			'streak-current-type': 'win',
			'streak-win': 0,
			'streak-lose': 0,
			'cards-0': 0,
			'cards-3': 0,
			'cards-6': 0,
			'cards-9': 0,
			'cards-more': 0	
		},
		data: {},

		init: function() {
			this.statsDisplays = $('#stats').find('.table dd');
			this._loadData();
		},

		reset: function() {
			this.data = this._defaults;
			this.save();
		},

		_loadData: function() {
			this.data = store.get(this._storagekey);
			if (!this.data) {
				this.data = this._defaults;
			}
		},

		save: function() {
			store.put(this._storagekey, this.data);
		},

		bindEvents: function(game, assistant) {
			var data = this.data;
			game
				.bind('start', function() {
					data['games-start'] += 1;
				})
				.bind('end', function(result) {
					if (result.win) {
						data['games-win'] += 1;
					} else {
						data['games-lose'] += 1;
					}
				});
		},

		display: function() {
			var STATS_TIME_FORMAT = '{dd?:}{hh?:}{mm}:{ss}';
			var stats = $.extend({}, this.data);
			stats['games-incomplete'] = stats['games-start'] - stats['games-win'] - stats['games-lose'];
			stats['games-percent'] = stats['games-win'] / (stats['games-win'] + stats['games-lose']) || 0;
			// stats['time-total'] = jintervals(stats['time-total'], STATS_TIME_FORMAT);
			// stats['time-average'] = jintervals(stats['time-average'], STATS_TIME_FORMAT);
			// stats['time-average-win'] = jintervals(stats['time-average-win'], STATS_TIME_FORMAT);
			// stats['time-shortest-win'] = jintervals(stats['time-shortest-win'], STATS_TIME_FORMAT);
			// stats['time-longest-win'] = jintervals(stats['time-longest-win'], STATS_TIME_FORMAT);
			this.statsDisplays.each(function() {
				var elem = $(this);
				var statName = elem.data('stat');
				elem.text(stats[statName]);
			});
		}
	};

	return Stats;
})(jQuery, Storage.factory());
