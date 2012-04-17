/*global getStore:false */
(function($) {
	"use strict";
	var store = getStore();

	window.Settings = {
		selectedMode: function() {
			return (store.get('settings-easy-mode') ? 'easy' : 'regular');
		},

		helpMode: function() {
			return (store.get('settings-help-mode'));
		}
	};

	$(document).ready(function() {
		// settings -> needs ref to the store
		$('[id^=settings-]').bind('change', function() {
			var self = $(this),
				key = self.prop('id'),
				value = self.val();
			if (self.filter('[type=checkbox]')) {
				value = self.prop('checked');
			}
			// console.debug('writing', key, value);
			store.put(key, value);
		}).each(function() {
			var self = $(this),
				key = self.prop('id'),
				value = store.get(key);
			// console.debug('read', key, value);
			if (value !== null) {
				if (self.filter('[type=checkbox]')) {
					self.prop('checked', value);
				} else {
					self.val(value);
				}
			}
		});

		// jquery plugin for '.scoreboard-display .time' is needed
		$('.scoreboard-display [data-scoreboard-display]').bind('click', function() {
			var elem = $(this);
			var visible = elem.hide().next('[data-scoreboard-display]').show();
			if (!visible.length) {
				visible = elem.siblings('[data-scoreboard-display]').first().show();
			}
			store.put('scoreboardDisplay', visible.data('scoreboardDisplay'));
			return false;
		});
	});
})(jQuery);