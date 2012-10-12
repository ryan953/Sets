/*global $ _ Backbone document */
window.Views = window.Views || {};

window.Views.SettingsLightbox = (function(Parent) {
	"use strict";

	return Parent.extend({
		tagName: 'div',
		className: 'lightbox hide',

		events: {
			'change input[type=checkbox]': 'changeCheckbox',
			'change input[type=text]': 'changeText'
		},

		initialize: function(options) {
			this.settings = options.game.settings;

			this.settings.on('change:mode', this.renderModeEasy, this);
			this.settings.on('change:help', this.renderHelpOn, this);

			this.template = _.template($('#tmpl-settingslightbox').text());
		},

		render: function() {
			this.$el.html(this.template());

			this.mode_easy = this.$('#settings-mode-easy');
			this.help_on = this.$('#settings-help-on');

			this.renderModeEasy();
			this.renderHelpOn();

			return this;
		},

		renderModeEasy: function() {
			this.mode_easy.prop('checked',
				this.settings.get('mode') === 'easy');
		},

		renderHelpOn: function() {
			this.help_on.prop('checked',
				this.settings.get('help'));
		},

		changeCheckbox: function(e) {
			var elem = $(e.target),
				update = {};
			update[elem.attr('name')] = (elem.is(':checked') ? elem.val() : 'normal');
			this.settings.set(update);
		},

		changeText: function(e) {
			var elem = $(e.target),
				update = {};
			update[elem.attr('name')] = elem.val();
			this.settings.set(update);
		}
	});

})(Backbone.View);
