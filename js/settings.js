/*global Storage:false */

window.Settings = (function($) {
	"use strict";
	var store = Storage.factory();

	var Settings = {
		_storagekey: 'settings',
		_defaults: {
			"easy-mode":false,
			"help-mode":false,
			"scoreboardDisplay":"score"
		},
		data: {},

		init: function() {
			this.inputs = $('[id^=settings-]');
			this.loadData();
			this.initUI();
			this.bindEvents();
		},

		loadData: function() {
			this.data = store.get(this._storagekey);
			if (!this.data) {
				this.data = this._defaults;
			}
		},

		save: function() {
			store.put(this._storagekey, this.data);
		},

		initUI: function() {
			var _settings = this;
			this.inputs.each(function() {
				var self = $(this),
					key = self.prop('name'),
					value = _settings.data[key];
				if (value) {
					if (self.is(':checkbox')) {
						self.prop('checked', value);
						self.trigger('click');
						self.prop('checked', value);
					} else {
						self.val(value);
					}
				}
			});
		},

		bindEvents: function() {
			var _settings = this;
			this.inputs.bind('change', function() {
				var self = $(this),
					key = self.prop('name'),
					value = self.val();
				if (self.is(':checkbox')) {
					value = self.prop('checked');
				}
				_settings.data[key] = value;
				_settings.save();
			});
		},

		selectedMode: function() {
			return (this.data['easy-mode'] ? 'easy' : 'regular');
		},

		helpMode: function() {
			return (this.data['help-mode']);
		}
	};

	$(document).ready(function() {
		Settings.init();

		// jquery plugin for '.scoreboard-display .time' is needed
		$('.scoreboard-display [data-scoreboard-display]').bind('click', function() {
			var elem = $(this);
			var visible = elem.hide().next('[data-scoreboard-display]').show();
			if (!visible.length) {
				visible = elem.siblings('[data-scoreboard-display]').first().show();
			}
			Settings.data.scoreboardDisplay = visible.data('scoreboardDisplay');
			Settings.save();
			return false;
		});
	});

	return Settings;
})(jQuery);