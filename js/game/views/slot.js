define([
	'underscore',
	'view',
	'./card'
], function(_, Parent, CardView) {
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

		disabledStyleMap: {
			is_possible: ''
		},

		initialize: function(options) {
			this.slot = options.slot;
			this.settings = options.settings;
			this.listenTo(this.slot, 'change:card', this.render);
			this.listenTo(this.slot, 'change', this.handleSlotState);
		},

		render: function() {
			Parent.prototype.render.call(this);
			this.handleSlotState(this.slot);
			return this;
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

			if (model.get('is_possible_revealed')) {
				disabledStyleMap.is_possible += ' not-possible';
			} else {
				this.$el.removeClass('not-possible');
			}
			if (this.settings.get('debug-not-possible') == 'on') {
				disabledStyleMap.is_possible += ' debug-not-possible';
			}

			_.each(enabledStyleMap, function(className, key) {
				this.$el.toggleClass(className, model.get(key));
			}, this);
			_.each(disabledStyleMap, function(className, key) {
				this.$el.toggleClass(className, !model.get(key));
			}, this);
		}
	});

});
