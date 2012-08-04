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

		initialize: function() {
			this.model.on('change:is_selected', this.renderSlot, this);
			this.model.on('change:is_invalid', this.renderInvalid, this);
			this.model.on('change:card', this.renderChild, this);
		},

		render: function() {
			this.renderSlot();
			this.renderChild();
			return this;
		},

		renderSlot: function() {
			this.$el
				.toggleClass('is_selected', this.model.get('is_selected'));
		},

		renderInvalid: function() {
			this.$el.toggleClass('error', this.model.get('is_invalid'));
		},

		renderChild: function() {
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
