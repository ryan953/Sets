/*global Backbone */
window.Views = window.Views || {};

window.Views.Slot = (function(Parent, Card) {
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
			this.model.on('change', this.renderSlotState, this);
			this.model.on('change:card', this.renderChildCard, this);
		},

		render: function() {
			this.renderSlotState();
			this.renderChildCard();
			return this;
		},

		renderSlotState: function(model, props) {
			props = props || {changes:{}};

			var _this = this,
				styleMap = this.statesStyleMap;

			_.each(props.changes, function(val, key) {
				if (styleMap[key]) {
					_this.$el.toggleClass(styleMap[key], model.get(key));
				}
			});
		},

		renderChildCard: function() {
			this.removeChild();

			var card = this.model.get('card');
			if (!_.isEmpty(card)) {
				this.cardView = new Card({
					model: card
				}).render();
				this.el.appendChild(this.cardView.el);
			}
		},

		remove: function() {
			Parent.prototype.remove.call(this);

			this.removeChild();
		},

		removeChild: function() {
			if (this.cardView) {
				this.cardView.remove();
				delete this.cardView;
			}
		},

		handleClick: function() {
			this.model.toggleSelect();
		}
	});

})(Backbone.View, window.Views.Card);
