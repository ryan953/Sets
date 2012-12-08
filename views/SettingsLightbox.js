/*global $ _ Backbone document */
window.Views = window.Views || {};

window.Views.SettingsLightbox = (function(Parent) {
	"use strict";

	/**
	 * window.Models.Settings
	 * defaults: { <model-field>:<default on or off val> }
	 *
	 * HTML
	 * <input type="checkbox" id="<elemId>" name="<model-field>" value="<onVal>" data-off="<offVal" />
	 *
	 * View renderer
	 * (elem, settingName, value) = (<elemId>, <model-field>, <onVal>)
	 */

	return Parent.extend({
		tagName: 'div',
		className: 'lightbox hide',

		events: {
			'change input[type=checkbox]': 'changeCheckbox',
			'change input[type=text]': 'changeText'
		},

		_cachedElems: {},

		initialize: function(options) {
			this.settings = options.game.settings;

			this.template = _.template($('#tmpl-settingslightbox').text());

			this.createRenderFunctions();
			this.bindToSettings();
		},

		createRenderFunctions: function() {
			this.renderModeEasy = _.bind(this.renderCheckbox, this,
				'settings-mode-easy', 'mode', 'easy');
			this.renderHelpOn = _.bind(this.renderCheckbox, this,
				'settings-help-on', 'help');
			this.renderSlotDelay = _.bind(this.renderTextbox, this,
				'settings-invalid-slot-delay', 'invalid-slot-delay');
			this.renderEndGameOnNonPossible = _.bind(this.renderCheckbox, this,
				'settings-end-on-non-possible-on', 'end-game-on-non-possible');
		},

		bindToSettings: function() {
			this.settings.on('change:mode', this.renderModeEasy, this);
			this.settings.on('change:help', this.renderHelpOn, this);
			this.settings.on('change:invalid-slot-delay', this.renderSlotDelay(), this);
		},

		render: function() {
			this.$el.html(this.template());
			this.addCloseButton();

			this.renderModeEasy();
			this.renderHelpOn();
			this.renderSlotDelay();
			this.renderEndGameOnNonPossible();

			return this;
		},

		remove: function() {
			Parent.prototype.remove.call(this);
			this.settings.off('change:mode', this.renderModeEasy, this);
			this.settings.off('change:help', this.renderHelpOn, this);
			this.settings.off('change:invalid-slot-delay', this.renderSlotDelay(), this);
		},

		_cachedElem: function(elem) {
			if (!this._cachedElems[elem]) {
				this._cachedElems[elem] = this.$(elem);
			}
			return this._cachedElems[elem];
		},

		renderCheckbox: function(elem, settingName, value) {
			value = value || 'on';
			this._cachedElem(elem).prop('checked',
				this.settings.get(settingName) === value);
		},

		renderTextbox: function(elem, settingName) {
			this._cachedElem(elem).val(this.settings.get(settingName));
		},

		changeCheckbox: function(e) {
			var elem = $(e.target),
				update = {},
				onVal = elem.val() || 'on',
				offVal = elem.data('off') || 'off';

			update[elem.attr('name')] = (elem.is(':checked') ? onVal : offVal);
			this.settings.set(update);
		},

		changeText: function(e) {
			var elem = $(e.target),
				update = {};
			update[elem.attr('name')] = elem.val();
			this.settings.set(update);
		}
	});

})(window.Views.Bases.LightboxView);
