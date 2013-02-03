/*global */
window.Views = window.Views || {};

window.Views.Slot = (function(Parent, CardView) {
	"use strict";

	return Parent.extend({
		tagName: 'td',
		className: 'slot',

		events: {
			click: 'handleClick'
		},

		enabledStyleMap: {
			is_selected: 'is_selected',
			is_invalid_trio: 'error',
			is_valid_trio: 'found'
		},

		initialize: function() {
			this.slot = this.options.slot;
			this.slot.on('change:card', this.render, this);
			this.slot.on('change', this.handleSlotState, this);
		},

		renderChildren: function() {
			var card = this.slot.get('card');
			if (_.isObject(card)) {
				var cardView = new CardView({
					card: card
				}).render();
				this.el.appendChild(cardView.el);
				return [cardView];
			}
			return [];
		},

		handleClick: function() {
			this.slot.toggleSelect();
		},

		handleSlotState: function(model) {
			var enabledStyleMap = this.enabledStyleMap,
				disabledStyleMap = this.disabledStyleMap;

			_.each(enabledStyleMap, function(className, key) {
				this.$el.toggleClass(className, model.get(key));
			}, this);
			if (this.options.settings.get('debug-not-possible') == 'on') {
				this.$el.toggleClass('debug-not-possible', !model.get('is_possible'));
			}

			if (model.get('is_possible_revealed')) {
				this.$el.toggleClass('not-possible', !model.get('is_possible'));
			} else {
				this.$el.removeClass('not-possible');
			}
		}
	});

})(window.Views.Bases.ParentView, window.Views.Card);
