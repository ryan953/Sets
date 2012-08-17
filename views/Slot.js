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
			this.slot.on('change', this.renderSlotState, this);
			this.slot.on('change:card', this.replaceChild, this);
		},

		render: function() {
			Parent.prototype.render.call(this);
			this.renderSlotState();
			return this;
		},

		renderSlotState: function(model, props) {
			props = _.extend({changes:{}}, props);

			var _this = this,
				styleMap = this.statesStyleMap;

			_.each(props.changes, function(val, key) {
				if (styleMap[key]) {
					_this.$el.toggleClass(styleMap[key], model.get(key));
				}
			});
		},

		replaceChild: function() {
			this.removeChildren();
			this.renderChildren();
		},

		renderChildren: function() {
			var card = this.slot.get('card');
			if (_.isObject(card)) {
				this.child_views.cardView = new CardView({
					card: card
				}).render();
				this.el.appendChild(this.child_views.cardView.el);
			}
		},

		handleClick: function() {
			this.slot.toggleSelect();
		}
	});

})(window.Views.Bases.ParentView, window.Views.Card);
