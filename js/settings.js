/*global Storage:false Event:false */

window.Settings = (function($, Storage) {
	"use strict";

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
			this.store = Storage.factory();
			this.loadData();
			this.initUI();
			this.bindEvents();
		},

		loadData: function() {
			this.data = this.store.get(this._storagekey);
			if (!this.data) {
				this.data = this._defaults;
			}
		},

		save: function() {
			this.store.put(this._storagekey, this.data);
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
				_settings.trigger('change:'+key, value);
			});
		},

		selectedMode: function() {
			return (this.data['easy-mode'] ? 'easy' : 'regular');
		},

		helpMode: function() {
			return (this.data['help-mode']);
		}
	};

	Event.patch.call(Settings);
	return Settings;
})(jQuery, Storage);

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
