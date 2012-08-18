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

		statesStyleMap: {
			'is_selected': 'is_selected',
			'is_invalid': 'error',
			'is_matched': 'found'
		},

		initialize: function() {
			this.slot = this.options.slot;
			this.slot.on('change', this.handleSlotState, this);
			this.slot.on('change:card', this.render, this);
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
		},

		handleClick: function() {
			this.slot.toggleSelect();
		},

		handleSlotState: function(model, props) {
			props = _.extend({changes:{}}, props);

			var _this = this,
				styleMap = this.statesStyleMap;

			_.each(props.changes, function(val, key) {
				if (styleMap[key]) {
					_this.$el.toggleClass(styleMap[key], model.get(key));
				}
			});
		}
	});

})(window.Views.Bases.ParentView, window.Views.Card);
