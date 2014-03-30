define([
	'underscore',
	'thorax',
	'v!./card'
], function(_, Thorax, CardView) {
	"use strict";

	return Thorax.LayoutView.extend({
		tagName: 'td',
		className: 'slot',

		events: {
			'nested click': function() {
				this.model.toggleSelect();
			},
			model: {
				'change:card': 'render',
				'change': 'handleSlotState'
			}
		},

		enabledStyleMap: {
			is_selected: 'is_selected',
			is_invalid_trio: 'error',
			is_valid_trio: 'found'
		},

		disabledStyleMap: {
			is_possible: ''
		},

		initialize: function() {
			this.setModel(
				this.board.at(this.position)
			);
		},

		render: function() {
			Thorax.View.prototype.render.call(this);
			this.handleSlotState(this.model);

			var card = this.model.get('card');
			if (card) {
				this.setView(new CardView({
					model: card
				}));
			}
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
