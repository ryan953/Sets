/*global $ _ Backbone document */
window.Views = window.Views || {};

window.Views.SettingsLightbox = (function(Parent) {
	"use strict";

	return Parent.extend({
		tagName: 'div',
		className: 'lightbox hide',

		events: {
			'change input[type=checkbox]': 'changeCheckbox'
		},

		initialize: function() {
			this.game = this.options.game;

			this.game.settings.on('change:mode', this.renderValues, this);
			this.game.settings.on('change:help', this.renderValues, this);

			this.template = _.template($('#tmpl-settingslightbox').text());
		},

		render: function() {
			this.$el.html(this.template());

			this.easy_mode = this.$('#settings-mode-easy');
			this.help_on = this.$('#settings-help-on');

			this.renderValues();

			return this;
		},

		renderValues: function() {
			this.easy_mode.prop('checked', this.game.settings.get('mode') === 'easy');
			this.help_on.prop('checked', this.game.settings.get('help'));
		},

		changeCheckbox: function(e) {
			var elem = $(e.target),
				update = {};
			update[elem.attr('name')] = (elem.is(':checked') ? elem.val() : 'normal');
			this.game.settings.set(update);
		}
	});

})(Backbone.View);
